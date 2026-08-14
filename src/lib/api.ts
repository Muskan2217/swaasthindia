const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function registerUser(data: Record<string, any>) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value instanceof File ? value : String(value));
  });

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
/**
 * Sends a POST request to authenticate the user.
 * Throws the parsed API error response if the request fails.
 */
export async function login(data: any) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}

// Logout current user and invalidate the API token
export async function logout(token: string) {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  return response.json();
}

// Convert backend doctor -> frontend doctor (used by the listing page)
function mapDoctor(doctor: any) {
  return {
    id: doctor.id,
    name: doctor.name,
    slug: doctor.slug,
    image: doctor.profile_image || "https://i.pravatar.cc/300",
    verified: Boolean(doctor.is_verified),
    qualification: doctor.qualification,
    specialization: doctor.specialization,
    experienceYears: doctor.experience_years,
    hospital: doctor.hospital_name,
    city: doctor.city,
    state: doctor.state,
    consultationFee: Number(doctor.consultation_fee),
    rating: Number(doctor.rating),
    reviewCount: doctor.total_reviews,
    availability: doctor.availability,
    nextSlot: doctor.next_slot,
  };
}

export async function getDoctors(params = "") {
  const res = await fetch(`${API_URL}/doctors?${params}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  const json = await res.json();

  return {
    ...json,
    data: json.data.map(mapDoctor),
  };
}

// ---------------------------------------------------------------------------
// Doctor Profile (GET /api/doctors/{slug})
// ---------------------------------------------------------------------------

export type DoctorAvailability =
  | "Available Today"
  | "Available Tomorrow"
  | "Not Available";

export interface DoctorProfileData {
  id: number;
  name: string;
  slug: string;
  profileImage: string | null;
  specialization: string;
  qualification: string;
  experienceYears: number;
  hospitalName: string;
  city: string;
  state: string;
  consultationFee: number;
  rating: number;
  totalReviews: number;
  about: string | null;
  languages: string[];
  availability: DoctorAvailability;
  nextSlot: string | null;
  isVerified: boolean;
  isActive: boolean;
}

export class DoctorNotFoundError extends Error {
  constructor(message = "Doctor not found") {
    super(message);
    this.name = "DoctorNotFoundError";
  }
}

function mapDoctorProfile(doctor: any): DoctorProfileData {
  return {
    id: doctor.id,
    name: doctor.name,
    slug: doctor.slug,
    profileImage: doctor.profile_image ?? null,
    specialization: doctor.specialization,
    qualification: doctor.qualification,
    experienceYears: doctor.experience_years,
    hospitalName: doctor.hospital_name,
    city: doctor.city,
    state: doctor.state,
    consultationFee: Number(doctor.consultation_fee),
    rating: Number(doctor.rating),
    totalReviews: doctor.total_reviews,
    about: doctor.about ?? null,
    languages: Array.isArray(doctor.languages) ? doctor.languages : [],
    availability: doctor.availability,
    nextSlot: doctor.next_slot ?? null,
    isVerified: Boolean(doctor.is_verified),
    isActive: Boolean(doctor.is_active),
  };
}

export async function getDoctorBySlug(
  slug: string,
): Promise<DoctorProfileData> {
  const res = await fetch(`${API_URL}/doctors/${slug}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    throw new DoctorNotFoundError();
  }

  if (!res.ok) {
    throw new Error("Failed to fetch doctor profile");
  }

  const json = await res.json();
  const payload = json.data ?? json;

  return mapDoctorProfile(payload);
}

// ---------------------------------------------------------------------------
// Appointment Slots + Booking
// ---------------------------------------------------------------------------

export interface DoctorSlots {
  date: string;
  morning: string[];
  afternoon: string[];
}

/**
 * GET /api/doctors/{slug}/slots?date=YYYY-MM-DD
 * `date` must be an ISO date string, e.g. "2026-07-20".
 */
