"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Phone, ArrowRight } from "lucide-react";
import { getDoctorUpcomingAppointments } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Appointment } from "@/lib/doctor-dashboard-data";

export default function UpcomingAppointmentsTable() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getDoctorUpcomingAppointments(token)
      .then(setAppointments)
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800">Upcoming Appointments</h3>
        <Link href="/appointments" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
       View All
  <ArrowRight className="w-3.5 h-3.5" />
</Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-50" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No upcoming appointments.</p>
      ) : (
        <div className="max-h-[350px] overflow-y-auto pr-1 space-y-1">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-1.5 text-gray-500 w-20 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{appt.time}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{appt.patientName}</p>
                <p className="text-xs text-gray-400 truncate">{appt.reason}</p>
              </div>
              
                <a href={`tel:${appt.phone}`}
                className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors shrink-0"
                aria-label={`Call ${appt.patientName}`}
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}