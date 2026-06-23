import type { HealthPackage } from "@/lib/lab-tests-data";
import { iconMap } from "./iconMap";

interface PackageCardProps {
  pkg: HealthPackage;
  onBook?: (pkgId: string) => void;
}

export default function PackageCard({ pkg, onBook }: PackageCardProps) {
  const Icon = iconMap[pkg.iconKey];

  return (
    <div
      className={`relative bg-white rounded-2xl border p-4 flex flex-col h-full ${
        pkg.isMostPopular ? "border-rose-200 shadow-md" : "border-gray-100 shadow-sm"
      }`}
    >
      {pkg.isMostPopular && (
        <span className="absolute -top-2.5 left-4 bg-rose-500 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
          Most Popular
        </span>
      )}

      <div className="flex items-start gap-3 mb-3 mt-1.5">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: pkg.iconBg, color: pkg.iconColor }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-gray-900">{pkg.name}</h3>
          <p className="text-xs text-gray-500">{pkg.parameters}+ Parameters</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-semibold text-rose-600">₹{pkg.price}</span>
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          Save {pkg.discountPercent}%
        </span>
      </div>

      <button
        onClick={() => onBook?.(pkg.id)}
        className="mt-auto w-full py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Book Package
      </button>
    </div>
  );
}
