"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LiveQueueCard from "@/components/patient-dashboard/LiveQueueCard";
import {
  getPatientDashboardProfile,
  getPatientDashboardStats,
  getPatientAppointments,
  getPatientNextAppointment,
} from "@/lib/api";
import {
  Calendar,
  History,
  Pill,
  FolderOpen,
  Clock,
  User as UserIcon,
  Droplet,
  Phone,
  Stethoscope,
  FlaskConical,
  ChevronRight,
  ChevronLeft, 
  MapPin,       
  CalendarPlus,
} from "lucide-react";



const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
const BACKEND_URL = rawUrl.replace("/api", "");

// Builds a safe, absolute image URL whether the backend sent a full URL
// (e.g. from Storage::disk('public')->url()) or just a relative storage
// path. Works the same way on localhost and on the live production
// domain, since BACKEND_URL always comes from the current environment's
// NEXT_PUBLIC_API_URL instead of being hardcoded.
function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return "https://i.pravatar.cc/300";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_URL}/storage/${path}`;
}

// ---------------------------------------------------------------------------
// Types — match the backend contracts exactly
// ---------------------------------------------------------------------------

interface PatientProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  patient_code: string;
  age: number | null;
  blood_group: string | null;
  profile_image: string | null;
}

interface PatientStats {
  pending: number;
  upcoming: number;
  previous: number;
  completed: number;
}

interface AppointmentHistoryItem {
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

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-600",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-50 text-red-600",
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${styles[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {label}
    </span>
  );
}

function AppointmentRow({ appt }: { appt: AppointmentHistoryItem }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveImageUrl(appt.doctor.profile_image)}
        alt={appt.doctor.name}
        className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-100 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {appt.doctor.name}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {appt.doctor.specialization}
        </p>
      </div>
      <div className="hidden sm:flex flex-col items-end text-xs text-gray-500 shrink-0">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(appt.appointment_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" />
          {appt.appointment_time}
        </span>
      </div>
      <StatusBadge status={appt.status} />
      <Link
        href={`/doctor-profile/${appt.doctor.slug}`}
        className="text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors shrink-0"
      >
        View Details
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function PatientDashboard() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [history, setHistory] = useState<AppointmentHistoryItem[]>([]);
  const [nextAppointment, setNextAppointment] =
    useState<AppointmentHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [currentApptIndex, setCurrentApptIndex] = useState(0);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "patient") {
      router.replace("/doctor-dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        const [profileData, statsData, appointmentsData, nextAppointmentData] =
          await Promise.all([
            getPatientDashboardProfile(token),
            getPatientDashboardStats(token),
            getPatientAppointments(token),
            getPatientNextAppointment(token),
          ]);

        setProfile(profileData);
        setStats(statsData);
        setHistory(appointmentsData);
        setNextAppointment(nextAppointmentData);
      } catch (err) {
        console.error("Failed to load patient dashboard:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const todayStr = new Date().toISOString().slice(0, 10);

  const upcoming = history
    .filter(
      (a) =>
        a.appointment_date >= todayStr &&
        a.status !== "cancelled" &&
        a.status !== "completed",
    )
    .sort((a, b) =>
      (a.appointment_date + a.appointment_time).localeCompare(
        b.appointment_date + b.appointment_time,
      ),
    );

  const past = history
    .filter(
      (a) =>
        !(
          a.appointment_date >= todayStr &&
          a.status !== "cancelled" &&
          a.status !== "completed"
        ),
    )
    .sort((a, b) =>
      (b.appointment_date + b.appointment_time).localeCompare(
        a.appointment_date + a.appointment_time,
      ),
    );

  const visibleList = tab === "upcoming" ? upcoming : past;

  const currentAppt = upcoming[currentApptIndex] ?? null;

const handlePrev = () => {
  if (upcoming.length === 0) return;
  setCurrentApptIndex((prev) => (prev > 0 ? prev - 1 : upcoming.length - 1));
};

const handleNext = () => {
  if (upcoming.length === 0) return;
  setCurrentApptIndex((prev) => (prev < upcoming.length - 1 ? prev + 1 : 0));
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
          <div className="h-24 animate-pulse rounded-2xl bg-white border border-gray-100" />
          <div className="h-64 animate-pulse rounded-2xl bg-white border border-gray-100" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">

{/*  Live Queue Card */}
  <LiveQueueCard />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Upcoming Appointments"
            value={stats?.upcoming ?? 0}
            accentColor="#2563EB"
            bgColor="#EFF6FF"
          />
          <StatCard
            icon={<History className="w-5 h-5" />}
            label="Previous Appointments"
            value={stats?.previous ?? 0}
            accentColor="#16A34A"
            bgColor="#F0FDF4"
          />
          <StatCard
            icon={<Pill className="w-5 h-5" />}
            label="Active Prescriptions"
            value="Coming Soon"
            accentColor="#7C3AED"
            bgColor="#F5F3FF"
          />
          <StatCard
            icon={<FolderOpen className="w-5 h-5" />}
            label="Medical Records"
            value="Coming Soon"
            accentColor="#EA580C"
            bgColor="#FFF7ED"
          />
        </div>

{/* =========================================================
    1H PATIENT WELCOME CARD 
   ========================================================= */}
<div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-xs md:p-6">
  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={resolveImageUrl(profile?.profile_image)}
      alt={profile?.name ?? "Patient"}
      className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-slate-100 shadow-xs md:h-20 md:w-20"
    />
    <div className="min-w-0 flex-1">
      <h1 className="text-lg font-bold text-gray-900 md:text-xl">
        Welcome back, {profile?.name?.split(" ")[0] ?? user?.name} 👋
      </h1>
      {profile?.patient_code && (
        <p className="mt-0.5 text-sm font-medium text-gray-500">
          Patient ID:{" "}
          <span className="font-semibold text-blue-600">
            {profile.patient_code}
          </span>
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600 md:text-sm">
        <span className="flex items-center gap-1.5">
          <UserIcon className="h-4 w-4 text-gray-400" />
          Age {profile?.age ?? "—"}
        </span>
        <span className="flex items-center gap-1.5">
          <Droplet className="h-4 w-4 text-red-400" />
          {profile?.blood_group ?? "—"}
        </span>
        <span className="flex items-center gap-1.5">
          <Phone className="h-4 w-4 text-gray-400" />
          {profile?.mobile ?? "—"}
        </span>
      </div>
    </div>
  </div>
</div>

{/* =========================================================
    2. HORIZONTAL APPOINTMENT CARD (DOCTOR DETAILS + SCROLLER)
   ========================================================= */}
<div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
  <div className="grid grid-cols-1 divide-y divide-gray-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
    
    {/* LEFT HALF: APPOINTMENT WITH (DOCTOR DETAILS) */}
    <div className="flex flex-col justify-between space-y-4 p-5 md:p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Appointment With
        </span>
        {nextAppointment?.status && (
          <StatusBadge status={nextAppointment.status} />
        )}
      </div>

      {nextAppointment?.doctor ? (
        <div className="flex items-start gap-4 sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImageUrl(nextAppointment.doctor.profile_image)}
            alt={nextAppointment.doctor.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-blue-50 sm:h-16 sm:w-16"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold text-gray-900">
                Dr. {nextAppointment.doctor.name}
              </h3>
              
              {/* Safe check for experience property */}
              {"experience" in nextAppointment.doctor && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                  {(nextAppointment.doctor as Record<string, any>).experience}
                </span>
              )}
            </div>
            
            <p className="mt-0.5 truncate text-xs font-medium text-gray-500">
              {nextAppointment.doctor.specialization ?? "General Physician"}
            </p>
            
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-blue-600">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              <span>
                Location:{" "}
                <strong className="text-gray-700">
                  {"location" in nextAppointment.doctor
                    ? (nextAppointment.doctor as Record<string, any>).location
                    : "Etawah"}
                </strong>
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="py-2 text-sm text-gray-500">
          No active doctor assigned.
        </div>
      )}
    </div>

    {/* RIGHT HALF: NEXT APPOINTMENT SCROLLER */}
<div className="flex flex-col justify-between space-y-4 bg-slate-50/50 p-5 md:p-6">
  <div className="flex items-center justify-between">
    <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
      Next Appointment
    </span>

    {/* Carousel Navigation Arrows */}
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handlePrev}
        className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 transition shadow-2xs hover:bg-gray-50 active:scale-95"
        aria-label="Previous Appointment"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 transition shadow-2xs hover:bg-gray-50 active:scale-95"
        aria-label="Next Appointment"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </div>

  {currentAppt ? (
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Calendar className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-gray-900">
          {new Date(currentAppt.appointment_date).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          )}{" "}
          <span className="mx-0.5 text-gray-400 sm:mx-1">•</span>{" "}
          {currentAppt.appointment_time}
        </p>
        <p className="mt-0.5 truncate text-xs text-gray-500">
          Follow-up Consultation
        </p>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">No upcoming appointments</p>
      <Link
        href="/doctor-listing"
        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
      >
        <CalendarPlus className="h-3.5 w-3.5" />
        Book Now
      </Link>
    </div>
  )}
</div>

  </div>
</div>


        {/* My Appointments + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-800">
                My Appointments
              </h2>
            </div>
            <div className="flex gap-4 border-b border-gray-100 mb-2">
              <button
                type="button"
                onClick={() => setTab("upcoming")}
                className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
                  tab === "upcoming"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-400"
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setTab("past")}
                className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
                  tab === "past"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-400"
                }`}
              >
                Past
              </button>
            </div>

            {visibleList.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                {tab === "upcoming"
                  ? "No upcoming appointments."
                  : "No past appointments yet."}
              </p>
            ) : (
              <div>
                {visibleList.map((appt) => (
                  <AppointmentRow key={appt.id} appt={appt} />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <QuickAction
                icon={<Calendar className="w-4 h-4" />}
                iconBg="#DBEAFE"
                iconColor="#2563EB"
                title="Book an Appointment"
                subtitle="Doctors, Just a click away."
                href="/doctor-listing"
              />

              <QuickAction
                icon={<FolderOpen className="w-4 h-4" />}
                iconBg="#F3E8FF"
                iconColor="#7C3AED"
                title="View Medical Records"
                subtitle="Prescriptions, reports & more"
                comingSoon
              />
              <QuickAction
                icon={<FlaskConical className="w-4 h-4" />}
                iconBg="#FFEDD5"
                iconColor="#EA580C"
                title="Lab Tests"
                subtitle="Book lab tests & packages"
                comingSoon
              />
            </div>
          </div>
        </div>

        {/* Recent Prescriptions — no backend yet */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-1">
            Recent Prescriptions
          </h2>
          <p className="text-sm text-gray-400 text-center py-8">
            Prescriptions will appear here once available.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable pieces
// ---------------------------------------------------------------------------

function StatCard({
  icon,
  label,
  value,
  accentColor,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accentColor: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
      <span
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: bgColor, color: accentColor }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p
          className={
            typeof value === "number"
              ? "text-2xl font-bold text-gray-900"
              : "text-sm font-semibold mt-1"
          }
          style={typeof value !== "number" ? { color: accentColor } : undefined}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  href,
  comingSoon,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  href?: string;
  comingSoon?: boolean;
}) {
  const content = (
    <div
      className={`flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors ${
        comingSoon
          ? "opacity-60 cursor-not-allowed"
          : "hover:bg-gray-50 cursor-pointer"
      }`}
    >
      <span
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-400 truncate">{subtitle}</p>
      </div>
      {comingSoon ? (
        <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
          Coming Soon
        </span>
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
      )}
    </div>
  );

  if (comingSoon || !href) {
    return <div>{content}</div>;
  }

  return <Link href={href}>{content}</Link>;
}