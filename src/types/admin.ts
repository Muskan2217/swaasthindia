// src/types/admin.ts
import type { ElementType } from "react";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

// ---------------------------------------------------------------------------
// Raw API response shapes — field names match the Laravel Resources exactly.
// Do NOT rename these keys; if AdminDoctorResource/AdminAppointmentResource
// turn out to differ from DoctorResource/AppointmentResource, adjust the
// mapping in lib/admin/mappers.ts, not here.
// ---------------------------------------------------------------------------

export interface ApiDoctorDocuments {
  registration_certificate: string | null;
  degree_certificate: string | null;
  identity_proof: string | null;
}

export interface ApiDoctor {
  id: number;
  name: string;
  slug: string;
  profile_image: string | null;
  specialization: string;
  qualification: string;
  registration_number: string | null;
  experience_years: number;
  hospital_name: string;
  city: string | null;
  state: string | null;
  // null when the doctor hasn't set a fee yet — render "Not Added Yet",
  // do not coerce with Number()/default to 0.
  consultation_fee: number | null;
  rating: number;
  total_reviews: number;
  about: string | null;
  languages: string[] | null;
  availability: string;
  next_slot: string | null;
  is_verified: boolean;
  is_active: boolean;
  documents: ApiDoctorDocuments;
  created_at: string | null;
  updated_at: string | null;
}

export interface ApiPatient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  appointments_count: number | null;
  created_at: string | null;
}

export interface ApiAppointment {
  id: number;
  doctor: { id: number; name: string; slug: string };
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  appointment_date: string | null;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string | null;
}

export interface DashboardStats {
  total_doctors: number;
  pending_doctors: number;
  verified_doctors: number;
  total_patients: number;
  total_appointments: number;
  today_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
}

export interface RecentActivities {
  recent_doctor_registrations: ApiDoctor[];
  recent_appointments: ApiAppointment[];
  recent_patients: ApiPatient[];
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: ApiUser;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: unknown;
}

export interface ActionMenuItem {
  label: string;
  icon: ElementType;
  onClick: () => void;
  danger?: boolean;
}