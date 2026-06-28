// src/components/doctor-profile/AppointmentBooking.tsx
"use client";
import { useState } from "react";
import type { DateSlot, TimeSlot } from "@/lib/doctor-profile-data";
import {
  CalendarDays,
  Sun,
  Cloud,
  Sunset,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

interface Props {
  dateSlots: DateSlot[];
  timeSlots: TimeSlot[];
  dateRangeLabel: string;
}

const PERIOD_CONFIG = {
  morning: { label: "Morning Slot", Icon: Sun, color: "text-orange-400" },
  afternoon: { label: "After Noon", Icon: Cloud, color: "text-blue-400" },
  evening: { label: "Evening Slot", Icon: Sunset, color: "text-purple-400" },
} as const;

export default function AppointmentBooking({
  dateSlots,
  timeSlots,
  dateRangeLabel,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string>(
    dateSlots[0]?.id ?? "",
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    timeSlots[0]?.id ?? "",
  );
  const [booked, setBooked] = useState(false);

  const selectedDateSlot = dateSlots.find((d) => d.id === selectedDate);
  const selectedTimeSlot = timeSlots.find((t) => t.id === selectedTime);

  const periods: Array<"morning" | "afternoon" | "evening"> = [
    "morning",
    "afternoon",
    "evening",
  ];

  const handleConfirm = () => {
    if (selectedDateSlot && selectedTimeSlot) setBooked(true);
  };

  if (booked) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <ShieldCheck size={32} className="text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-[#0D1B3E]">
          Appointment Confirmed!
        </h3>
        <p className="text-sm text-gray-600">
          {selectedDateSlot?.label}, {selectedDateSlot?.date}{" "}
          {selectedDateSlot?.month} ({selectedDateSlot?.day}) at{" "}
          {selectedTimeSlot?.time}
        </p>
        <button
          onClick={() => setBooked(false)}
          className="mt-2 text-sm text-[#1A3FA4] font-semibold underline underline-offset-2"
        >
          Change appointment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ── Section: Select Appointment Slot ─────────────── */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#0D1B3E]">
            Select Appointment Slot
          </h2>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-[#1A3FA4] border border-[#1A3FA4]/20 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors">
            <CalendarDays size={13} />
            {dateRangeLabel}
            <ChevronDown size={13} />
          </button>
        </div>

        {/* Date cards */}
        <div className="grid grid-cols-3 gap-3">
          {dateSlots.map((slot) => {
            const active = selectedDate === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedDate(slot.id)}
                className={`relative flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all duration-150 ${
                  active
                    ? "border-[#1A3FA4] bg-[#EEF2FF]"
                    : "border-gray-200 bg-white hover:border-[#1A3FA4]/40"
                }`}
              >
                <span
                  className={`text-xs font-bold mb-0.5 ${active ? "text-[#1A3FA4]" : "text-gray-500"}`}
                >
                  {slot.label}
                </span>
                <span
                  className={`text-xl font-bold leading-tight ${active ? "text-[#1A3FA4]" : "text-[#0D1B3E]"}`}
                >
                  {slot.date} {slot.month}
                </span>
                <span className="text-xs text-gray-400 mt-0.5">{slot.day}</span>
                {active && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#1A3FA4] rounded-full flex items-center justify-center shadow">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2.5 2.5L8 3"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section: Choose Time Slot ─────────────────────── */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-[#0D1B3E] mb-4">
          Choose Time Slot
        </h2>

        {periods.map((period) => {
          const slotsForPeriod = timeSlots.filter((s) => s.period === period);
          if (slotsForPeriod.length === 0) return null;
          const { label, Icon, color } = PERIOD_CONFIG[period];

          return (
            <div key={period} className="mb-4 last:mb-0">
              {/* Period header */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <Icon size={15} className={color} />
                <span className={`text-sm font-bold ${color}`}>{label}</span>
              </div>

              {/* Slot pills */}
              <div className="flex flex-wrap gap-2">
                {slotsForPeriod.map((slot) => {
                  const active = selectedTime === slot.id;
                  const disabled = !slot.available;
                  return (
                    <button
                      key={slot.id}
                      disabled={disabled}
                      onClick={() => !disabled && setSelectedTime(slot.id)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                        disabled
                          ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50 line-through"
                          : active
                            ? "border-[#1A3FA4] bg-[#1A3FA4] text-white shadow-md shadow-blue-200"
                            : "border-gray-200 text-[#0D1B3E] bg-white hover:border-[#1A3FA4]/50 hover:bg-[#EEF2FF]"
                      }`}
                    >
                      {slot.time}
                      {active && (
                        <span className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M2 5l2.5 2.5L8 3"
                              stroke="white"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Selected Appointment Summary ─────────────────── */}
      <div className="px-5 py-4 bg-[#F7F8FC] border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center flex-shrink-0">
              <CalendarDays size={18} className="text-[#1A3FA4]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Selected Appointment
              </p>
              <p className="text-sm font-bold text-[#0D1B3E]">
                {selectedDateSlot
                  ? `${selectedDateSlot.label}, ${selectedDateSlot.date} ${selectedDateSlot.month} (${selectedDateSlot.day})`
                  : "No date selected"}
                {selectedTimeSlot ? ` at ${selectedTimeSlot.time}` : ""}
              </p>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="flex items-center justify-center gap-2 bg-[#E8192C] hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-150 shadow-md shadow-red-200 hover:shadow-red-300 whitespace-nowrap"
          >
            Confirm Appointment
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Guarantee strip ──────────────────────────────── */}
      <div className="flex items-start gap-3 px-5 py-4">
        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck size={16} className="text-green-600" />
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Your booking is protected by Swaasth India&apos;s Clinical Integrity
          Guarantee.{" "}
          <span className="font-bold text-[#0D1B3E]">
            Free cancellation up to 30 mins
          </span>{" "}
          before appointment.
        </p>
      </div>
    </div>
  );
}
