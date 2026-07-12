"use client";

// src/app/doctor-profile/page.tsx
import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DoctorHero from "@/components/doctors/DoctorHero";
import DoctorStats from "@/components/doctors/DoctorStats";
import DoctorFilters, {
  type DoctorFilterState,
} from "@/components/doctors/DoctorFilters";
import DoctorList, { type SortOption } from "@/components/doctors/DoctorList";
import Pagination from "@/components/doctors/Pagination";
import { doctors as allDoctors } from "@/lib/doctors";

const PAGE_SIZE = 4;

const initialFilters: DoctorFilterState = {
  search: "",
  specialization: "All Specializations",
  experience: "All Experience",
  availability: "Any Day",
  maxFee: 2000,
};

function matchesExperience(years: number, range: string) {
  if (range === "All Experience") return true;
  if (range === "0-5 Years") return years <= 5;
  if (range === "5-10 Years") return years > 5 && years <= 10;
  if (range === "10+ Years") return years > 10;
  return true;
}

export default function DoctorListingPage() {
  // Draft filters reflect live input; applied filters drive the results
  // (mirrors the "Apply Filters" button in the reference design).
  const [draftFilters, setDraftFilters] = useState<DoctorFilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<DoctorFilterState>(initialFilters);
  const [sort, setSort] = useState<SortOption>("Relevance");
  const [view, setView] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredDoctors = useMemo(() => {
    const list = allDoctors.filter((doc) => {
      const matchesSearch =
        appliedFilters.search.trim() === "" ||
        doc.name.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        doc.specialization
          .toLowerCase()
          .includes(appliedFilters.search.toLowerCase());

      const matchesSpecialization =
        appliedFilters.specialization === "All Specializations" ||
        doc.specialization === appliedFilters.specialization;

      const matchesAvailability =
        appliedFilters.availability === "Any Day" ||
        doc.availability === appliedFilters.availability;

      const matchesFee = doc.consultationFee <= appliedFilters.maxFee;

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesAvailability &&
        matchesFee &&
        matchesExperience(doc.experienceYears, appliedFilters.experience)
      );
    });

    const sorted = [...list];
    switch (sort) {
      case "Rating: High to Low":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "Fee: Low to High":
        sorted.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case "Fee: High to Low":
        sorted.sort((a, b) => b.consultationFee - a.consultationFee);
        break;
      case "Experience: High to Low":
        sorted.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      default:
        break;
    }
    return sorted;
  }, [appliedFilters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / PAGE_SIZE));
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setCurrentPage(1);
  };

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
              <DoctorList
                doctors={paginatedDoctors}
                totalCount={filteredDoctors.length}
                sort={sort}
                onSortChange={setSort}
                view={view}
                onViewChange={setView}
              />
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
