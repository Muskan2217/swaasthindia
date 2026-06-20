import { Pill, Trash2 } from "lucide-react";
import type { Medicine } from "@/lib/doctor-dashboard-data";

interface MedicineRowProps {
  medicine: Medicine;
  onRemove?: (id: string) => void;
}

export default function MedicineRow({ medicine, onRemove }: MedicineRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${medicine.iconColor}18`, color: medicine.iconColor }}
      >
        <Pill className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{medicine.name}</p>
        <p className="text-xs text-gray-400">{medicine.type}</p>
      </div>

      <span className="text-sm font-medium text-gray-600 w-16 text-center shrink-0">
        {medicine.dosage}
      </span>

      <span className="text-sm text-gray-500 w-16 text-right shrink-0">{medicine.duration}</span>

      <button
        onClick={() => onRemove?.(medicine.id)}
        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
        aria-label={`Remove ${medicine.name}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
