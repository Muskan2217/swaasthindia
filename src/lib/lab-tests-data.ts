// ─── Lab Tests Booking — Dummy Data ──────────────────────────────────────────
// Centralized, typed data source. Replace each export with an API call later
// (fetch/React Query/server action) without changing component structure.

export type IconKey =
  | "droplet"
  | "blood-drop"
  | "butterfly"
  | "sun"
  | "heart"
  | "liver"
  | "clipboard"
  | "shield"
  | "activity";

export interface Category {
  id: string;
  label: string;
  icon: IconKey | null; // null = "All"
}

export interface LabTest {
  id: string;
  name: string;
  description: string;
  price: number;
  reportTimeHours: number;
  categoryIds: string[];
  iconKey: IconKey;
  iconColor: string;
  iconBg: string;
  parameters: number;
}

export interface HealthPackage {
  id: string;
  name: string;
  parameters: number;
  price: number;
  discountPercent: number;
  iconKey: IconKey;
  iconColor: string;
  iconBg: string;
  isMostPopular: boolean;
}

// ─── Categories ──────────────────────────────────────────────────────────

export const categories: Category[] = [
  { id: "all", label: "All", icon: null },
  { id: "blood", label: "Blood Tests", icon: "blood-drop" },
  { id: "diabetes", label: "Diabetes", icon: "droplet" },
  { id: "thyroid", label: "Thyroid", icon: "butterfly" },
  { id: "heart", label: "Heart", icon: "heart" },
  { id: "vitamin", label: "Vitamins", icon: "sun" },
  { id: "liver", label: "Liver", icon: "liver" },
  { id: "kidney", label: "Kidney", icon: "activity" },
];

// ─── Popular Tests ───────────────────────────────────────────────────────

export const popularTests: LabTest[] = [
  {
    id: "t1",
    name: "CBC Test",
    description: "Complete Blood Count",
    price: 299,
    reportTimeHours: 12,
    categoryIds: ["blood"],
    iconKey: "blood-drop",
    iconColor: "#EF4444",
    iconBg: "#FEF2F2",
    parameters: 24,
  },
  {
    id: "t2",
    name: "Blood Sugar Fasting",
    description: "Blood Glucose Test",
    price: 199,
    reportTimeHours: 6,
    categoryIds: ["diabetes", "blood"],
    iconKey: "droplet",
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    parameters: 1,
  },
  {
    id: "t3",
    name: "Thyroid Profile",
    description: "T3, T4, TSH",
    price: 499,
    reportTimeHours: 24,
    categoryIds: ["thyroid"],
    iconKey: "butterfly",
    iconColor: "#A855F7",
    iconBg: "#FAF5FF",
    parameters: 3,
  },
  {
    id: "t4",
    name: "Vitamin D",
    description: "Vitamin D Deficiency Test",
    price: 899,
    reportTimeHours: 24,
    categoryIds: ["vitamin"],
    iconKey: "sun",
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
    parameters: 1,
  },
  {
    id: "t5",
    name: "Lipid Profile",
    description: "Cholesterol Screening",
    price: 699,
    reportTimeHours: 24,
    categoryIds: ["heart"],
    iconKey: "heart",
    iconColor: "#22C55E",
    iconBg: "#F0FDF4",
    parameters: 8,
  },
  {
    id: "t6",
    name: "Liver Function Test",
    description: "LFT",
    price: 799,
    reportTimeHours: 24,
    categoryIds: ["liver"],
    iconKey: "liver",
    iconColor: "#F97316",
    iconBg: "#FFF7ED",
    parameters: 12,
  },
  {
    id: "t7",
    name: "HbA1c",
    description: "Average Blood Sugar (3 months)",
    price: 399,
    reportTimeHours: 12,
    categoryIds: ["diabetes"],
    iconKey: "droplet",
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    parameters: 1,
  },
  {
    id: "t8",
    name: "Kidney Function Test",
    description: "KFT / Renal Profile",
    price: 649,
    reportTimeHours: 24,
    categoryIds: ["kidney"],
    iconKey: "activity",
    iconColor: "#06B6D4",
    iconBg: "#ECFEFF",
    parameters: 10,
  },
];

// ─── Health Packages ─────────────────────────────────────────────────────

export const healthPackages: HealthPackage[] = [
  {
    id: "p1",
    name: "Basic Health Checkup",
    parameters: 15,
    price: 999,
    discountPercent: 20,
    iconKey: "clipboard",
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    isMostPopular: false,
  },
  {
    id: "p2",
    name: "Full Body Checkup",
    parameters: 70,
    price: 1999,
    discountPercent: 35,
    iconKey: "heart",
    iconColor: "#EF4444",
    iconBg: "#FEF2F2",
    isMostPopular: true,
  },
  {
    id: "p3",
    name: "Executive Health Package",
    parameters: 120,
    price: 3499,
    discountPercent: 30,
    iconKey: "shield",
    iconColor: "#22C55E",
    iconBg: "#F0FDF4",
    isMostPopular: false,
  },
];

// ─── Compare Tests Table (subset shown for comparison) ───────────────────

export const compareTestIds: string[] = ["t1", "t3", "t4", "t7"];