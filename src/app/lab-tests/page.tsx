"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSearchSection from "@/components/lab-tests/HeroSearchSection";
import PopularTestsSection from "@/components/lab-tests/PopularTestsSection";
import HealthPackagesSection from "@/components/lab-tests/HealthPackagesSection";
import CompareTestsTable from "@/components/lab-tests/CompareTestsTable";
import SelectedTestsBar from "@/components/lab-tests/SelectedTestsBar";
import { popularTests, healthPackages, compareTestIds } from "@/lib/lab-tests-data";

export default function LabTestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);

  const toggleSelectTest = (testId: string) => {
    setSelectedTestIds((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
  };

  const filteredTests = useMemo(() => {
    return popularTests.filter((test) => {
      const matchesCategory = activeCategory === "all" || test.categoryIds.includes(activeCategory);
      const matchesSearch =
        searchQuery.trim() === "" ||
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const compareTests = useMemo(
    () => popularTests.filter((test) => compareTestIds.includes(test.id)),
    []
  );

  const totalPrice = useMemo(() => {
    return popularTests
      .filter((test) => selectedTestIds.includes(test.id))
      .reduce((sum, test) => sum + test.price, 0);
  }, [selectedTestIds]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

       <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        <HeroSearchSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <PopularTestsSection
          tests={filteredTests}
          selectedTestIds={selectedTestIds}
          onToggleSelect={toggleSelectTest}
        />

        <HealthPackagesSection packages={healthPackages} />

        <CompareTestsTable
          tests={compareTests}
          selectedTestIds={selectedTestIds}
          onToggleSelect={toggleSelectTest}
        />

       <Footer />

      </main>

     

      <SelectedTestsBar
        count={selectedTestIds.length}
        totalPrice={totalPrice}
        onContinue={() => alert(`Proceeding with ${selectedTestIds.length} test(s), total ₹${totalPrice}`)}
      />
      
    </div>
  );
}
