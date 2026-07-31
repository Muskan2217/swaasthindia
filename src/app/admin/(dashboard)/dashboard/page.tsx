"use client";

// src/app/admin/(dashboard)/dashboard/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Clock,
  BadgeCheck,
  Users,
  CalendarClock,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  UserPlus,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import ErrorState from "@/components/admin/ErrorState";
import { getDashboardStats, getRecentActivities } from "@/lib/admin/services";
import { ApiError } from "@/lib/admin/api-client";
import type { DashboardStats, RecentActivities } from "@/types/admin";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, activitiesRes] = await Promise.all([getDashboardStats(), getRecentActivities(5)]);
      setStats(statsRes);
      setActivities(activitiesRes);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return <ErrorState message={error ?? "No data available."} onRetry={load} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Stethoscope} label="Total Doctors" value={stats.total_doctors} iconColor="blue" />
        <StatCard icon={Clock} label="Pending Doctors" value={stats.pending_doctors} iconColor="amber" />
        <StatCard icon={BadgeCheck} label="Verified Doctors" value={stats.verified_doctors} iconColor="green" />
        <StatCard icon={Users} label="Total Patients" value={stats.total_patients} iconColor="blue" />
        <StatCard icon={CalendarClock} label="Today's Appointments" value={stats.today_appointments} iconColor="navy" />
        <StatCard icon={CalendarCheck} label="Total Appointments" value={stats.total_appointments} iconColor="navy" />
        <StatCard icon={CheckCircle2} label="Completed Appointments" value={stats.completed_appointments} iconColor="green" />
        <StatCard icon={XCircle} label="Cancelled Appointments" value={stats.cancelled_appointments} iconColor="red" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0D1B3E]">Recent Appointments</h2>
            <Link href="/admin/appointments" className="text-xs font-medium text-[#2563EB] hover:text-blue-700">
              View All
            </Link>
          </div>
          {activities && activities.recent_appointments.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {activities.recent_appointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{appt.patient_name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {appt.doctor.name} · {appt.appointment_date} at {appt.appointment_time}
                    </p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">No recent appointments.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-[#0D1B3E]">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/admin/doctors"
              className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-100 px-3 py-3 text-center text-xs font-medium text-slate-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve Doctor
            </Link>
            <Link
              href="/admin/doctors"
              className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-100 px-3 py-3 text-center text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <UserPlus className="h-4 w-4" />
              View Doctors
            </Link>
            <Link
              href="/admin/appointments"
              className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-100 px-3 py-3 text-center text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <CalendarCheck className="h-4 w-4" />
              View Appointments
            </Link>
            <Link
              href="/admin/patients"
              className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-100 px-3 py-3 text-center text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Users className="h-4 w-4" />
              Manage Patients
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Doctor Registrations */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#0D1B3E]">Recent Doctor Registrations</h2>
          <Link href="/admin/doctors" className="text-xs font-medium text-[#2563EB] hover:text-blue-700">
            View All
          </Link>
        </div>
        {activities && activities.recent_doctor_registrations.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {activities.recent_doctor_registrations.map((doc) => (
              <Link key={doc.id} href={`/admin/doctors/${doc.id}`} className="rounded-lg border border-slate-100 p-3 transition hover:border-blue-100 hover:bg-blue-50/40">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={doc.profile_image ?? "https://i.pravatar.cc/150"} alt={doc.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{doc.name}</p>
                    <p className="truncate text-xs text-slate-500">{doc.specialization}</p>
                  </div>
                </div>
                <div className="mt-2.5">
                  <StatusBadge status={doc.is_verified ? "verified" : "pending"} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-slate-400">No recent registrations.</p>
        )}
      </div>
    </div>
  );
}
