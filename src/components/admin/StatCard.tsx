// src/components/admin/StatCard.tsx
import type { ElementType } from "react";

interface StatCardProps {
  icon: ElementType;
  label: string;
  value: string | number;
  iconColor?: "blue" | "red" | "green" | "navy" | "amber";
}

const ICON_STYLES: Record<NonNullable<StatCardProps["iconColor"]>, string> = {
  blue: "bg-blue-50 text-blue-600",
  red: "bg-red-50 text-red-600",
  green: "bg-green-50 text-green-700",
  navy: "bg-slate-100 text-[#0D1B3E]",
  amber: "bg-amber-50 text-amber-600",
};

export default function StatCard({ icon: Icon, label, value, iconColor = "blue" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ICON_STYLES[iconColor]}`}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="text-xl font-semibold text-[#0D1B3E]">{value}</p>
          <p className="truncate text-xs text-slate-500 sm:text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}
