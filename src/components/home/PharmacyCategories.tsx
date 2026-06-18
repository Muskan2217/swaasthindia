"use client";

import Link from "next/link";
import Image from "next/image";
import { PHARMACY_CATEGORIES } from "@/lib/constants";

const CategoryIcons: Record<string, string> = {
  medicine: "/icons/pharmacy/medicine.png",
  "personal-care": "/icons/pharmacy/personal-care.png",
  surgical: "/icons/pharmacy/surgical.png",
  ayurvedic: "/icons/pharmacy/ayurvedic.png",
  "hair-care": "/icons/pharmacy/hair-care.png",
};

export default function PharmacyCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-3xl font-bold text-text-primary">
          Pharmacy Categories
        </h2>

        <Link
          href="/pharmacy"
          className="flex items-center gap-1.5 text-brand-blue font-semibold text-sm hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Categories */}
      <div className="flex sm:grid sm:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-2">
        {PHARMACY_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="min-w-[130px] sm:min-w-0 bg-white rounded-2xl p-4 flex flex-col items-center gap-3
                       border border-border-light
                       hover:shadow-card hover:-translate-y-1
                       transition-all duration-300 group"
          >
         {/* ICON */}
<div className="w-14 h-14 sm:w-20 sm:h-20 relative group-hover:scale-110 transition-transform duration-300">
  <Image
    src={CategoryIcons[cat.id]}
    alt={cat.name}
    fill
    className="object-contain"
  />
</div>

{/* TEXT */}
<span className="text-sm sm:text-lg font-medium text-text-primary text-center group-hover:text-brand-blue transition-colors">
  {cat.name}
</span>
          </Link>
        ))}
      </div>
    </section>
  );
}