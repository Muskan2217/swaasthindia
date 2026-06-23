import { ArrowRight } from "lucide-react";
import TestCard from "./TestCard";
import type { LabTest } from "@/lib/lab-tests-data";

interface PopularTestsSectionProps {
  tests: LabTest[];
  selectedTestIds: string[];
  onToggleSelect: (testId: string) => void;
}

export default function PopularTestsSection({
  tests,
  selectedTestIds,
  onToggleSelect,
}: PopularTestsSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Tests</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <TestCard
            key={test.id}
            test={test}
            isSelected={selectedTestIds.includes(test.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>

      <div className="flex justify-center mt-5">
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl px-5 py-2.5 hover:bg-gray-50 transition-colors">
          View All Tests
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
