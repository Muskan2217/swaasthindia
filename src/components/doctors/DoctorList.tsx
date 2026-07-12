"use client";

// src/components/doctors/DoctorList.tsx
import { LayoutGrid, List, ChevronDown } from "lucide-react";
import type { Doctor } from "@/lib/doctors";
import DoctorCard from "./DoctorCard";

export type SortOption = "Relevance" | "Rating: High to Low" | "Fee: Low to High" | "Fee: High to Low" | "Experience: High to Low";

const sortOptions: SortOption[] = [
  "Relevance",
  "Rating: High to Low",
  "Fee: Low to High",
  "Fee: High to Low",
  "Experience: High to Low",
];

interface DoctorListProps {
  doctors: Doctor[];
  totalCount: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export default function DoctorList({
  doctors,
  totalCount,
  sort,
  onSortChange,
  view,
  onViewChange,
}: DoctorListProps) {
  return (
    <div>
      {/* Top bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-700 sm:text-base">
          {totalCount} Doctors Found
        </p>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>
                  Sort by: {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="flex items-center overflow-hidden rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
              className={`p-2 transition ${
                view === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange("list")}
              aria-label="List view"
              className={`p-2 transition ${
                view === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      {doctors.length > 0 ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 gap-4 md:grid-cols-2"
              : "flex flex-col gap-4"
          }
        >
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} view={view} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-600">
            No doctors match your filters.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Try adjusting or resetting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
