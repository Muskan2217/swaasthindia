import { Clock, ArrowRight } from "lucide-react";
import { iconMap } from "./iconMap";
import type { LabTest } from "@/lib/lab-tests-data";

interface CompareTestsTableProps {
  tests: LabTest[];
  selectedTestIds: string[];
  onToggleSelect: (testId: string) => void;
}

export default function CompareTestsTable({
  tests,
  selectedTestIds,
  onToggleSelect,
}: CompareTestsTableProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Compare Tests</h2>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Test Name</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Parameters</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Price</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Report Time</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => {
                const Icon = iconMap[test.iconKey];
                const isSelected = selectedTestIds.includes(test.id);

                return (
                  <tr key={test.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: test.iconBg, color: test.iconColor }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{test.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      {test.parameters} Parameter{test.parameters > 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-rose-600">₹{test.price}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {test.reportTimeHours} hrs
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => onToggleSelect(test.id)}
                        className={`text-xs font-medium px-3.5 py-1.5 rounded-lg border transition-colors ${
                          isSelected
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        {isSelected ? "Added" : "Book Test"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-50">
          {tests.map((test) => {
            const Icon = iconMap[test.iconKey];
            const isSelected = selectedTestIds.includes(test.id);

            return (
              <div key={test.id} className="p-4 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: test.iconBg, color: test.iconColor }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{test.name}</p>
                  <p className="text-xs text-gray-500">
                    {test.parameters} Param{test.parameters > 1 ? "s" : ""} &bull; ₹{test.price} &bull;{" "}
                    {test.reportTimeHours} hrs
                  </p>
                </div>
                <button
                  onClick={() => onToggleSelect(test.id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border shrink-0 transition-colors ${
                    isSelected
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-white text-blue-600 border-blue-200"
                  }`}
                >
                  {isSelected ? "Added" : "Book"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <button className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          View All Tests
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
