"use client";

import { useState } from "react";
import { FileText, Upload, Plus, Search, ChevronDown, FileDown, PenLine } from "lucide-react";
import MedicineRow from "./MedicineRow";
import { prescribedMedicines, dosageOptions, type Medicine } from "@/lib/doctor-dashboard-data";

export default function PrescriptionSection() {
  const [medicines, setMedicines] = useState<Medicine[]>(prescribedMedicines);
  const [search, setSearch] = useState("");
  const [dosage, setDosage] = useState(dosageOptions[0]);

  const handleRemove = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-700" />
          <h3 className="text-sm font-bold text-gray-800">Digital Prescription</h3>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl px-3 py-2 hover:bg-blue-50 transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload Reports</span>
        </button>
      </div>

      {/* Search + Dosage row */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3 mb-3">
        <div>
          <label className="text-xs font-medium text-gray-400 mb-1 block">Medicine Name</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 mb-1 block">Dosage</label>
          <div className="relative">
            <select
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-700 bg-white"
            >
              {dosageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 mb-4 hover:text-blue-700 transition-colors">
        <Plus className="w-4 h-4" />
        Add Medicine
      </button>

      {/* Medicine List */}
      <div className="mb-2">
        {medicines.length > 0 ? (
          medicines.map((med) => (
            <MedicineRow key={med.id} medicine={med} onRemove={handleRemove} />
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No medicines added yet.</p>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
        <button className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors">
          <FileDown className="w-4 h-4" />
          Preview PDF
        </button>
        <button className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 rounded-xl py-2.5 hover:bg-blue-700 transition-colors">
          <PenLine className="w-4 h-4" />
          Generate &amp; Sign
        </button>
      </div>
    </div>
  );
}
