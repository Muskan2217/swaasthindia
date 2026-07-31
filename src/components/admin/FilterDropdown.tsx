// src/components/admin/FilterDropdown.tsx
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  value: string;
  options: readonly { label: string; value: string }[];
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterDropdown({ value, options, onChange, className = "" }: FilterDropdownProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-700 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
