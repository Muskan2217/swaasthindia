// src/components/doctor-profile/DoctorProfileView.tsx
import {
  BadgeCheck,
  Star,
  MapPin,
  Briefcase,
  Stethoscope,
  IndianRupee,
  Building2,
} from "lucide-react";
import type { DoctorProfileData } from "@/lib/api";

interface DoctorProfileViewProps {
  doctor: DoctorProfileData;
}

const availabilityStyles: Record<DoctorProfileData["availability"], string> = {
  "Available Today": "bg-green-50 text-green-700 ring-1 ring-green-100",
  "Available Tomorrow": "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
  "Not Available": "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

export default function DoctorProfileView({ doctor }: DoctorProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Header card: everything in one compact row + fee, about below */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doctor.profileImage ?? "https://i.pravatar.cc/300"}
            alt={doctor.name}
            className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-slate-100"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                {doctor.name}
              </h1>
              {doctor.isVerified && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
                  title="Verified Doctor"
                >
                  <BadgeCheck className="h-3.5 w-3.5 fill-blue-600 text-white" />
                  Verified
                </span>
              )}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${availabilityStyles[doctor.availability]}`}
              >
                {doctor.availability}
              </span>
            </div>

            {/* Everything else in one compact wrapping row */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 text-blue-500" />
                {doctor.qualification} · {doctor.specialization}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-blue-500" />
                {doctor.experienceYears}+ yrs
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-500" />
                {doctor.hospitalName}, {doctor.city}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-slate-800">
                  {doctor.rating.toFixed(1)}
                </span>
                <span className="text-slate-400">
                  ({doctor.totalReviews})
                </span>
              </span>
              {doctor.nextSlot && doctor.availability !== "Not Available" && (
                <span>
                  Next Slot:{" "}
                  <span className="font-medium text-blue-600">
                    {doctor.nextSlot}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="w-full shrink-0 rounded-xl bg-blue-50 p-4 text-center sm:w-40">
            <p className="flex items-center justify-center gap-1 text-2xl font-semibold text-slate-900">
              <IndianRupee className="h-5 w-5" />
              {doctor.consultationFee}
            </p>
            <p className="mt-1 text-xs text-slate-500">Consultation Fee</p>
          </div>
        </div>

        {/* About — second line inside the same card */}
        {doctor.about && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Building2 className="h-4 w-4 text-blue-500" />
              About
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {doctor.about}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
