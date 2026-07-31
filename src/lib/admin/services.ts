// src/lib/admin/services.ts
import { apiRequest } from "./api-client";
import type {
  ApiDoctor,
  ApiPatient,
  ApiAppointment,
  DashboardStats,
  RecentActivities,
  LoginResponse,
  PaginatedResponse,
  AppointmentStatus,
} from "@/types/admin";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: { login: email, password }, 
  });
}


export function logout(): Promise<unknown> {
  return apiRequest("/logout", { method: "POST" });
}

export function getMe(): Promise<{ data: unknown }> {
  return apiRequest("/me");
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await apiRequest<{ data: DashboardStats }>("/admin/dashboard");
  return res.data;
}

// ---------------------------------------------------------------------------
// Doctors
// ---------------------------------------------------------------------------

export interface DoctorListParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export function getDoctors(params: DoctorListParams = {}): Promise<PaginatedResponse<ApiDoctor>> {
  return apiRequest<PaginatedResponse<ApiDoctor>>("/admin/doctors", { query: params });
}

export async function getDoctor(id: number | string): Promise<ApiDoctor> {
  const res = await apiRequest<{ data: ApiDoctor }>(`/admin/doctors/${id}`);
  return res.data;
}

export async function approveDoctor(id: number | string): Promise<ApiDoctor> {
  const res = await apiRequest<{ data: ApiDoctor }>(`/admin/doctors/${id}/approve`, { method: "PATCH" });
  return res.data;
}

export async function rejectDoctor(id: number | string): Promise<ApiDoctor> {
  const res = await apiRequest<{ data: ApiDoctor }>(`/admin/doctors/${id}/reject`, { method: "PATCH" });
  return res.data;
}

export async function toggleDoctorStatus(id: number | string): Promise<ApiDoctor> {
  const res = await apiRequest<{ data: ApiDoctor }>(`/admin/doctors/${id}/toggle-status`, { method: "PATCH" });
  return res.data;
}

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------

export interface PatientListParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export function getPatients(params: PatientListParams = {}): Promise<PaginatedResponse<ApiPatient>> {
  return apiRequest<PaginatedResponse<ApiPatient>>("/admin/patients", { query: params });
}

export async function getPatient(id: number | string): Promise<ApiPatient> {
  const res = await apiRequest<{ data: ApiPatient }>(`/admin/patients/${id}`);
  return res.data;
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

export interface AppointmentListParams {
  search?: string;
  status?: AppointmentStatus;
  doctor_id?: number;
  date?: string;
  page?: number;
  per_page?: number;
}

export function getAppointments(
  params: AppointmentListParams = {}
): Promise<PaginatedResponse<ApiAppointment>> {
  return apiRequest<PaginatedResponse<ApiAppointment>>("/admin/appointments", { query: params });
}

export async function getAppointment(id: number | string): Promise<ApiAppointment> {
  const res = await apiRequest<{ data: ApiAppointment }>(`/admin/appointments/${id}`);
  return res.data;
}

export async function updateAppointmentStatus(
  id: number | string,
  status: AppointmentStatus
): Promise<ApiAppointment> {
  const res = await apiRequest<{ data: ApiAppointment }>(`/admin/appointments/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  return res.data;
}

// ---------------------------------------------------------------------------
// Recent Activities
// ---------------------------------------------------------------------------

export async function getRecentActivities(limit = 10): Promise<RecentActivities> {
  const res = await apiRequest<{ data: RecentActivities }>("/admin/recent-activities", {
    query: { limit },
  });
  return res.data;
}
