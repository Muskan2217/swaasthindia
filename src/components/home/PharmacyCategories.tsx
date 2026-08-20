"use client";

import { useState } from "react";
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
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
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

      <div className="flex sm:grid sm:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-2">
        {PHARMACY_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            onClick={(e) => {
              e.preventDefault();
              setShowComingSoon(true);
            }}
            className="min-w-[130px] sm:min-w-0 bg-white rounded-2xl p-4 flex flex-col items-center gap-3
                       border border-border-light
                       hover:shadow-card hover:-translate-y-1
                       transition-all duration-300 group"
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 relative group-hover:scale-110 transition-transform duration-300">
              <Image
                src={CategoryIcons[cat.id]}
                alt={cat.name}
                fill
                className="object-contain"
              />
            </div>

            <span className="text-sm sm:text-lg font-medium text-text-primary text-center group-hover:text-brand-blue transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      {showComingSoon && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowComingSoon(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg
                className="w-7 h-7 text-brand-blue"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M10.29 3.86l-8.82 15A2 2 0 003.18 22h17.64a2 2 0 001.71-3.14l-8.82-15a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-text-primary">
              Coming Soon
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              This category will be available soon.
            </p>

            <button
              onClick={() => setShowComingSoon(false)}
              className="mt-5 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </section>
  );
}