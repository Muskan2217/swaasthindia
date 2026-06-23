import {
  Droplet,
  Bug,
  Sun,
  Heart,
  Activity,
  ClipboardList,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/lib/lab-tests-data";

// "blood-drop" and "droplet" both map to Droplet but with different colors
// supplied by the data layer; "butterfly" uses Bug as the closest stand-in
// available in lucide-react's medical-adjacent icon set, "liver" uses Activity.
export const iconMap: Record<IconKey, LucideIcon> = {
  droplet: Droplet,
  "blood-drop": Droplet,
  butterfly: Bug,
  sun: Sun,
  heart: Heart,
  liver: Activity,
  clipboard: ClipboardList,
  shield: ShieldCheck,
  activity: Activity,
};
