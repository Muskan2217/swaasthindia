"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AppointmentBooking from "@/components/doctor-profile/AppointmentBooking";
import { CalendarClock, Settings, CheckCircle2, XCircle } from "lucide-react";

interface BookingGateProps {
  doctorSlug: string;
  consultationFee: number;
  availability?: string;
  nextSlot?: string | null;
}

export default function BookingGate({
  doctorSlug,
  consultationFee,
  availability,
  nextSlot,
}: BookingGateProps) {
  const { user } = useAuth();

  // A doctor viewing their own public profile sees their availability
  // status instead of the patient booking widget.
  if (user?.role === "doctor") {
    const isAvailable = availability === "Available Today";

    return (
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <CalendarClock className="h-5 w-5 text-[#3864D5]" />
          <h2 className="text-base font-bold text-[#0D1B3E]">
            Your Availability
          </h2>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          This is how patients see your profile. Your availability status
          below is pulled live from your dashboard settings.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {isAvailable ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-slate-400" />
            )}
            <span
              className={`text-sm font-semibold ${
                isAvailable ? "text-green-700" : "text-slate-500"
              }`}
            >
              {availability || "Not set"}
            </span>
          </div>

          {nextSlot && (
            <span className="text-sm text-slate-500">
              Next slot:{" "}
              <span className="font-semibold text-[#0D1B3E]">{nextSlot}</span>
            </span>
          )}

          <span className="text-sm text-slate-500">
            Consultation fee:{" "}
            <span className="font-semibold text-[#0D1B3E]">₹{consultationFee}</span>
          </span>
        </div>

        <Link
          href="/doctor-dashboard/"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3864D5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f54b8]"
        >
          <Settings className="h-4 w-4" />
          Update availability from dashboard
        </Link>
      </div>
    );
  }

  return (
    <AppointmentBooking
      doctorSlug={doctorSlug}
      consultationFee={consultationFee}
    />
  );
}