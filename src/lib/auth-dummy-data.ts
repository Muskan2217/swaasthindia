// src/lib/auth-dummy-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All auth types and dummy data live here.
// When a real backend is ready:
//   1. Replace DUMMY_USERS with an API call (POST /api/auth/login)
//   2. Replace DUMMY_SPECIALIZATIONS with GET /api/specializations
//   3. The form types and component interfaces stay identical.
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "patient" | "doctor";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  address: string;
  mobile: string;
  password: string; // plain text for dummy only — hash in real backend
  role: UserRole;
  redirectTo: string;
}

// ── Dummy accounts for login simulation ──────────────────────────────────────
export const DUMMY_USERS: AuthUser[] = [
  {
    id: "u1",
    name: "Rahul Verma",
    email: "patient@swaasth.in",
    address: "Delhi",
    mobile: "9876543210",
    password: "patient123",
    role: "patient",
    redirectTo: "/patient-dashboard",
  },
  {
    id: "u2",
    name: "Dr. XYZ",
    email: "doctor@swaasth.in",
    address: "kolkata",
    mobile: "9876500000",
    password: "doctor123",
    role: "doctor",
    redirectTo: "/doctor-dashboard",
  },
];

// ── Login form ────────────────────────────────────────────────────────────────
export interface LoginFormData {
  identifier: string; // mobile or email
  password: string;
  rememberMe: boolean;
}

export const LOGIN_FORM_DEFAULTS: LoginFormData = {
  identifier: "",
  password: "",
  rememberMe: false,
};

// ── Patient signup form ───────────────────────────────────────────────────────
export interface PatientSignupFormData {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export const PATIENT_SIGNUP_DEFAULTS: PatientSignupFormData = {
  fullName: "",
  mobile: "",
  email: "",
  address: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

// ── Doctor signup form ────────────────────────────────────────────────────────
//
// Required at signup: fullName, mobile, email, address, password, specialization,
//   experience, clinicName, qualification, registrationNumber,
//   registrationCertificate, degreeCertificate, identityProof, acceptTerms
//
// Optional at signup (doctor fills these later via profile edit after
//   admin approval): profilePhoto, city, state, consultationFee, languages, about
export interface DoctorSignupFormData {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  specialization: string;
  experience: string;
  clinicName: string;
  qualification: string;
  registrationNumber: string;

  // Documents
  registrationCertificate: File | null; // required
  degreeCertificate: File | null; // required
  identityProof: File | null; // required
  profilePhoto: File | null; // optional — can be added later from profile edit

  acceptTerms: boolean;

  // Optional — filled later via profile edit after admin approval
  city: string;
  state: string;
  consultationFee: string;
  languages: string;
  about: string;
}

export const DOCTOR_SIGNUP_DEFAULTS: DoctorSignupFormData = {
  fullName: "",
  mobile: "",
  email: "",
  address: "",
  password: "",
  confirmPassword: "",
  specialization: "",
  experience: "",
  clinicName: "",
  qualification: "",
  registrationNumber: "",

  registrationCertificate: null,
  degreeCertificate: null,
  identityProof: null,
  profilePhoto: null,

  acceptTerms: false,

  city: "",
  state: "",
  consultationFee: "",
  languages: "",
  about: "",
};

// ── Specializations list ─────────────────────────────────────────────────────
export const SPECIALIZATIONS: string[] = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "ENT Specialist",
  "Gastroenterologist",
  "Gynaecologist",
  "Neurologist",
  "Oncologist",
  "Ophthalmologist",
  "Orthopaedic Surgeon",
  "Paediatrician",
  "Psychiatrist",
  "Pulmonologist",
  "Radiologist",
  "Urologist",
];

// ── Experience options ────────────────────────────────────────────────────────
export const EXPERIENCE_OPTIONS: string[] = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "10–15 years",
  "15–20 years",
  "20+ years",
];

// ── Role card display data ────────────────────────────────────────────────────
export interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  href: string;
  features: string[];
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "patient",
    title: "Patient",
    description:
      "Book appointments, manage reports and track your healthcare records.",
    href: "/signup/patient",
    features: [
      "Book doctor appointments",
      "Access health records",
      "Order medicines online",
      "Get digital prescriptions",
    ],
  },
  {
    id: "doctor",
    title: "Doctor",
    description: "Manage patients, appointments and prescriptions efficiently.",
    href: "/signup/doctor",
    features: [
      "Manage patient queue",
      "Issue digital prescriptions",
      "Set appointment schedules",
      "Access clinical dashboard",
    ],
  },
];

// ── Dummy login validator (replace with API call) ─────────────────────────────
export function validateLogin(
  identifier: string,
  password: string,
): AuthUser | null {
  return (
    DUMMY_USERS.find(
      (u) =>
        (u.email === identifier || u.mobile === identifier) &&
        u.password === password,
    ) ?? null
  );
}