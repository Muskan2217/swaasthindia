// src/components/doctor-profile/DoctorProfileHeader.tsx
import type { DoctorProfile } from "@/lib/doctor-profile-data";
import { MapPin, User, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface Props {
  doctor: DoctorProfile;
}

function DoctorAvatar({ doctor }: { doctor: DoctorProfile }) {
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#EEF2FF] to-[#DBEAFE] flex items-center justify-center border-4 border-white shadow-md">
        <svg viewBox="0 0 80 80" width="64" height="64" fill="none">
          {/* Head */}
          <circle cx="40" cy="28" r="16" fill="#FDDBB4"/>
          {/* Hair */}
          <path d="M24 26 Q26 12 40 12 Q54 12 56 26 Q52 18 40 18 Q28 18 24 26Z" fill="#4A3728"/>
          {/* Body / coat */}
          <ellipse cx="40" cy="60" rx="22" ry="18" fill="white" stroke="#E2E8F0" strokeWidth="1.5"/>
          {/* Tie / shirt */}
          <path d="M36 46 L40 56 L44 46 Q42 44 40 44 Q38 44 36 46Z" fill="#1A3FA4" opacity="0.8"/>
          {/* Stethoscope */}
          <circle cx="52" cy="54" r="4" fill="none" stroke="#4A5568" strokeWidth="1.8"/>
          <path d="M52 50 Q52 44 46 44" stroke="#4A5568" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          {/* Face details */}
          <circle cx="35" cy="27" r="1.5" fill="#4A3728"/>
          <circle cx="45" cy="27" r="1.5" fill="#4A3728"/>
          {/* Glasses */}
          <rect x="31" y="24" width="8" height="5" rx="2.5" fill="none" stroke="#4A3728" strokeWidth="1.2"/>
          <rect x="41" y="24" width="8" height="5" rx="2.5" fill="none" stroke="#4A3728" strokeWidth="1.2"/>
          <line x1="39" y1="26.5" x2="41" y2="26.5" stroke="#4A3728" strokeWidth="1"/>
          {/* Smile */}
          <path d="M36 33 Q40 37 44 33" stroke="#C4884A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      {/* Verified badge */}
      {doctor.isVerified && (
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#04bd0d] rounded-full flex items-center justify-center border-2 border-white shadow">
          <ShieldCheck size={14} className="text-white" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-200"}
        />
      ))}
      <span className="text-sm font-bold text-[#0D1B3E] ml-1">{rating}</span>
    </div>
  );
}

export default function DoctorProfileHeader({ doctor }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Main row */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-5 px-5 pt-5 pb-4">
        <DoctorAvatar doctor={doctor} />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              {doctor.name}
            </h1>
            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-0.5 rounded-full">
              {doctor.specialty}
            </span>
            <span className="text-xs font-bold text-[#1A3FA4] bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full">
              Experience
            </span>
          </div>

          <p className="text-sm text-gray-800 mb-2">{doctor.qualification}</p>

          <StarRating rating={doctor.rating} />
          <p className="text-xs text-gray-400 mt-0.5">{doctor.reviewCount} reviews</p>

          <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
            <MapPin size={16} className="text-[#E8192C] flex-shrink-0" />
            <span className="font-medium ">Location:</span>
            <span>{doctor.location}</span>
          </div>
        </div>

        {/* View Profile button */}
        <div className="sm:flex-shrink-0">
          <Link
            href={`/doctors/${doctor.slug}`}
            className="inline-flex items-center gap-2 border border-[#1A3FA4]/30 text-[#1A3FA4] font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <User size={15} />
            View Profile
          </Link>
        </div>
      </div>

      {/* Consultation fee + Certification row */}
      <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base">₹</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Consultation Fee</p>
            <p className="text-2xl font-bold text-[#0D1B3E]">₹ {doctor.consultationFee}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Certification</p>
            <p className="text-sm font-bold text-green-600">Verified Doctor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
