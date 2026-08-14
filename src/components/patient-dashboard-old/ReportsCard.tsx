"use client";
import { useState } from "react";
import { Search, SlidersHorizontal, ExternalLink, MoreVertical, ChevronRight, Droplets, Beaker, Pill, Heart } from "lucide-react";
import { myReports, Report, ReportStatus } from "@/lib/patient-dashboard-data";

function StatusBadge({ status }: { status: ReportStatus }) {
  const styles: Record<ReportStatus, string> = {
    Ready: "bg-green-100 text-green-700",
    Processing: "bg-blue-100 text-blue-600",
    "Report Ready": "bg-orange-100 text-orange-600",
    Pending: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
}

function TestIcon({ color }: { color: string }) {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <Droplets className="w-3.5 h-3.5" />
    </div>
  );
}

export default function MyReportsTable() {
  const [search, setSearch] = useState("");

  const filtered = myReports.filter((r) =>
    r.testName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-base font-bold text-gray-800">My Reports</h3>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-44 pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
          </div>
          {/* Filter */}
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">Test Name</th>
              <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">Date</th>
              <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">Status</th>
              <th className="text-left text-xs font-semibold text-gray-400 pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report) => (
              <tr key={report.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    <TestIcon color={report.iconColor} />
                    <span className="text-sm font-medium text-gray-700">{report.testName}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <p className="text-sm text-gray-600">{report.date}</p>
                  <p className="text-xs text-gray-400">{report.time}</p>
                </td>
                <td className="py-3.5 pr-4">
                  <StatusBadge status={report.status} />
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      View Report
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((report) => (
          <div key={report.id} className="bg-gray-50 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <TestIcon color={report.iconColor} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate">{report.testName}</p>
                <p className="text-xs text-gray-400">{report.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={report.status} />
              <button className="p-1 text-blue-500">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="mt-4 flex justify-center">
        <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View All Reports
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}