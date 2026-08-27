"use client";

import { useEffect, useState } from "react";
import { getMyDoctorProfile, type MyDoctorProfile } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Settings, UserPlus, ClipboardList } from "lucide-react";
import Footer from "@/components/layout/Footer";
import StatsSection from "@/components/doctor-dashboard/StatsSection";
import LiveQueueSection from "@/components/doctor-dashboard/LiveQueueSection";
import PatientDetailCard from "@/components/doctor-dashboard/PatientDetailCard";
import PrescriptionSection from "@/components/doctor-dashboard/PrescriptionSection";
import WeeklyScheduleSection from "@/components/doctor-dashboard/WeeklyScheduleSection";
import UpcomingAppointmentsTable from "@/components/doctor-dashboard/UpcomingAppointmentsTable";
import RecentPatientsTable from "@/components/doctor-dashboard/RecentPatientsTable";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [profile, setProfile] = useState<MyDoctorProfile | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);

  // Fetch Doctor Profile
  useEffect(() => {
    if (!token) return;
    getMyDoctorProfile(token)
      .then(setProfile)
      .catch(() => {});
  }, [token]);

  // Fetch Pending Requests Count with 3-Second Real-Time Auto Polling
  useEffect(() => {
    if (!token) return;

    const fetchPendingCount = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${API_URL}/doctor/dashboard/pending-appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          const requestsList = Array.isArray(data) ? data : data.data || [];
          setPendingCount(requestsList.length);
        }
      } catch (error) {
        console.error("Failed to fetch pending requests count:", error);
      }
    };

    fetchPendingCount();
    // ⚡ Fast Background Polling Every 3 Seconds
    const interval = setInterval(fetchPendingCount, 3000); 

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "doctor") {
      router.replace("/patient-dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile?.profileImage ?? "https://i.pravatar.cc/300"}
              alt={profile?.name ?? "Doctor"}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div>
              <h1 className="text-lg font-semibold text-[#0D1B3E] sm:text-xl">
                Welcome, Dr. {profile?.name ?? user?.name ?? ""}
              </h1>
              {profile?.specialization && (
                <p className="text-sm text-gray-500">{profile.specialization}</p>
              )}
            </div>
          </div>

          <Link
            href="/doctor-dashboard/profile/edit"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Settings className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>

        {/* Quick CTA Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Appointment Requests Link with Red Badge Counter */}
          <Link
            href="/doctor-dashboard/requests"
            className="relative flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5" />
              </span>

              {/*  RED BADGE NOTIFICATION */}
              {pendingCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white shadow-xs animate-bounce">
                  {pendingCount > 99 ? "99+" : pendingCount}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-800">Appointment Requests</p>
                {pendingCount > 0 && (
                  <span className="text-xs font-semibold text-rose-500 sm:hidden">
                    {pendingCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">Review patient booking requests</p>
            </div>
          </Link>

          <Link
            href="/doctor-dashboard/add-appointment"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-gray-800">Add Appointment</p>
              <p className="text-xs text-gray-400">Create a walk-in booking</p>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <StatsSection />

        {/* Live Queue + Patient Detail/Prescription */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          <LiveQueueSection />
          <div>
            <PatientDetailCard />
            <PrescriptionSection />
          </div>
        </div>

      
        {/* Appointments + Recent Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UpcomingAppointmentsTable />
          <RecentPatientsTable />
        </div>
          {/* Weekly Schedule */}
        <WeeklyScheduleSection />

      </main>
      <Footer />
    </div>
  );
}