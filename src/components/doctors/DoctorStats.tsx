// src/components/doctors/DoctorStats.tsx
import { Users, Stethoscope, Smile, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

const stats: StatItem[] = [
  { icon: Users, value: "10,000+", label: "Verified Doctors" },
  { icon: Stethoscope, value: "25+", label: "Specialties" },
  { icon: Smile, value: "100,000+", label: "Happy Patients" },
  { icon: Star, value: "4.8/5", label: "Patient Rating" },
];

export default function DoctorStats() {
  return (
    <div className="mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/50 sm:grid-cols-4 sm:p-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <stat.icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="truncate text-xs text-slate-500 sm:text-sm">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
