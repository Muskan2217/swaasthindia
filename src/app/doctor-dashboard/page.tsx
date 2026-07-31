"use client";

import { useEffect, useState } from "react";
import { getMyDoctorProfile, type MyDoctorProfile } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Settings } from "lucide-react";
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

  useEffect(() => {
    if (!token) return;
    getMyDoctorProfile(token)
      .then(setProfile)
      .catch(() => {}); // dashboard still works even if this fails
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

        {/* Stats */}
        <StatsSection />

        {/* Live Queue + Patient Detail/Prescription -- side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          <LiveQueueSection />
          <div>
            <PatientDetailCard />
            <PrescriptionSection />
          </div>
        </div>

        {/* Weekly Schedule */}
        <WeeklyScheduleSection />

        {/* Appointments + Recent Patients -- side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UpcomingAppointmentsTable />
          <RecentPatientsTable />
        </div>
        <Footer />
      </main>
    </div>
  );
}