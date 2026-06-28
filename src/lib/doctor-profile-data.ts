// src/lib/doctor-profile-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All data is typed and centralised here.
// When APIs are ready, replace each export with a fetch/query —
// component prop signatures stay identical.
// ─────────────────────────────────────────────────────────────────────────────

export interface DoctorProfile {
  id: string;
  slug: string; // used for future /doctors/[slug] route
  name: string;
  title: string; // "Dr."
  specialty: string;
  qualification: string;
  experience: number; // years
  rating: number; // out of 5
  reviewCount: number;
  location: string;
  consultationFee: number;
  isVerified: boolean;
  isOnlineAvailable: boolean;
  hospital: string;
  about: string;
  languages: string[];
  avatarUrl: string; // use /home/shield.png placeholder or public path
  clinicImages: string[];
}

export interface TimeSlot {
  id: string;
  time: string; // "09:00 AM"
  period: "morning" | "afternoon" | "evening";
  available: boolean;
}

export interface DateSlot {
  id: string;
  label: string; // "Today" | "Tomorrow" | "Sat"
  date: number; // 24
  month: string; // "Oct"
  day: string; // "Thu"
  isToday: boolean;
}

export interface PatientReview {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  avatarInitials: string;
  avatarColor: string;
}

export interface RelatedDoctor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  location: string;
  avatarColor: string;
  avatarInitials: string;
  isVerified: boolean;
}

export interface ServiceSupportItem {
  id: string;
  label: string;
  href: string;
}

// ─── Doctor Profile ──────────────────────────────────────────────────────────
export const DOCTOR_PROFILE: DoctorProfile = {
  id: "doc-001",
  slug: "dr-xyz",
  name: "Dr. XYZ",
  title: "Dr.",
  specialty: "Cardiologist",
  qualification: "MBBS, MD (Cardiology), DM",
  experience: 12,
  rating: 4.8,
  reviewCount: 342,
  location: "Etawah, Uttar Pradesh",
  consultationFee: 200,
  isVerified: true,
  isOnlineAvailable: true,
  hospital: "Swaasth Heart & Care Clinic",
  about:
    "Dr. XYZ is a highly experienced Cardiologist with over 12 years of clinical practice. He specialises in interventional cardiology, echocardiography, and preventive cardiac care. He has successfully performed 1000+ cardiac procedures and is known for his patient-centric approach and clear communication.",
  languages: ["Hindi", "English", "Urdu"],
  avatarUrl: "/doctor-avatar.png",
  clinicImages: ["/clinic-1.jpg", "/clinic-2.jpg", "/clinic-3.jpg"],
};

// ─── Available Date Slots ─────────────────────────────────────────────────────
export const DATE_SLOTS: DateSlot[] = [
  {
    id: "d1",
    label: "Today",
    date: 24,
    month: "Oct",
    day: "Thu",
    isToday: true,
  },
  {
    id: "d2",
    label: "Tomorrow",
    date: 25,
    month: "Oct",
    day: "Fri",
    isToday: false,
  },
  {
    id: "d3",
    label: "Sat",
    date: 26,
    month: "Oct",
    day: "Sat",
    isToday: false,
  },
];

// ─── Time Slots ───────────────────────────────────────────────────────────────
export const TIME_SLOTS: TimeSlot[] = [
  // Morning
  { id: "t1", time: "09:00 AM", period: "morning", available: true },
  { id: "t2", time: "09:10 AM", period: "morning", available: true },
  { id: "t3", time: "10:00 AM", period: "morning", available: true },
  { id: "t4", time: "10:30 AM", period: "morning", available: false },
  { id: "t5", time: "11:00 AM", period: "morning", available: true },
  { id: "t6", time: "11:30 AM", period: "morning", available: false },
  // Afternoon
  { id: "t7", time: "12:00 PM", period: "afternoon", available: true },
  { id: "t8", time: "12:30 PM", period: "afternoon", available: true },
  { id: "t9", time: "01:00 PM", period: "afternoon", available: false },
  { id: "t10", time: "02:00 PM", period: "afternoon", available: true },
  { id: "t11", time: "02:30 PM", period: "afternoon", available: true },
  // Evening
  { id: "t12", time: "05:00 PM", period: "evening", available: true },
  { id: "t13", time: "05:30 PM", period: "evening", available: true },
  { id: "t14", time: "06:00 PM", period: "evening", available: false },
  { id: "t15", time: "06:30 PM", period: "evening", available: true },
];

// ─── Patient Reviews ──────────────────────────────────────────────────────────
export const PATIENT_REVIEWS: PatientReview[] = [
  {
    id: "r1",
    patientName: "Rahul Verma",
    rating: 5,
    comment:
      "Excellent doctor! Very thorough in his examination and explained everything clearly. Highly recommended for anyone with heart-related concerns.",
    date: "12 Oct 2024",
    avatarInitials: "RV",
    avatarColor: "#6B8DD6",
  },
  {
    id: "r2",
    patientName: "Priya Singh",
    rating: 5,
    comment:
      "Dr. XYZ is very professional and patient. He took time to understand my history and gave a very detailed treatment plan. The clinic is also very clean.",
    date: "5 Oct 2024",
    avatarInitials: "PS",
    avatarColor: "#D4A5C4",
  },
  {
    id: "r3",
    patientName: "Amit Kumar",
    rating: 4,
    comment:
      "Good experience overall. Wait time was a bit long but the consultation was thorough. Will visit again.",
    date: "28 Sep 2024",
    avatarInitials: "AK",
    avatarColor: "#A5B4D4",
  },
];

// ─── Related Doctors ──────────────────────────────────────────────────────────
export const RELATED_DOCTORS: RelatedDoctor[] = [
  {
    id: "rd1",
    slug: "dr-sharma",
    name: "Dr. Sharma",
    specialty: "Cardiologist",
    experience: 8,
    rating: 4.6,
    consultationFee: 300,
    location: "Agra, UP",
    avatarColor: "#4A6BC4",
    avatarInitials: "DS",
    isVerified: true,
  },
  {
    id: "rd2",
    slug: "dr-khan",
    name: "Dr. Khan",
    specialty: "Cardiologist",
    experience: 15,
    rating: 4.9,
    consultationFee: 500,
    location: "Lucknow, UP",
    avatarColor: "#2D8A4E",
    avatarInitials: "DK",
    isVerified: true,
  },
  {
    id: "rd3",
    slug: "dr-verma",
    name: "Dr. Verma",
    specialty: "Interventional Cardiologist",
    experience: 10,
    rating: 4.7,
    consultationFee: 400,
    location: "Kanpur, UP",
    avatarColor: "#C4712A",
    avatarInitials: "DV",
    isVerified: false,
  },
];

// ─── Service Support ──────────────────────────────────────────────────────────
export const SERVICE_SUPPORT: ServiceSupportItem[] = [
  { id: "ss1", label: "For Doctor", href: "/support/doctor" },
  { id: "ss2", label: "For Pharma", href: "/support/pharma" },
  { id: "ss3", label: "For Hospital", href: "/support/hospital" },
];

// ─── Date Range Label ─────────────────────────────────────────────────────────
export const DATE_RANGE_LABEL = "Oct 25 – Oct 27";
