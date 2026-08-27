"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Sun, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  getMyDoctorProfile,
  getDoctorSlots,
  createAppointmentByDoctor,
  AppointmentValidationError,
} from "@/lib/api";

interface DateSlot {
  key: string;
  topLabel: string;
  day: string;
  weekday: string;
}

function buildDateSlots(days: number): DateSlot[] {
  const weekdayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const dayFmt = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short" });

  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayNum = String(date.getDate()).padStart(2, "0");

    return {
      key: `${year}-${month}-${dayNum}`,
      topLabel: i === 0 ? "Today" : i === 1 ? "Tomorrow" : weekdayFmt.format(date),
      day: dayFmt.format(date),
      weekday: weekdayFmt.format(date),
    };
  });
}

export default function AddAppointmentPage() {
  const router = useRouter();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "doctor") {
      router.replace("/patient-dashboard");
    }
  }, [user, router]);

  const dateSlots = useMemo(() => buildDateSlots(14), []);
  const [selectedDate, setSelectedDate] = useState<DateSlot>(dateSlots[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [doctorSlug, setDoctorSlug] = useState<string | null>(null);

  const [morningSlots, setMorningSlots] = useState<string[]>([]);
  const [afternoonSlots, setAfternoonSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

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

  useEffect(() => {
    if (!token) return;
    getMyDoctorProfile(token).then((p) => setDoctorSlug(p.slug)).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!doctorSlug) return;
    let cancelled = false;

    (async () => {
      try {
        setSlotsLoading(true);
        setSelectedTime(null);
        const slots = await getDoctorSlots(doctorSlug, selectedDate.key);
        if (cancelled) return;
        setMorningSlots(slots.morning);
        setAfternoonSlots(slots.afternoon);
      } catch {
        if (!cancelled) {
          setMorningSlots([]);
          setAfternoonSlots([]);
        }
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [doctorSlug, selectedDate.key]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedTime) return;

    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await createAppointmentByDoctor(token, {
        patientName: name,
        patientPhone: phone,
        patientEmail: email || undefined,
        patientAge: Number(age),
        patientGender: gender as "Male" | "Female" | "Other",
        location: location,
        appointmentDate: selectedDate.key,
        appointmentTime: selectedTime,
        notes: notes || undefined,
      });
      setSuccess(true);
      window.dispatchEvent(new Event("queue-updated"));
    } catch (err) {
      if (err instanceof AppointmentValidationError) {
        setFieldErrors(err.errors);
        setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6">
        <Link
          href="/doctor-dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {success ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-900">Appointment Created</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              {selectedDate.topLabel}, {selectedDate.day} at {selectedTime}
            </p>
            <Link
              href="/doctor-dashboard"
              className="inline-block rounded-lg bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 space-y-5">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Add Appointment</h1>
              <p className="text-sm text-gray-500">Create a walk-in booking for a patient.</p>
            </div>

            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </div>
            )}

            {/* Date picker */}
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <Calendar className="h-4 w-4 text-blue-500" />
                Select Date
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {dateSlots.map((slot) => (
                  <button
                    key={slot.key}
                    type="button"
                    onClick={() => setSelectedDate(slot)}
                    className={`rounded-lg border px-1.5 py-2 text-center text-xs transition ${
                      slot.key === selectedDate.key
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
                    }`}
                  >
                    <span className="block font-medium">{slot.topLabel}</span>
                    <span className="block mt-0.5 font-semibold">{slot.day}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time picker */}
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <Sun className="h-4 w-4 text-amber-400" />
                Select Time
              </h3>
              {slotsLoading ? (
                <div className="flex items-center gap-2 py-3 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading slots...
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {[...morningSlots, ...afternoonSlots].length === 0 ? (
                    <p className="text-sm text-slate-400">No slots available for this date.</p>
                  ) : (
                    [...morningSlots, ...afternoonSlots].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                          selectedTime === time
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
                        }`}
                      >
                        {time}
                      </button>
                    ))
                  )}
                </div>
              )}
              {fieldErrors.appointment_time && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.appointment_time[0]}</p>
              )}
            </div>

            {/* Patient details */}
            <div className="border-t border-gray-100 pt-4 space-y-3.5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Patient Name</label>
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {fieldErrors.patient_name && <p className="mt-1 text-xs text-red-500">{fieldErrors.patient_name[0]}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number</label>
                <input
                  type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {fieldErrors.patient_phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.patient_phone[0]}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Age</label>
                  <input
                    type="number" required min={0} max={120} value={age} onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {fieldErrors.patient_age && <p className="mt-1 text-xs text-red-500">{fieldErrors.patient_age[0]}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
                  <select
                    required value={gender} onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.patient_gender && <p className="mt-1 text-xs text-red-500">{fieldErrors.patient_gender[0]}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Location / Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City, Area or Address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {fieldErrors.location && <p className="mt-1 text-xs text-red-500">{fieldErrors.location[0]}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Reason / Notes <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedTime}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Creating..." : "Create Appointment"}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}