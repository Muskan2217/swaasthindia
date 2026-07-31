// src/components/admin/StatusBadge.tsx

const STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  confirmed: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
  completed: "bg-green-50 text-green-700 ring-1 ring-green-100",
  cancelled: "bg-red-50 text-red-600 ring-1 ring-red-100",
  verified: "bg-green-50 text-green-700 ring-1 ring-green-100",
  active: "bg-green-50 text-green-700 ring-1 ring-green-100",
  inactive: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  rejected: "bg-red-50 text-red-600 ring-1 ring-red-100",
};

const LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  verified: "Verified",
  active: "Active",
  inactive: "Inactive",
  rejected: "Rejected",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const style = STYLES[key] ?? "bg-slate-100 text-slate-500 ring-1 ring-slate-200";
  const label = LABELS[key] ?? status;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style} ${className}`}>
      {label}
    </span>
  );
}
