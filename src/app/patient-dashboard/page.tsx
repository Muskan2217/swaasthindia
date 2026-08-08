"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
  CalendarPlus,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!.replace("/api", "");
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
        src={
          appt.doctor.profile_image
            ? `${BACKEND_URL}/storage/${appt.doctor.profile_image}`
            : "https://i.pravatar.cc/300"
        }
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

        {/* Welcome + Next Appointment */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile?.profile_image ?? "https://i.pravatar.cc/300"}
              alt={profile?.name ?? "Patient"}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900">
                <b>Welcome back, </b>{profile?.name?.split(" ")[0] ?? user?.name} 👋
              </h1>
              {profile?.patient_code && (
                <p className="text-sm text-gray-500 mt-0.5">
                  Patient ID:{" "}
                  <span className="text-blue-600 font-medium">
                    {profile.patient_code}
                  </span>
                </p>
              )}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                  Age {profile?.age ?? "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-gray-400" />
                  {profile?.blood_group ?? "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {profile?.mobile ?? "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Next Appointment
            </h2>
            {nextAppointment ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}

                  <img
                    src={
                      nextAppointment.doctor.profile_image
                        ? `${BACKEND_URL}/storage/${nextAppointment.doctor.profile_image}`
                        : "https://i.pravatar.cc/300"
                    }
                    alt={nextAppointment.doctor.name}
                    className="h-11 w-11 rounded-full object-cover ring-1 ring-white shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {nextAppointment.doctor.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {nextAppointment.doctor.specialization}
                      <StatusBadge status={nextAppointment.status} />
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(
                      nextAppointment.appointment_date,
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {nextAppointment.appointment_time.slice(0, 8).includes(":")
                      ? nextAppointment.appointment_time
                      : nextAppointment.appointment_time}
                  </span>
                </div>
                <Link
                  href={`/doctor-profile/${nextAppointment.doctor.slug}`}
                  className="block w-full text-center rounded-lg bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition-colors"
                >
                  View Appointment
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">
                  No upcoming appointments
                </p>
                <Link
                  href="/doctor-listing"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 hover:bg-blue-700 transition-colors"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book Appointment
                </Link>
              </div>
            )}
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
                title="Find & Book Doctor"
                subtitle="Schedule an appointment"
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
