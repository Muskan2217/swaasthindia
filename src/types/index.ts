export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin';
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  hospital: string;
  city: string;
  experience: number;
  fee: number;
  rating: number;
  qualification?: string;
  about?: string;
  languages?: string[];
  is_verified: boolean;
  is_active: boolean;
  profile_image?: string;
}

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  registered_at: string;
  appointments_count: number;
}

export interface Appointment {
  id: number;
  patient: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  doctor: {
    id: number;
    name: string;
    specialization: string;
  };
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Activity {
  id: number;
  description: string;
  created_at: string;
  type: string;
}

export interface DashboardStats {
  total_doctors: number;
  active_doctors: number;
  pending_doctors: number;
  verified_doctors: number;
  total_patients: number;
  today_appointments: number;
  pending_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  recent_activities: Activity[];
  recent_appointments: Appointment[];
  top_rated_doctors: Doctor[];
}

// ---------------------------------------------------------------------------
// UI Types
// ---------------------------------------------------------------------------

export interface PharmacyCategory {
  id: string;
  name: string;
  icon: string;
  href: string;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface CompanyInfo {
  id: string;
  label: string;
  href: string;
}