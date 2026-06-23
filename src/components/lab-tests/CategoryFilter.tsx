import { ChevronDown } from "lucide-react";
import { categories } from "@/lib/lab-tests-data";
import { iconMap } from "./iconMap";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = cat.icon ? iconMap[cat.icon] : null;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors shrink-0 ${
              isActive
                ? "bg-rose-500 text-white border-rose-500"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {cat.label}
          </button>
        );
      })}

      <button className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-gray-500 border border-gray-200 bg-white hover:border-gray-300 transition-colors shrink-0">
        More
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
