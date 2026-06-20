// src/components/doctor-profile/RelatedDoctors.tsx
import type { RelatedDoctor } from "@/lib/doctor-profile-data";
import { Star, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  doctors: RelatedDoctor[];
}

function RelatedDoctorCard({ doctor }: { doctor: RelatedDoctor }) {
  return (
    <div className="bg-[#F7F8FC] rounded-xl p-4 flex flex-col gap-3 border border-gray-100 hover:border-[#1A3FA4]/30 hover:shadow-sm transition-all">
      {/* Avatar + name row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow"
            style={{ backgroundColor: doctor.avatarColor }}
          >
            {doctor.avatarInitials}
          </div>
          {doctor.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1A3FA4] rounded-full flex items-center justify-center border border-white">
              <ShieldCheck size={10} className="text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[#0D1B3E] text-sm truncate">{doctor.name}</p>
          <p className="text-xs text-gray-500 truncate">{doctor.specialty}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          <span className="font-semibold text-[#0D1B3E]">{doctor.rating}</span>
        </div>
        <span>{doctor.experience} yrs exp.</span>
        <span className="font-bold text-[#1A3FA4]">₹{doctor.consultationFee}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <MapPin size={11} className="text-[#E8192C] flex-shrink-0" />
        <span className="truncate">{doctor.location}</span>
      </div>

      {/* CTA */}
      <Link
        href={`/doctors/${doctor.slug}`}
        className="flex items-center justify-center gap-1.5 bg-white border border-[#1A3FA4]/25 text-[#1A3FA4] font-semibold text-xs py-2 rounded-lg hover:bg-[#EEF2FF] transition-colors"
      >
        Book Appointment
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}

export default function RelatedDoctors({ doctors }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#0D1B3E]">Similar Specialists</h2>
        <Link href="/doctors" className="text-sm font-semibold text-[#1A3FA4] hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {doctors.map((doctor) => (
          <RelatedDoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
