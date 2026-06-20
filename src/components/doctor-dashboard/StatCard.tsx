import { Users, Hourglass } from "lucide-react";
import type { StatCardData } from "@/lib/doctor-dashboard-data";

const iconMap = {
  users: Users,
  hourglass: Hourglass,
};

interface StatCardProps {
  data: StatCardData;
}

export default function StatCard({ data }: StatCardProps) {
  const Icon = iconMap[data.icon];

  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 flex-1"
      style={{ backgroundColor: data.bgColor }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-white"
      >
        <Icon className="w-5 h-5" style={{ color: data.accentColor }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">{data.label}</p>
        <p className="text-3xl font-bold leading-tight" style={{ color: data.accentColor }}>
          {data.value}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{data.subLabel}</p>
      </div>
    </div>
  );
}
