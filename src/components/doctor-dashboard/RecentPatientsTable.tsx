// src/components/doctor-dashboard/RecentPatientsTable.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "@/context/AuthContext";
import { getDoctorRecentPatients, type RecentPatientData } from "@/lib/api";
import type { PatientStatus } from "@/lib/doctor-dashboard-data";

const statusStyles: Record<PatientStatus, string> = {
  "In Room": "bg-green-100 text-green-700",
  Waiting: "bg-orange-100 text-orange-600",
  Completed: "bg-gray-100 text-gray-500",
};

export default function RecentPatientsTable() {
  const { token } = useAuth();
  const [patients, setPatients] = useState<RecentPatientData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getDoctorRecentPatients(token)
      .then(setPatients)
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 h-full">
  {loading ? (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-50" />
      ))}
    </div>
  ) : patients.length === 0 ? (
    <p className="text-sm text-gray-400 text-center py-6">
      No recent patients yet.
    </p>
  ) : (
    <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
      {patients.map((patient) => (
        <div
          key={patient.id}
          className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
        >
          <Avatar
            name={patient.name}
            avatarUrl={patient.avatarUrl}
            size="sm"
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {patient.name}
            </p>

            <p className="text-xs text-gray-400">
              {patient.age ? `${patient.age} Yr` : "—"}
              {patient.gender ? ` • ${patient.gender}` : ""} •{" "}
              {patient.time}
            </p>
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
              statusStyles[patient.status]
            }`}
          >
            {patient.status}
          </span>
        </div>
      ))}
    </div>
  )}
</div>
  );
}