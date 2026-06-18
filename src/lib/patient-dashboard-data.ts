// ─── Patient Dashboard dummy Data ───────────────────────────────────────────────────
// All data is configurable here. Replace with API calls when backend is ready.

export const statCardsData = [
  { icon: "👨‍⚕️", label: "Doctor", value: "Dr. Sharma", accentColor: "#2563EB" },
  { icon: "📅", label: "Appointment", value: "25 Jun", accentColor: "#10B981" },
  { icon: "⏳", label: "Queue", value: "#01", accentColor: "#F59E0B" },
  { icon: "📄", label: "Reports", value: "12", accentColor: "#EF4444" },
];

export const patientData = {
  name: "Shivam",
  id: "PT-1025",
  avatar: "/patient-avatar.png", // Replace with image URL from APINew
  appointment: {
    date: "25 May 2025",
    time: "10:30 AM",
  },
};

export const queueData = {
  currentQueue: 18,
  yourPosition: 1,
  estimatedWaitMinutes: 8,
  estimatedWaitDisplay: "08:24",
  patientsAhead: 2,
  queueNumber: "#01",
  isRealTime: true,
};

export type ProgressStep = {
  id: number;
  label: string;
  time: string | null;
  status: "completed" | "in-progress" | "pending";
};

export const testProgressSteps: ProgressStep[] = [
  { id: 1, label: "Sample Collection", time: "10:32 AM", status: "completed" },
  { id: 2, label: "Lab Processing", time: "In Progress", status: "in-progress" },
  { id: 3, label: "Quality Check", time: null, status: "pending" },
  { id: 4, label: "Report Generation", time: null, status: "pending" },
  { id: 5, label: "Report Ready", time: null, status: "pending" },
];

export type TestOrdered = {
  id: string;
  name: string;
  description: string;
  iconColor: string;
  iconType: "blood" | "drop" | "pill" | "clock";
};

export const testsOrdered: TestOrdered[] = [
  { id: "t1", name: "CBC Test", description: "Complete Blood Count", iconColor: "#EF4444", iconType: "blood" },
  { id: "t2", name: "Blood Sugar Fasting", description: "Blood Sugar Test", iconColor: "#3B82F6", iconType: "drop" },
  { id: "t3", name: "Vitamin D", description: "Vitamin D Test", iconColor: "#A855F7", iconType: "pill" },
];

export const collectionInfo = {
  time: "10:32 AM",
  technician: "Dr. Mehta",
};

export type ReportStatus = "Ready" | "Processing" | "Report Ready" | "Pending";

export type Report = {
  id: string;
  testName: string;
  date: string;
  time: string;
  status: ReportStatus;
  iconColor: string;
};

export const myReports: Report[] = [
  { id: "r1", testName: "CBC Test", date: "12 Jun 2025", time: "10:45 AM", status: "Ready", iconColor: "#EF4444" },
  { id: "r2", testName: "Thyroid Profile", date: "08 Jun 2025", time: "09:30 AM", status: "Ready", iconColor: "#3B82F6" },
  { id: "r3", testName: "Vitamin D Test", date: "25 May 2025", time: "10:30 AM", status: "Processing", iconColor: "#F97316" },
  { id: "r4", testName: "Lipid Profile", date: "20 May 2025", time: "11:00 AM", status: "Report Ready", iconColor: "#EC4899" },
];