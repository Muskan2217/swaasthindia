// src/components/doctor-profile/BottomInfoRow.tsx
import type { ServiceSupportItem, DoctorProfile } from "@/lib/doctor-profile-data";
import { Headphones, CheckCircle2, ChevronRight, Image as ImageIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  supportItems: ServiceSupportItem[];
  clinicImages: DoctorProfile["clinicImages"];
}

export default function BottomInfoRow({ supportItems, clinicImages }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* Our Service Support */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 bg-[#EEF2FF] rounded-xl flex items-center justify-center flex-shrink-0">
            <Headphones size={16} className="text-[#1A3FA4]" />
          </div>
          <h3 className="font-bold text-[#0D1B3E] text-base">Our Service Support</h3>
        </div>

        <div className="space-y-2.5">
          {supportItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between group py-1"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#1A3FA4] flex-shrink-0" />
                <span className="text-sm font-semibold text-[#0D1B3E] group-hover:text-[#1A3FA4] transition-colors">
                  {item.label}
                </span>
              </div>
              <ChevronRight size={15} className="text-gray-400 group-hover:text-[#1A3FA4] transition-colors" />
            </Link>
          ))}
        </div>

        {/* Support lady illustration */}
        <div className="mt-4 flex justify-end opacity-80">
          <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
            {/* Body */}
            <ellipse cx="40" cy="58" rx="18" ry="12" fill="#1A3FA4" opacity="0.8"/>
            {/* Head */}
            <circle cx="40" cy="30" r="14" fill="#FDDBB4"/>
            {/* Hair */}
            <path d="M26 28 Q27 16 40 16 Q53 16 54 28 Q50 20 40 20 Q30 20 26 28Z" fill="#2D1B0E"/>
            <path d="M26 28 Q24 36 28 40" stroke="#2D1B0E" strokeWidth="3" strokeLinecap="round" fill="none"/>
            {/* Headset */}
            <path d="M28 26 A12 12 0 0 1 52 26" stroke="#1A3FA4" strokeWidth="2" fill="none"/>
            <rect x="26" y="26" width="4" height="6" rx="2" fill="#1A3FA4"/>
            <rect x="50" y="26" width="4" height="6" rx="2" fill="#1A3FA4"/>
            {/* Laptop */}
            <rect x="20" y="48" width="32" height="20" rx="3" fill="#E5E7EB"/>
            <rect x="22" y="50" width="28" height="16" rx="2" fill="#60A5FA" opacity="0.6"/>
            <rect x="16" y="67" width="40" height="3" rx="1.5" fill="#9CA3AF"/>
            {/* Eyes */}
            <circle cx="36" cy="30" r="1.5" fill="#4A3728"/>
            <circle cx="44" cy="30" r="1.5" fill="#4A3728"/>
            {/* Smile */}
            <path d="M37 35 Q40 38 43 35" stroke="#C4884A" strokeWidth="1" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* View Clinic Images */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <ImageIcon size={16} className="text-orange-500" />
          </div>
          <h3 className="font-bold text-[#0D1B3E] text-base">View Clinic Images</h3>
        </div>

        {/* Image grid (placeholder tiles) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {clinicImages.map((_, idx) => (
            <div
              key={idx}
              className="aspect-video rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-gray-100 flex items-center justify-center overflow-hidden"
            >
              {/* Clinic interior illustration placeholder */}
              <svg width="48" height="36" viewBox="0 0 48 36" fill="none" className="opacity-50">
                <rect x="2" y="8" width="44" height="26" rx="2" fill="#BFDBFE"/>
                <rect x="4" y="10" width="40" height="22" rx="1" fill="#93C5FD" opacity="0.5"/>
                {/* Window */}
                <rect x="8" y="14" width="12" height="10" rx="1" fill="white" opacity="0.8"/>
                <line x1="14" y1="14" x2="14" y2="24" stroke="#93C5FD" strokeWidth="0.8"/>
                <line x1="8" y1="19" x2="20" y2="19" stroke="#93C5FD" strokeWidth="0.8"/>
                {/* Desk */}
                <rect x="24" y="22" width="18" height="2" rx="1" fill="#6B8DD6"/>
                <rect x="26" y="24" width="2" height="8" rx="1" fill="#6B8DD6"/>
                <rect x="38" y="24" width="2" height="8" rx="1" fill="#6B8DD6"/>
                {/* Floor */}
                <rect x="2" y="32" width="44" height="2" rx="1" fill="#A5B4D4" opacity="0.5"/>
              </svg>
            </div>
          ))}
        </div>

        <button className="w-full flex items-center justify-center gap-2 border border-[#1A3FA4]/25 text-[#1A3FA4] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#EEF2FF] transition-colors">
          View Clinic Images
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
