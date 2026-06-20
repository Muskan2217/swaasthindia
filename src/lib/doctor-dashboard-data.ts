// ─── Doctor Dashboard Dummy Data ──────────────────────────────────────────────
// Centralized data source. Replace each export with an API call later
// (e.g. useEffect/fetch or React Query) without touching component structure.

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DoctorProfile {
  name: string;
  specialty: string;
  avatarUrl: string | null;
}

export interface StatCardData {
  id: string;
  label: string;
  value: number;
  subLabel: string;
  icon: "users" | "hourglass";
  accentColor: string;
  bgColor: string;
}

export type QueueStatus = "in-room" | "waiting" | "completed";

export interface QueuePatient {
  id: string;
  name: string;
  reason: string;
  status: QueueStatus;
  statusLabel: string;
  avatarUrl: string | null;
  borderColor: string;
}

export type Gender = "Male" | "Female" | "Other";

export interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  bloodGroup: string;
  avatarUrl: string | null;
  vitals: {
    bp: string;
    temperature: string;
  };
}

export type DosageOption = string;

export interface Medicine {
  id: string;
  name: string;
  type: string;
  dosage: DosageOption;
  duration: string;
  iconColor: string;
}

export interface DaySchedule {
  day: string;
  isOff: boolean;
  startTime?: string;
  endTime?: string;
  accentColor: string;
}

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  reason: string;
  phone: string;
}

export type PatientStatus = "In Room" | "Waiting" | "Completed";

export interface RecentPatient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  time: string;
  status: PatientStatus;
  avatarUrl: string | null;
}

// ─── Doctor Profile ─────────────────────────────────────────────────────────

export const doctorProfile: DoctorProfile = {
  name: "Dr. Ananya Sharma",
  specialty: "General Physician",
  avatarUrl: null,
};

// ─── Stats Cards ─────────────────────────────────────────────────────────────

export const statCards: StatCardData[] = [
  {
    id: "patients-seen",
    label: "Patients Seen",
    value: 72,
    subLabel: "Today",
    icon: "users",
    accentColor: "#2563EB",
    bgColor: "#EFF6FF",
  },
  {
    id: "waiting-queue",
    label: "Waiting Queue",
    value: 32,
    subLabel: "Waiting for consultation",
    icon: "hourglass",
    accentColor: "#F97316",
    bgColor: "#FFF7ED",
  },
];

// ─── Live Queue ───────────────────────────────────────────────────────────

export const liveQueue: QueuePatient[] = [
  {
    id: "q1",
    name: "Shivam",
    reason: "General Medicine",
    status: "in-room",
    statusLabel: "In Room",
    avatarUrl: null,
    borderColor: "#22C55E",
  },
  {
    id: "q2",
    name: "Satyam",
    reason: "Follow-up",
    status: "waiting",
    statusLabel: "Waiting (10:05)",
    avatarUrl: null,
    borderColor: "#F97316",
  },
  {
    id: "q3",
    name: "Riya",
    reason: "General Medicine",
    status: "waiting",
    statusLabel: "Waiting (12:20)",
    avatarUrl: null,
    borderColor: "#F97316",
  },
  {
    id: "q4",
    name: "Aarav",
    reason: "General Medicine",
    status: "waiting",
    statusLabel: "Waiting (14:30)",
    avatarUrl: null,
    borderColor: "#F97316",
  },
];

// ─── Current Patient ──────────────────────────────────────────────────────

export const currentPatient: CurrentPatient = {
  id: "p1",
  name: "Shivam",
  age: 22,
  gender: "Male",
  bloodGroup: "B+",
  avatarUrl: null,
  vitals: {
    bp: "120/80",
    temperature: "98°F",
  },
};

// ─── Prescription / Medicines ────────────────────────────────────────────

export const dosageOptions: DosageOption[] = ["1-0-1", "1-0-0", "0-0-1", "1-1-1", "0-1-0"];

export const prescribedMedicines: Medicine[] = [
  {
    id: "m1",
    name: "Paracetamol 500mg",
    type: "Tablet",
    dosage: "1-0-1",
    duration: "5 Days",
    iconColor: "#EF4444",
  },
  {
    id: "m2",
    name: "Azithromycin 500mg",
    type: "Tablet",
    dosage: "1-0-0",
    duration: "3 Days",
    iconColor: "#EF4444",
  },
  {
    id: "m3",
    name: "Vitamin D3",
    type: "Tablet",
    dosage: "1-0-1",
    duration: "10 Days",
    iconColor: "#3B82F6",
  },
];

// ─── Weekly Schedule ──────────────────────────────────────────────────────

export const weeklySchedule: DaySchedule[] = [
  { day: "Mon", isOff: false, startTime: "9:00 AM", endTime: "2:00 PM", accentColor: "#2563EB" },
  { day: "Tue", isOff: false, startTime: "8:00 AM", endTime: "10:00 AM", accentColor: "#2563EB" },
  { day: "Wed", isOff: true, accentColor: "#EF4444" },
  { day: "Thu", isOff: false, startTime: "9:00 AM", endTime: "1:00 PM", accentColor: "#8B5CF6" },
  { day: "Fri", isOff: false, startTime: "9:00 AM", endTime: "5:00 PM", accentColor: "#2563EB" },
  { day: "Sat", isOff: false, startTime: "10:00 AM", endTime: "2:00 PM", accentColor: "#F97316" },
  { day: "Sun", isOff: true, accentColor: "#EF4444" },
];

// ─── Upcoming Appointments ────────────────────────────────────────────────

export const upcomingAppointments: Appointment[] = [
  { id: "a1", time: "10:30 AM", patientName: "Rahul Verma", reason: "Follow-up", phone: "+91 98765 43210" },
  { id: "a2", time: "11:00 AM", patientName: "Priya Singh", reason: "General Checkup", phone: "+91 98765 43211" },
  { id: "a3", time: "11:30 AM", patientName: "Amit Kumar", reason: "Fever & Cold", phone: "+91 98765 43212" },
  { id: "a4", time: "12:00 PM", patientName: "Neha Joshi", reason: "Skin Allergy", phone: "+91 98765 43213" },
  { id: "a5", time: "12:30 PM", patientName: "Vikram Patel", reason: "BP Checkup", phone: "+91 98765 43214" },
];

// ─── Recent Patients ──────────────────────────────────────────────────────

export const recentPatients: RecentPatient[] = [
  { id: "rp1", name: "Shivam", age: 22, gender: "Male", time: "10:05 AM", status: "In Room", avatarUrl: null },
  { id: "rp2", name: "Satyam", age: 25, gender: "Male", time: "10:15 AM", status: "Waiting", avatarUrl: null },
  { id: "rp3", name: "Riya", age: 30, gender: "Female", time: "10:20 AM", status: "Waiting", avatarUrl: null },
  { id: "rp4", name: "Aarav", age: 28, gender: "Male", time: "10:30 AM", status: "Waiting", avatarUrl: null },
  { id: "rp5", name: "Neha", age: 26, gender: "Female", time: "10:45 AM", status: "Completed", avatarUrl: null },
];