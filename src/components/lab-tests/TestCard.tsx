import { Clock } from "lucide-react";
import type { LabTest } from "@/lib/lab-tests-data";
import { iconMap } from "./iconMap";

interface TestCardProps {
  test: LabTest;
  isSelected?: boolean;
  onToggleSelect?: (testId: string) => void;
}

export default function TestCard({ test, isSelected = false, onToggleSelect }: TestCardProps) {
  const Icon = iconMap[test.iconKey];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col h-full">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: test.iconBg, color: test.iconColor }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{test.name}</h3>
          <p className="text-xs text-gray-500 truncate">{test.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-semibold text-rose-600">₹{test.price}</span>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          Report in {test.reportTimeHours} hrs
        </div>
      </div>

      <button
        onClick={() => onToggleSelect?.(test.id)}
        className={`mt-auto w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isSelected
            ? "bg-blue-50 text-blue-600 border border-blue-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isSelected ? "Added" : "Book Test"}
      </button>
    </div>
  );
}
