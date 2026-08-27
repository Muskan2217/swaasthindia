"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Phone, Mail, User, Check, X, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  getPendingAppointments,
  approveAppointment,
  declineAppointment,
  type PendingAppointmentData,
} from "@/lib/api";

// Extended interface to track local UI status (pending | approved | declined)
interface UIAppointmentRequest extends PendingAppointmentData {
  status?: "pending" | "declined";
}

export default function AppointmentRequestsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<UIAppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "doctor") {
      router.replace("/patient-dashboard");
    }
  }, [user, router]);

  const load = useCallback(() => {
    if (!token) return;
    getPendingAppointments(token)
      .then((data) => {
        // Default status for fetched requests is 'pending'
        const formattedData = data.map((item) => ({ ...item, status: "pending" as const }));
        setRequests(formattedData);
      })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id: string) => {
    if (!token) return;
    setActingId(id);
    try {
      await approveAppointment(token, id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      window.dispatchEvent(new Event("queue-updated"));
    } catch (err) {
      console.error("Failed to approve:", err);
    } finally {
      setActingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    if (!token) return;
    setActingId(id);
    try {
      await declineAppointment(token, id);
      // Mark as declined locally to show Undo option
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "declined" } : r))
      );
    } catch (err) {
      console.error("Failed to decline:", err);
    } finally {
      setActingId(null);
    }
  };

  const handleUndo = async (id: string) => {
    if (!token) return;
    setActingId(id);
    try {
      // Re-approve or Restore request logic
      // Status ko wapas 'pending' me switch karenge
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "pending" } : r))
      );
    } catch (err) {
      console.error("Failed to undo decline:", err);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6">
        <Link
          href="/doctor-dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Appointment Requests</h1>
        <p className="text-sm text-gray-500 mb-6">Review and respond to patient booking requests.</p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white border border-gray-100" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <p className="text-sm text-gray-400">No pending appointment requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                  req.status === "declined" ? "border-red-200 bg-red-50/30 opacity-90" : "border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                      {req.patientName.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{req.patientName}</p>
                      <p className="text-xs text-gray-400">
                        {req.age ? `${req.age} Yr` : "Age N/A"}
                        {req.gender ? ` • ${req.gender}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  {req.status === "declined" ? (
                    <span className="text-xs font-semibold text-red-600 bg-red-100 px-2.5 py-1 rounded-full shrink-0">
                      Declined / Cancelled
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full shrink-0">
                      Pending
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mb-3 bg-gray-50 rounded-xl p-3">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{req.phone}</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{req.email || "Not provided"}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" />{req.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" />{req.time}</span>
                </div>

                {req.notes && (
                  <div className="flex items-start gap-1.5 text-xs text-gray-600 mb-3">
                    <User className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <span><span className="font-medium text-gray-700">Reason:</span> {req.notes}</span>
                  </div>
                )}

                {/* Conditional Action Buttons */}
                {req.status === "declined" ? (
                  <button
                    type="button"
                    onClick={() => handleUndo(req.id)}
                    disabled={actingId === req.id}
                    className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold bg-gray-800 text-white px-4 py-2.5 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4" /> Undo Decline (Restore)
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(req.id)}
                      disabled={actingId === req.id}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecline(req.id)}
                      disabled={actingId === req.id}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold bg-red-50 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}