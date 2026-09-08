// src/components/doctor-dashboard/LiveQueueSection.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { ListOrdered, Play, Pause, Plus, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  getDoctorQueue, 
  startConsultation, 
  pauseConsultation, 
  addConsultationTime, 
  type QueuePatientData 
} from "@/lib/api";

const STATUS_STYLES: Record<string, { border: string; badge: string }> = {
  "in-room": { border: "#22C55E", badge: "bg-green-100 text-green-700" },
  "time-reached": { border: "#DC2626", badge: "bg-red-100 text-red-600" },
  waiting: { border: "#F97316", badge: "bg-orange-100 text-orange-600" },
};

function formatTime(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function LiveQueueSection() {
  const { token } = useAuth();
  const [queue, setQueue] = useState<QueuePatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [timers, setTimers] = useState<Record<string, number>>({});

  const load = useCallback(() => {
    if (!token) return;
    getDoctorQueue(token)
      .then((data) => {
        setQueue(data);
        // Initialize timer values from fetched patient data
        const initialTimers: Record<string, number> = {};
        data.forEach((p) => {
          if (p.remainingConsultationSeconds !== undefined) {
            initialTimers[p.id] = p.remainingConsultationSeconds;
          }
        });
        setTimers(initialTimers);
      })
      .catch(() => setQueue([]))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // Local 1-second countdown ticker for active in-room patients
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        let hasChanges = false;
        queue.forEach((patient) => {
          if (patient.status === "in-room" && updated[patient.id] > 0 && !patient.consultationPausedAt) {
            updated[patient.id] = updated[patient.id] - 1;
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [queue]);

  // Refresh when PatientDetailCard completes a consultation elsewhere
  useEffect(() => {
    const handler = () => load();
    window.addEventListener("queue-updated", handler);
    return () => window.removeEventListener("queue-updated", handler);
  }, [load]);

  const handleStart = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      await startConsultation(token, id);
      load();
      window.dispatchEvent(new Event("queue-updated"));
    } catch (err) {
      console.error("Failed to start consultation:", err);
    } finally {
      setActionId(null);
    }
  };

  const handlePause = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      await pauseConsultation(token, id);
      load();
      window.dispatchEvent(new Event("queue-updated"));
    } catch (err) {
      console.error("Failed to pause consultation:", err);
    } finally {
      setActionId(null);
    }
  };

  const handleAddTime = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      await addConsultationTime(token, id, 300); // Adds 5 minutes (300 seconds)
      load();
      window.dispatchEvent(new Event("queue-updated"));
    } catch (err) {
      console.error("Failed to add consultation time:", err);
    } finally {
      setActionId(null);
    }
  };

  const waitingCount = queue.filter((q) => q.status === "waiting").length;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
          <ListOrdered className="w-4 h-4 text-blue-500" />
          Live Queue
        </h3>
        {waitingCount > 0 && (
          <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
            {waitingCount} Waiting
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-50" />
          ))}
        </div>
      ) : queue.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No patients in queue today.</p>
      ) : (
        <div className="space-y-2">
          {queue.map((patient) => {
            const style = STATUS_STYLES[patient.status] || STATUS_STYLES.waiting;
            const currentTimer = timers[patient.id] ?? patient.remainingConsultationSeconds ?? 0;
            const isTimeReached = patient.status === "time-reached" || currentTimer <= 0;

            return (
              <div
                key={patient.id}
                className="flex items-center gap-2.5 rounded-lg border-l-4 bg-gray-50 p-2.5"
                style={{ borderLeftColor: isTimeReached ? "#DC2626" : style.border }}
              >
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {patient.name.charAt(0).toUpperCase()}
                </span>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{patient.name}</p>
                  <p className="text-xs text-gray-400 truncate">{patient.reason}</p>
                </div>

                {/* Timer Display for In-Room / Time-Reached Patients */}
                {(patient.status === "in-room" || patient.status === "time-reached") && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-md shrink-0">
                    <Clock className="w-3 h-3 text-purple-600" />
                    <span className={`text-xs font-bold ${isTimeReached ? "text-red-600" : "text-purple-700"}`}>
                      {formatTime(currentTimer)}
                    </span>
                  </div>
                )}

                {/* Actions based on status */}
                {patient.status?.toLowerCase() === "waiting" ? (
  <button
    type="button"
    onClick={() => handleStart(patient.id)}
    disabled={actionId === patient.id}
    className="flex items-center gap-1 text-xs font-semibold text-blue-600 border border-blue-200 rounded-full px-2.5 py-1 hover:bg-blue-50 transition-colors shrink-0 disabled:opacity-50"
  >
    <Play className="w-3 h-3" />
    Start
  </button>
) : patient.status === "in-room" || patient.status === "time-reached" ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Pause Button */}
                    <button
                      type="button"
                      onClick={() => handlePause(patient.id)}
                      disabled={actionId === patient.id}
                      title="Pause Consultation"
                      className="p-1.5 text-amber-600 border border-amber-200 rounded-full hover:bg-amber-50 transition-colors disabled:opacity-50"
                    >
                      <Pause className="w-3 h-3" />
                    </button>

                    {/* Add Time (+5 mins) Button */}
                    <button
                      type="button"
                      onClick={() => handleAddTime(patient.id)}
                      disabled={actionId === patient.id}
                      title="Add 5 Minutes"
                      className="flex items-center gap-0.5 text-xs font-semibold text-green-600 border border-green-200 rounded-full px-2 py-1 hover:bg-green-50 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-3 h-3" />
                      +5m
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${style.badge}`}>
                    {patient.statusLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}