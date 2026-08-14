"use client";

import { useEffect, useState, useCallback } from "react";
import {
  PendingAppointmentData,
  getPendingAppointments,
  approveAppointment,
  declineAppointment,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Check, X, Clock } from "lucide-react";

export default function PendingApprovalsSection() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<PendingAppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getPendingAppointments(token);
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch pending approvals:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      await approveAppointment(token, id);
      setAppointments((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to approve appointment:", error);
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      await declineAppointment(token, id);
      setAppointments((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to decline appointment:", error);
    } finally {
      setActionId(null);
    }
  };

  if (loading || appointments.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Pending Approval Requests
          </h2>
        </div>
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
          {appointments.length}
        </span>
      </div>

      {/* Grid view for cards instead of wide stretched rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="flex flex-col justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/60 transition"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-slate-900 truncate">
                  {appt.patientName}
                </h3>
                <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {appt.gender || "N/A"}, {appt.age ? `${appt.age}y` : ""}
                </span>
              </div>
              
              <p className="text-xs text-blue-600 font-medium">
                {appt.date} • {appt.time}
              </p>
              
              <p className="text-xs text-slate-500">{appt.phone}</p>

              {appt.notes && (
                <p className="text-xs text-slate-600 italic bg-white/80 p-1.5 rounded border border-slate-100 mt-1 line-clamp-2">
                  "{appt.notes}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200/50">
              <button
                onClick={() => handleApprove(appt.id)}
                disabled={actionId === appt.id}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                onClick={() => handleDecline(appt.id)}
                disabled={actionId === appt.id}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-lg border border-rose-200 transition disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" /> Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}