export async function getDoctorSlots(
  slug: string,
  date: string,
): Promise<DoctorSlots> {
  const res = await fetch(
    `${API_URL}/doctors/${slug}/slots?date=${encodeURIComponent(date)}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch available slots");
  }

  const json = await res.json();
  return json.data;
}

export interface CreateAppointmentPayload {
  doctorSlug: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export interface AppointmentResult {
  id: number;
  doctor: { id: number; name: string; slug: string };
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string | null;
}

/** Thrown on a 422 validation failure (e.g. slot already booked). */
export class AppointmentValidationError extends Error {
  errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message);
    this.name = "AppointmentValidationError";
    this.errors = errors;
  }
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
  token: string,
): Promise<AppointmentResult> {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
   headers: {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
},
    body: JSON.stringify({
      doctor_slug: payload.doctorSlug,
      patient_name: payload.patientName,
      patient_phone: payload.patientPhone,
      patient_email: payload.patientEmail || null,
      patient_age: payload.patientAge,
      patient_gender: payload.patientGender,
      appointment_date: payload.appointmentDate,
      appointment_time: payload.appointmentTime,
      notes: payload.notes || null,
    }),
  });

  const json = await res.json();

  if (res.status === 422) {
    throw new AppointmentValidationError(
      json.message ?? "Validation failed",
      json.errors ?? {},
    );
  }

  if (!res.ok) {
    throw new Error(json.message ?? "Failed to book appointment");
  }

  const data = json.data;

  return {
    id: data.id,
    doctor: data.doctor,
    patientName: data.patient_name,
    patientPhone: data.patient_phone,
    patientEmail: data.patient_email,
    appointmentDate: data.appointment_date,
    appointmentTime: data.appointment_time,
    status: data.status,
    notes: data.notes,
  };
}

// ---------------------------------------------------------------------------
// Doctor Self-Service Profile (GET/PATCH /api/doctor/profile)
// ---------------------------------------------------------------------------

export interface MyDoctorProfile {
  id: number;
  name: string;
  slug: string;
  profileImage: string | null;
  specialization: string;
  qualification: string;
  experienceYears: number;
  hospitalName: string;
  city: string | null;
  state: string | null;
  consultationFee: number | null;
  about: string | null;
  languages: string[];
  availability: DoctorAvailability;
  nextSlot: string | null;
  isVerified: boolean;
  isActive: boolean;
}

function mapMyDoctorProfile(doctor: any): MyDoctorProfile {
  return {
    id: doctor.id,
    name: doctor.name,
    slug: doctor.slug,
    profileImage: doctor.profile_image ?? null,
    specialization: doctor.specialization,
    qualification: doctor.qualification,
    experienceYears: doctor.experience_years,
    hospitalName: doctor.hospital_name,
    city: doctor.city ?? null,
    state: doctor.state ?? null,
    consultationFee:
      doctor.consultation_fee !== null && doctor.consultation_fee !== undefined
        ? Number(doctor.consultation_fee)
        : null,
    about: doctor.about ?? null,
    languages: Array.isArray(doctor.languages) ? doctor.languages : [],
    availability: doctor.availability,
    nextSlot: doctor.next_slot ?? null,
    isVerified: Boolean(doctor.is_verified),
    isActive: Boolean(doctor.is_active),
  };
}

export async function getMyDoctorProfile(
  token: string,
): Promise<MyDoctorProfile> {
  const res = await fetch(`${API_URL}/doctor/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw json;

  const payload = json.data ?? json;
  return mapMyDoctorProfile(payload);
}

export interface UpdateMyDoctorProfilePayload {
  qualification?: string;
  city?: string;
  state?: string;
  consultationFee?: string;
  about?: string;
  languages?: string[];
  availability?: DoctorAvailability;
  nextSlot?: string;
  profilePhoto?: File | null;
}

export async function updateMyDoctorProfile(
  token: string,
  payload: UpdateMyDoctorProfilePayload,
): Promise<MyDoctorProfile> {
  const formData = new FormData();
  formData.append("_method", "PATCH");

  if (payload.qualification !== undefined)
    formData.append("qualification", payload.qualification);
  if (payload.city !== undefined) formData.append("city", payload.city);
  if (payload.state !== undefined) formData.append("state", payload.state);
  if (payload.consultationFee !== undefined)
    formData.append("consultation_fee", payload.consultationFee);
  if (payload.about !== undefined) formData.append("about", payload.about);
  if (payload.availability !== undefined)
    formData.append("availability", payload.availability);
  if (payload.nextSlot !== undefined)
    formData.append("next_slot", payload.nextSlot);
  if (payload.languages !== undefined) {
    payload.languages.forEach((lang, i) =>
      formData.append(`languages[${i}]`, lang),
    );
  }
  if (payload.profilePhoto) {
    formData.append("profile_photo", payload.profilePhoto);
  }

  const res = await fetch(`${API_URL}/doctor/profile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) throw json;

  const payloadData = json.data ?? json;
  return mapMyDoctorProfile(payloadData);
}

// ---------------------------------------------------------------------------
// Doctor Dashboard — Stats & Upcoming Appointments
// ---------------------------------------------------------------------------

import type { StatCardData, Appointment } from "@/lib/doctor-dashboard-data";

export async function getDoctorDashboardStats(
  token: string,
): Promise<StatCardData[]> {
  const res = await fetch(`${API_URL}/doctor/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json.data;
}

export async function getDoctorUpcomingAppointments(
  token: string,
): Promise<Appointment[]> {
  const res = await fetch(`${API_URL}/doctor/dashboard/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json.data;
}


// ---------------------------------------------------------------------------
// Doctor Dashboard — Recent Patients
// GET /api/doctor/dashboard/recent-patients
// Real check-in/queue system doesn't exist yet, so status is limited to
// "Waiting" | "Completed" (no "In Room" without that system).
// 

export interface RecentPatientData {
  id: string;
  name: string;
  age: number | null;
  gender: "Male" | "Female" | "Other" | null;
  time: string;
  status: "Waiting" | "Completed";
  avatarUrl: string | null;
}

export async function getDoctorRecentPatients(token: string): Promise<RecentPatientData[]> {
  const res = await fetch(`${API_URL}/doctor/dashboard/recent-patients`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json.data;
}

// ---------------------------------------------------------------------------
// Patient Dashboard
// ---------------------------------------------------------------------------

export async function getPatientDashboardProfile(token: string) {
  const res = await fetch(`${API_URL}/patient/dashboard/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json.data;
}

export async function getPatientDashboardStats(token: string) {
  const res = await fetch(`${API_URL}/patient/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json.data;
}

export async function getPatientNextAppointment(token: string) {
  const res = await fetch(`${API_URL}/patient/dashboard/next-appointment`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json.data;
}

export async function getPatientAppointments(token: string) {
  const res = await fetch(`${API_URL}/patient/dashboard/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json.data;
}

// export async function getPatientAppointmentHistory(token: string) {
//  const res = await fetch(`${API_URL}/patient/dashboard/appointments`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json",
//     },
//     cache: "no-store",
//   });

//   const json = await res.json();
//   if (!res.ok) throw json;

//   return json.data;
// }

// Fetches patient profile details from the API using authentication token

export async function getPatientProfile(
  id: string | number,
  token: string
) {
  const res = await fetch(`${API_URL}/patient/dashboard/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch patient profile");
  }

  return json.data;
}


// Updates the authenticated patient's profile details.

export async function updatePatientProfile(
  token: string,
  data: {
    name?: string;
    mobile?: string;
    age?: number | null;
    gender?: string | null;
    height?: number | null;
    weight?: number | null;
    blood_group?: string | null;
    allergies?: string | null;
    medical_conditions?: string | null;
    current_medications?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    profile_image?: File | null;
  }
) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  // Laravel method spoofing so we can upload a file

const res = await fetch(`${API_URL}/patient/profile`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  },
  body: formData,
  cache: "no-store",
});

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json.message || "Failed to update patient profile"
    );
  }

  return json.data;
}



// ---------------------------------------------------------------------------
// Doctor Dashboard — Weekly Schedule
// ---------------------------------------------------------------------------

export interface DayScheduleData {
  day: string;
  isOff: boolean;
  startTime: string | null;
  endTime: string | null;
}

export async function getDoctorSchedule(token: string): Promise<DayScheduleData[]> {
  const res = await fetch(`${API_URL}/doctor/dashboard/schedule`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json.data;
}

export async function updateDoctorSchedule(
  token: string,
  schedule: DayScheduleData[]
): Promise<void> {
  const res = await fetch(`${API_URL}/doctor/dashboard/schedule`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify({ schedule }),
  });

  const json = await res.json();
  if (!res.ok) throw json;
}

// ---------------------------------------------------------------------------
// Doctor Dashboard — Live Queue & Current Patient
// ---------------------------------------------------------------------------

export interface QueuePatientData {
  id: string;
  name: string;
  reason: string;
  status: "in-room" | "waiting";
  statusLabel: string;
  avatarUrl: string | null;
}

export interface CurrentPatientData {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  bloodGroup: string | null;
  avatarUrl: string | null;
  appointmentDate: string;
  appointmentTime: string;
  reason: string | null;
  vitals: {
    bp: string | null;
    temperature: string | null;
  };
}

export async function getDoctorQueue(token: string): Promise<QueuePatientData[]> {
  const res = await fetch(`${API_URL}/doctor/dashboard/queue`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json.data;
}

export async function getCurrentPatient(token: string): Promise<CurrentPatientData | null> {
  const res = await fetch(`${API_URL}/doctor/dashboard/current-patient`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json.data;
}

export async function startConsultation(token: string, appointmentId: string): Promise<void> {
  const res = await fetch(`${API_URL}/doctor/dashboard/queue/${appointmentId}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw json;
}

export async function completeConsultation(token: string, appointmentId: string): Promise<void> {
  const res = await fetch(`${API_URL}/doctor/dashboard/queue/${appointmentId}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw json;
}

export async function updateVitals(
  token: string,
  appointmentId: string,
  vitals: { bp: string; temperature: string }
): Promise<void> {
  const res = await fetch(`${API_URL}/doctor/dashboard/queue/${appointmentId}/vitals`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(vitals),
  });
  const json = await res.json();
  if (!res.ok) throw json;
}

// ---------------------------------------------------------------------------
// Doctor Dashboard — Pending Appointment Approvals
// ---------------------------------------------------------------------------

export interface PendingAppointmentData {
  id: string;
  patientName: string;
  age: number | null;
  gender: string | null;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  notes: string | null;
}

export async function getPendingAppointments(token: string): Promise<PendingAppointmentData[]> {
  const res = await fetch(`${API_URL}/doctor/dashboard/pending-appointments`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json.data;
}

export async function approveAppointment(token: string, appointmentId: string): Promise<void> {
  const res = await fetch(`${API_URL}/doctor/appointments/${appointmentId}/approve`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw json;
}

export async function declineAppointment(token: string, appointmentId: string): Promise<void> {
  const res = await fetch(`${API_URL}/doctor/appointments/${appointmentId}/decline`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw json;
}

// ---------------------------------------------------------------------------
// Full Appointments Page — Doctor list + shared Cancel action
// ---------------------------------------------------------------------------

export interface DoctorAppointmentData {
  id: string;
  patientName: string;
  age: number | null;
  gender: string | null;
  phone: string;
  date: string;
  time: string;
  status: string;
  notes: string | null;
}

export async function getDoctorAllAppointments(
  token: string,
  filters: { status?: string; search?: string } = {}
): Promise<DoctorAppointmentData[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);

  const res = await fetch(`${API_URL}/doctor/appointments?${params}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json.data;
}

export async function cancelAppointment(token: string, appointmentId: string): Promise<void> {
  const res = await fetch(`${API_URL}/appointments/${appointmentId}/cancel`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw json;
}

// ---------------------------------------------------------------------------
// Doctor: Create Appointment (walk-in / manual)
// ---------------------------------------------------------------------------

export interface CreateDoctorAppointmentPayload {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export async function createAppointmentByDoctor(
  token: string,
  payload: CreateDoctorAppointmentPayload
): Promise<void> {
  const res = await fetch(`${API_URL}/doctor/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      patient_name: payload.patientName,
      patient_phone: payload.patientPhone,
      patient_email: payload.patientEmail || null,
      patient_age: payload.patientAge,
      patient_gender: payload.patientGender,
      appointment_date: payload.appointmentDate,
      appointment_time: payload.appointmentTime,
      notes: payload.notes || null,
    }),
  });

  const json = await res.json();
  if (res.status === 422) {
    throw new AppointmentValidationError(json.message ?? "Validation failed", json.errors ?? {});
  }
  if (!res.ok) throw json;
}


// ---------------------------------------------------------------------------
// Patient — Live OPD Queue Status
// ---------------------------------------------------------------------------

export interface LiveQueueStatus {
  has_live_queue: boolean;
  doctor_name?: string;
  your_token?: number;
  current_serving_token?: number;
  patients_ahead?: number;
  estimated_wait_minutes?: number;
  is_your_turn?: boolean;
}

export async function getLiveQueueStatus(token: string): Promise<LiveQueueStatus> {
  const res = await fetch(`${API_URL}/patient/dashboard/live-queue`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json.data;
}