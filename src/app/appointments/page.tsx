"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  getPatientAppointments,
  getDoctorAllAppointments,
  cancelAppointment,
  type DoctorAppointmentData,
} from "@/lib/api";
import { Calendar, Clock, Search, X } from "lucide-react";

interface PatientAppointmentItem {
  id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  doctor: {
    id: number;
    name: string;
    slug: string;
    specialization: string;
    profile_image: string | null;
  };
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-600",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-50 text-red-600",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AppointmentsPage() {
  const router = useRouter();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6">
        {user.role === "patient" ? <PatientAppointments token={token!} /> : <DoctorAppointments token={token!} />}
      </main>
      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Patient view
// ---------------------------------------------------------------------------

function PatientAppointments({ token }: { token: string }) {
  const [history, setHistory] = useState<PatientAppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const load = useCallback(() => {
    getPatientAppointments(token)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = history.filter((a) => a.appointment_date >= todayStr && a.status !== "cancelled" && a.status !== "completed");
  const past = history.filter((a) => !(a.appointment_date >= todayStr && a.status !== "cancelled" && a.status !== "completed"));
  const list = tab === "upcoming" ? upcoming : past;

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    try {
      await cancelAppointment(token, String(id));
      load();
    } catch (err) {
      console.error("Failed to cancel:", err);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
      <h1 className="text-lg font-bold text-gray-900 mb-4">My Appointments</h1>

      <div className="flex gap-4 border-b border-gray-100 mb-3">
        <button
          type="button"
          onClick={() => setTab("upcoming")}
          className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${tab === "upcoming" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}
        >
          Upcoming
        </button>
        <button
          type="button"
          onClick={() => setTab("past")}
          className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${tab === "past" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}
        >
          Past
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-50" />)}
        </div>
      ) : list.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          {tab === "upcoming" ? "No upcoming appointments." : "No past appointments yet."}
        </p>
      ) : (
        <div className="space-y-1">
          {list.map((appt) => (
            <div key={appt.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={appt.doctor.profile_image ?? "https://i.pravatar.cc/300"}
                alt={appt.doctor.name}
                className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{appt.doctor.name}</p>
                <p className="text-xs text-gray-400 truncate">{appt.doctor.specialization}</p>
              </div>
              <div className="hidden sm:flex flex-col items-end text-xs text-gray-500 shrink-0">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{appt.appointment_date}</span>
                <span className="flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{appt.appointment_time}</span>
              </div>
              <StatusBadge status={appt.status} />
              {tab === "upcoming" && appt.status !== "cancelled" && (
                <button
                  type="button"
                  onClick={() => handleCancel(appt.id)}
                  disabled={cancellingId === appt.id}
                  className="text-xs font-semibold text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors shrink-0 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Doctor view
// ---------------------------------------------------------------------------

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function DoctorAppointments({ token }: { token: string }) {
  const [appointments, setAppointments] = useState<DoctorAppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getDoctorAllAppointments(token, { status, search: search || undefined })
      .then(setAppointments)
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [token, status, search]);

  useEffect(() => {
    const timeout = setTimeout(load, 300); // debounce search typing
    return () => clearTimeout(timeout);
  }, [load]);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await cancelAppointment(token, id);
      load();
    } catch (err) {
      console.error("Failed to cancel:", err);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
      <h1 className="text-lg font-bold text-gray-900 mb-4">Appointments</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                status === f.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-50" />)}
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No appointments found.</p>
      ) : (
        <div className="space-y-1">
          {appointments.map((appt) => (
            <div key={appt.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <span className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                {appt.patientName.charAt(0).toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{appt.patientName}</p>
                <p className="text-xs text-gray-400 truncate">
                  {appt.age ? `${appt.age} Yr` : "—"}{appt.gender ? ` • ${appt.gender}` : ""} • {appt.phone}
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end text-xs text-gray-500 shrink-0">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{appt.date}</span>
                <span className="flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{appt.time}</span>
              </div>
              <StatusBadge status={appt.status} />
              {(appt.status === "pending" || appt.status === "confirmed") && (
                <button
                  type="button"
                  onClick={() => handleCancel(appt.id)}
                  disabled={cancellingId === appt.id}
                  className="text-xs font-semibold text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors shrink-0 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}