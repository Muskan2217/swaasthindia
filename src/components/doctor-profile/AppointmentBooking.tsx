"use client";

// src/components/doctor-profile/AppointmentBooking.tsx
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Sun,
  CalendarCheck,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import {
  getDoctorSlots,
  createAppointment,
  AppointmentValidationError,
} from "@/lib/api";

interface AppointmentBookingProps {
  doctorSlug: string;
  consultationFee: number;
}

interface DateSlot {
  key: string; // ISO date "2026-07-20"
  topLabel: string; // "Today" | "Tomorrow" | short weekday
  day: string; // "24 Oct"
  weekday: string; // "Thu"
}

function buildDateSlots(days: number): DateSlot[] {
  const weekdayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const dayFmt = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
  });

  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    // Format YYYY-MM-DD according to LOCAL timezone (not UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayNum = String(date.getDate()).padStart(2, "0");
    const key = `${year}-${month}-${dayNum}`;

    const topLabel =
      i === 0 ? "Today" : i === 1 ? "Tomorrow" : weekdayFmt.format(date);

    return {
      key,
      topLabel,
      day: dayFmt.format(date),
      weekday: weekdayFmt.format(date),
    };
  });
} 

export default function AppointmentBooking({
  doctorSlug,
  consultationFee,
}: AppointmentBookingProps) {
  const dateSlots = useMemo(() => buildDateSlots(7), []);
  const [selectedDate, setSelectedDate] = useState<DateSlot>(dateSlots[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [morningSlots, setMorningSlots] = useState<string[]>([]);
  const [afternoonSlots, setAfternoonSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  // Fetch real slot availability whenever the selected date changes
  useEffect(() => {
    let cancelled = false;

    async function fetchSlots() {
      try {
        setSlotsLoading(true);
        setSlotsError(null);
        setSelectedTime(null);

        const slots = await getDoctorSlots(doctorSlug, selectedDate.key);

        if (cancelled) return;
        setMorningSlots(slots.morning);
        setAfternoonSlots(slots.afternoon);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load slots:", error);
        setSlotsError("Couldn't load slots for this date. Please try again.");
        setMorningSlots([]);
        setAfternoonSlots([]);
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }

    fetchSlots();
    return () => {
      cancelled = true;
    };
  }, [doctorSlug, selectedDate.key]);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <Calendar className="h-4 w-4 text-blue-500" />
          Select Appointment Slot
        </h2>
        <span className="text-xs font-medium text-slate-400">
          ₹{consultationFee} consultation
        </span>
      </div>

      {/* Date picker */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {dateSlots.map((slot) => {
          const isSelected = slot.key === selectedDate.key;
          return (
            <button
              key={slot.key}
              type="button"
              onClick={() => setSelectedDate(slot)}
              className={`rounded-xl border px-2 py-3 text-center text-sm transition ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
              }`}
            >
              <span className="block text-xs font-medium">{slot.topLabel}</span>
              <span className="mt-0.5 block font-semibold">{slot.day}</span>
              <span className="block text-xs text-slate-400">
                {slot.weekday}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time picker */}
      <div className="mt-6">
        {slotsLoading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading available slots...
          </div>
        ) : slotsError ? (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {slotsError}
          </div>
        ) : (
          <>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <Sun className="h-4 w-4 text-amber-400" />
              Morning
            </h3>
            {morningSlots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {morningSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-lg border px-3.5 py-2 text-sm transition ${
                      selectedTime === time
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No morning slots left.</p>
            )}

            <h3 className="mb-2 mt-4 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <Sun className="h-4 w-4 text-orange-400" />
              Afternoon
            </h3>
            {afternoonSlots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {afternoonSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-lg border px-3.5 py-2 text-sm transition ${
                      selectedTime === time
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No afternoon slots left.</p>
            )}
          </>
        )}
      </div>

      {/* Confirm bar */}
      <div className="mt-6 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <CalendarCheck className="h-4 w-4 shrink-0 text-blue-500" />
          <span>
            Selected:{" "}
            <span className="font-medium">
              {selectedDate.topLabel}, {selectedDate.day}
            </span>
            {selectedTime && (
              <>
                {" "}
                at <span className="font-medium">{selectedTime}</span>
              </>
            )}
          </span>
        </div>

        <button
          type="button"
          disabled={!selectedTime}
          onClick={() => {
            if (!token) {
              router.push("/login");
              return;
            }

            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {token ? "Confirm Appointment →" : "Login to Book →"}
        </button>
      </div>

      {showForm && selectedTime && token && (
        <BookingFormModal
          doctorSlug={doctorSlug}
          date={selectedDate}
          time={selectedTime}
          token={token}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Popup form: collects patient details and submits the booking
// ---------------------------------------------------------------------------

interface BookingFormModalProps {
  doctorSlug: string;
  date: DateSlot;
  time: string;
  token: string;
  onClose: () => void;
}

function BookingFormModal({
  doctorSlug,
  date,
  time,
  token,
  onClose,
}: BookingFormModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await createAppointment(
        {
          doctorSlug,
          patientName: name,
          patientPhone: phone,
          patientEmail: email,
          patientAge: Number(age),
          patientGender: gender as "Male" | "Female" | "Other",
          location,
          appointmentDate: date.key,
          appointmentTime: time,
          notes,
        },
        token,
      );
      setSuccess(true);
    } catch (error) {
      if (error instanceof AppointmentValidationError) {
        setFieldErrors(error.errors);
        setFormError(error.message);
      } else {
        setFormError("Something went wrong while booking. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-7">
        {success ? (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900">
              Appointment Requested
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
              {date.topLabel}, {date.day} at {time}. We&apos;ll confirm shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Confirm Your Details
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-4 text-sm text-slate-500">
              {date.topLabel}, {date.day} at{" "}
              <span className="font-medium text-slate-700">{time}</span>
            </p>

            {formError && (
              <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {fieldErrors.patient_name && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.patient_name[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {fieldErrors.patient_phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.patient_phone[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {fieldErrors.patient_age && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.patient_age[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Gender
                  </label>
                  <select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.patient_gender && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.patient_gender[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Mandatory Location Input */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Location / Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City, Area or Address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {fieldErrors.location && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.location[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {fieldErrors.patient_email && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.patient_email[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Notes <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {fieldErrors.appointment_time && (
                <p className="text-xs text-red-500">
                  {fieldErrors.appointment_time[0]}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Booking..." : "Confirm Appointment"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}