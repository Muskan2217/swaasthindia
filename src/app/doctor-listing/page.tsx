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
import { getDoctors, getDoctorStats } from "@/lib/api";

const PAGE_SIZE = 4;

const initialFilters: DoctorFilterState = {
  search: "",
  location: "",
  specialization: "All Specializations",
  experience: "All Experience",
  availability: "Any Day",
  maxFee: 2000,
};

// Map experience dropdown ranges to a minimum threshold for API query
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

// Map frontend sort dropdown values to API sort parameters
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
      return null;
  }
}

// Construct query parameters for the doctors endpoint
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

  if (filters.location.trim()) {
    params.set("location", filters.location.trim());
  }

  if (filters.specialization !== "All Specializations") {
    params.set("specialization", filters.specialization);
  }

  if (filters.availability !== "Any Day") {
    params.set("availability", filters.availability);
  }

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

  // Dynamic doctor platform stats state inside component
  const [stats, setStats] = useState({
    doctors: 10000,
    specialties: 25,
    patients: 100000,
    rating: 4.8,
  });

  // Fetch dynamic stats on component mount
  useEffect(() => {
    async function loadStats() {
      const data = await getDoctorStats();
      if (data) {
        setStats(data);
      }
    }
    loadStats();
  }, []);

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

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  // Fetch doctors list whenever applied filters, sort option, or pagination changes
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
        <DoctorStats stats={stats} />

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