"use client";

// src/components/doctors/DoctorFilters.tsx
import { Search, MapPin, ChevronDown, PhoneCall } from "lucide-react";
import {
  specializations,
  experienceRanges,
  availabilityOptions,
} from "@/lib/doctors";

export interface DoctorFilterState {
  search: string;
  location: string;
  specialization: string;
  experience: string;
  availability: string;
  maxFee: number;
}

interface DoctorFiltersProps {
  filters: DoctorFilterState;
  onChange: (filters: DoctorFilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

const MAX_FEE_CAP = 2000;

export default function DoctorFilters({
  filters,
  onChange,
  onApply,
  onReset,
}: DoctorFiltersProps) {
  const update = <K extends keyof DoctorFilterState>(
    key: K,
    value: DoctorFilterState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <aside className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Filters</h2>
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Reset
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onApply();
          }}
        >
          {/* Search Doctor */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Search Doctor
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => update("search", e.target.value)}
                placeholder="Search by name, specialty..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Location */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Location
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Search by city or area..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Specialization */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Specialization
            </label>
            <div className="relative">
              <select
                value={filters.specialization}
                onChange={(e) => update("specialization", e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {specializations.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Experience */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Experience
            </label>
            <div className="relative">
              <select
                value={filters.experience}
                onChange={(e) => update("experience", e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {experienceRanges.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Availability */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Availability
            </label>
            <div className="relative">
              <select
                value={filters.availability}
                onChange={(e) => update("availability", e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {availabilityOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Fees Range */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Fees Range
            </label>
            <input
              type="range"
              min={0}
              max={MAX_FEE_CAP}
              step={50}
              value={filters.maxFee}
              onChange={(e) => update("maxFee", Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>₹0</span>
              <span>
                {filters.maxFee >= MAX_FEE_CAP
                  ? `₹${MAX_FEE_CAP}+`
                  : `₹${filters.maxFee}`}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </form>
      </div>
    </aside>
  );
}