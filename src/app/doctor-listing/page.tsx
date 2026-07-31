"use client";

// src/app/doctor-listing/page.tsx
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DoctorHero from "@/components/doctors/DoctorHero";
import DoctorStats from "@/components/doctors/DoctorStats";
import DoctorFilters, {
  type DoctorFilterState,
} from "@/components/doctors/DoctorFilters";
import DoctorList, { type SortOption } from "@/components/doctors/DoctorList";
import Pagination from "@/components/doctors/Pagination";
import { getDoctors } from "@/lib/api";

const PAGE_SIZE = 4;

const initialFilters: DoctorFilterState = {
  search: "",
  specialization: "All Specializations",
  experience: "All Experience",
  availability: "Any Day",
  maxFee: 2000,
};

// ---------------------------------------------------------------------
// FIX: previously the applied filters and sort were never turned into
// query params, and the fetch effect only re-ran on page change — so
// "Apply Filters" updated local state but never asked the backend for
// anything different.
// ---------------------------------------------------------------------

/**
 * Backend only supports a MINIMUM experience threshold (`experience_years >= X`),
 * not a capped range. "0-5 Years" therefore can't be filtered precisely
 * server-side yet (no upper bound param) — it's treated as "no filter".
 * If exact range filtering is needed, the backend scope needs a max param too.
 */
function experienceRangeToMinYears(range: string): number | null {
  switch (range) {
    case "5-10 Years":
      return 5;
    case "10+ Years":
      return 10;
    default:
      return null;
  }
}

/**
 * Backend `sorted()` scope only sorts fee ASCENDING (Fee: Low to High).
 * There is currently no descending-fee option server-side, so
 * "Fee: High to Low" falls back to the same ascending sort for now.
 * (Flag this to the backend if true high-to-low fee sort is needed.)
 */
function sortOptionToBackendSort(sort: SortOption): string | null {
  switch (sort) {
    case "Rating: High to Low":
      return "rating";
    case "Fee: Low to High":
    case "Fee: High to Low":
      return "fee";
    case "Experience: High to Low":
      return "experience";
    default:
      return null; // "Relevance" -> let backend use its own default order
  }
}

function buildQueryParams(
  filters: DoctorFilterState,
  sort: SortOption,
  page: number,
  perPage: number
): string {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("per_page", String(perPage));

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.specialization !== "All Specializations") {
    params.set("specialization", filters.specialization);
  }

  if (filters.availability !== "Any Day") {
    params.set("availability", filters.availability);
  }

  // 2000 represents the "₹2000+" (no cap) end of the slider
  if (filters.maxFee < 2000) {
    params.set("fee", String(filters.maxFee));
  }

  const minExperience = experienceRangeToMinYears(filters.experience);
  if (minExperience !== null) {
    params.set("experience", String(minExperience));
  }

  const backendSort = sortOptionToBackendSort(sort);
  if (backendSort) {
    params.set("sort", backendSort);
  }

  return params.toString();
}

export default function DoctorListingPage() {
  const [draftFilters, setDraftFilters] = useState<DoctorFilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<DoctorFilterState>(initialFilters);
  const [sort, setSort] = useState<SortOption>("Relevance");
  const [view, setView] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil(totalDoctors / PAGE_SIZE));

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setCurrentPage(1);
  };

  // Resetting to page 1 whenever sort changes, since the result order shifts
  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  // Load doctors from backend
  // FIX: now depends on appliedFilters + sort (not just currentPage), and
  // builds real query params so the backend actually filters/sorts.
  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        setLoadError(null);

        const query = buildQueryParams(appliedFilters, sort, currentPage, PAGE_SIZE);
        const response = await getDoctors(query);

        setDoctors(response.data);
        setTotalDoctors(response.meta?.total ?? response.data.length);
      } catch (error) {
        console.error("Failed to load doctors:", error);
        setLoadError("Couldn't load doctors. Please try again.");
        setDoctors([]);
        setTotalDoctors(0);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, [appliedFilters, sort, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <DoctorHero />
        <DoctorStats />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            {/* Filter sidebar */}
            <DoctorFilters
              filters={draftFilters}
              onChange={setDraftFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />

            {/* Doctor results */}
            <div>
              {loadError && (
                <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {loadError}
                </div>
              )}

              {loading ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                  Loading doctors...
                </div>
              ) : (
                <DoctorList
                  doctors={doctors}
                  totalCount={totalDoctors}
                  sort={sort}
                  onSortChange={handleSortChange}
                  view={view}
                  onViewChange={setView}
                />
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
