"use client";

import { Search, FlaskConical } from "lucide-react";
import { useState } from "react";
import CategoryFilter from "./CategoryFilter";

interface HeroSearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function HeroSearchSection({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: HeroSearchSectionProps) {
  const [localValue, setLocalValue] = useState(searchQuery);

  const handleSearch = () => onSearchChange(localValue);

  return (
    <section className="relative bg-gradient-to-br from-rose-50 via-white to-white rounded-2xl overflow-hidden border border-rose-100">
      {/* Decorative icon, subtle, top-right */}
      <FlaskConical className="absolute -top-4 right-6 w-28 h-28 text-rose-100 rotate-12 pointer-events-none" />

      <div className="relative px-5 md:px-8 py-8 md:py-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Book Lab Tests</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1.5">
          Accurate results. Trusted labs. Home sample collection.
        </p>

        {/* Search bar */}
        <div className="mt-5 flex items-center gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search tests, packages, health checkups..."
              className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-800 placeholder:text-gray-400 shadow-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shrink-0"
          >
            Search
          </button>
        </div>

        {/* Category chips */}
        <div className="mt-5 -mx-5 md:-mx-8 px-5 md:px-8">
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
        </div>
      </div>
    </section>
  );
}
