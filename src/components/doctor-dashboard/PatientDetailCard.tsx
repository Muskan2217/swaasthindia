// src/components/doctor-dashboard/PatientDetailCard.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { History, ChevronRight, Activity, CheckCircle, Edit2, Save, X, User } from "lucide-react";
import Avatar from "./Avatar";
import VitalCard from "./VitalCard";
import { useAuth } from "@/context/AuthContext";
import {
  getCurrentPatient,
  completeConsultation,
  updateVitals,
  type CurrentPatientData,
} from "@/lib/api";

export default function PatientDetailCard() {
  const { token } = useAuth();
  const [patient, setPatient] = useState<CurrentPatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [vitals, setVitals] = useState({ bp: "", temperature: "" });
  const [savingVitals, setSavingVitals] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    getCurrentPatient(token)
      .then((data) => {
        setPatient(data);
        if (data?.vitals) {
          setVitals({
            bp: data.vitals.bp || "",
            temperature: data.vitals.temperature || "",
          });
        }
      })
      .catch(() => setPatient(null))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // Sync queue updates when consultation starts/completes
  useEffect(() => {
    const handler = () => load();
    window.addEventListener("queue-updated", handler);
    return () => window.removeEventListener("queue-updated", handler);
  }, [load]);

  const handleComplete = async () => {
    if (!token || !patient) return;
    setCompleting(true);
    try {
      await completeConsultation(token, patient.id);
      window.dispatchEvent(new Event("queue-updated"));
      load();
    } catch (err) {
      console.error("Failed to complete consultation:", err);
    } finally {
      setCompleting(false);
    }
  };

  const handleSaveVitals = async () => {
    if (!token || !patient) return;
    setSavingVitals(true);
    try {
      await updateVitals(token, patient.id, vitals);
      setIsEditingVitals(false);
      load();
    } catch (err) {
      console.error("Failed to update vitals:", err);
    } finally {
      setSavingVitals(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse h-48" />
    );
  }

  if (!patient) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center py-10">
        <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No patient currently in room.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 space-y-4">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={patient.name} avatarUrl={patient.avatarUrl} size="lg" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">{patient.name}</h2>
            <p className="text-sm text-gray-500">
              {patient.age ? `${patient.age} Years` : "N/A"} &bull; {patient.gender || "N/A"} &bull; {patient.bloodGroup || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleComplete}
            disabled={completing}
            className="flex items-center gap-1.5 text-xs font-semibold bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {completing ? "Completing..." : "Complete"}
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vitals Section */}
      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-blue-500" /> Patient Vitals
          </span>
          {!isEditingVitals ? (
            <button
              type="button"
              onClick={() => setIsEditingVitals(true)}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" /> Edit Vitals
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveVitals}
                disabled={savingVitals}
                className="text-xs font-semibold text-green-600 hover:underline flex items-center gap-1"
              >
                <Save className="w-3 h-3" /> Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingVitals(false)}
                className="text-xs font-semibold text-gray-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          )}
        </div>

        {isEditingVitals ? (
          <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div>
              <label className="text-gray-500 block mb-1 font-medium">BP</label>
              <input
                type="text"
                value={vitals.bp}
                onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                placeholder="120/80"
                className="w-full border bg-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-500 block mb-1 font-medium">Temperature</label>
              <input
                type="text"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                placeholder="98.6 °F"
                className="w-full border bg-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <VitalCard type="bp" value={patient.vitals?.bp || "N/A"} />
            <VitalCard type="temperature" value={patient.vitals?.temperature || "N/A"} />
          </div>
        )}
      </div>
    </div>
  );
}