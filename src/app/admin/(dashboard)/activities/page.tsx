"use client";

// src/app/admin/(dashboard)/activities/page.tsx
import { useEffect, useState, useCallback } from "react";
import { Stethoscope, CalendarCheck, UserPlus } from "lucide-react";
import ErrorState from "@/components/admin/ErrorState";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import { getRecentActivities } from "@/lib/admin/services";
import { ApiError } from "@/lib/admin/api-client";
import type { RecentActivities } from "@/types/admin";

interface TimelineEntry {
  id: string;
  icon: typeof Stethoscope;
  iconColor: string;
  title: string;
  subtitle: string;
  badge?: string;
  timestamp: string | null;
}

function buildTimeline(data: RecentActivities): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  data.recent_doctor_registrations.forEach((doc) => {
    entries.push({
      id: `doctor-${doc.id}`,
      icon: Stethoscope,
      iconColor: "bg-blue-50 text-blue-600",
      title: `${doc.name} registered`,
      subtitle: `${doc.specialization} · ${doc.hospital_name}`,
      badge: doc.is_verified ? "verified" : "pending",
      timestamp: doc.created_at,
    });
  });

  data.recent_appointments.forEach((appt) => {
    entries.push({
      id: `appointment-${appt.id}`,
      icon: CalendarCheck,
      iconColor: "bg-amber-50 text-amber-600",
      title: `${appt.patient_name} booked an appointment`,
      subtitle: `with ${appt.doctor.name} · ${appt.appointment_date} at ${appt.appointment_time}`,
      badge: appt.status,
      timestamp: appt.created_at,
    });
  });

  data.recent_patients.forEach((patient) => {
    entries.push({
      id: `patient-${patient.id}`,
      icon: UserPlus,
      iconColor: "bg-green-50 text-green-700",
      title: `${patient.name} joined as a patient`,
      subtitle: patient.email,
      timestamp: patient.created_at,
    });
  });

  return entries.sort((a, b) => {
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

export default function ActivitiesPage() {
  const [data, setData] = useState<RecentActivities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRecentActivities(15);
      setData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load recent activities.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm" />;
  }

  if (error || !data) {
    return <ErrorState message={error ?? "No data available."} onRetry={load} />;
  }

  const timeline = buildTimeline(data);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      {timeline.length === 0 ? (
        <EmptyState title="No recent activity" description="New registrations and bookings will show up here." />
      ) : (
        <ol className="relative space-y-6 border-l border-slate-100 pl-6">
          {timeline.map((entry) => (
            <li key={entry.id} className="relative">
              <span className={`absolute -left-[34px] flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white ${entry.iconColor}`}>
                <entry.icon className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-slate-800">{entry.title}</p>
                {entry.badge && <StatusBadge status={entry.badge} />}
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{entry.subtitle}</p>
              {entry.timestamp && (
                <p className="mt-1 text-xs text-slate-400">{new Date(entry.timestamp).toLocaleString()}</p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
