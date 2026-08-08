// src/components/doctor-dashboard/LiveQueueSection.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { ListOrdered, Play } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getDoctorQueue, startConsultation, type QueuePatientData } from "@/lib/api";

const STATUS_STYLES: Record<string, { border: string; badge: string }> = {
  "in-room": { border: "#22C55E", badge: "bg-green-100 text-green-700" },
  waiting: { border: "#F97316", badge: "bg-orange-100 text-orange-600" },
};

export default function LiveQueueSection() {
  const { token } = useAuth();
  const [queue, setQueue] = useState<QueuePatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    getDoctorQueue(token)
      .then(setQueue)
      .catch(() => setQueue([]))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // Refresh when PatientDetailCard completes a consultation elsewhere
  useEffect(() => {
    const handler = () => load();
    window.addEventListener("queue-updated", handler);
    return () => window.removeEventListener("queue-updated", handler);
  }, [load]);

  const handleStart = async (id: string) => {
    if (!token) return;
    setStartingId(id);
    try {
      await startConsultation(token, id);
      load();
      window.dispatchEvent(new Event("queue-updated"));
    } catch (err) {
      console.error("Failed to start consultation:", err);
    } finally {
      setStartingId(null);
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
            const style = STATUS_STYLES[patient.status];
            return (
              <div
                key={patient.id}
                className="flex items-center gap-2.5 rounded-lg border-l-4 bg-gray-50 p-2.5"
                style={{ borderLeftColor: style.border }}
              >
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {patient.name.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{patient.name}</p>
                  <p className="text-xs text-gray-400 truncate">{patient.reason}</p>
                </div>
                {patient.status === "waiting" ? (
                  <button
                    type="button"
                    onClick={() => handleStart(patient.id)}
                    disabled={startingId === patient.id}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 border border-blue-200 rounded-full px-2.5 py-1 hover:bg-blue-50 transition-colors shrink-0 disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" />
                    Start
                  </button>
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