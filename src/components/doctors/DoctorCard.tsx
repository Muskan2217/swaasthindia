
import Link from "next/link";
import {
  BadgeCheck,
  Star,
  MapPin,
  Briefcase,
  Stethoscope,
  IndianRupee,
} from "lucide-react";
import type { Doctor } from "@/lib/doctors";

interface DoctorCardProps {
  doctor: Doctor;
  view?: "list" | "grid";
}

const availabilityStyles: Record<Doctor["availability"], string> = {
  "Available Today": "bg-green-50 text-green-700 ring-1 ring-green-100",
  "Available Tomorrow": "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
  "Not Available": "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

export default function DoctorCard({ doctor, view = "list" }: DoctorCardProps) {
  const isList = view === "list";
  const profileHref = doctor.slug ? `/doctor-profile/${doctor.slug}` : "#";

  return (
    <div
      className={`group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-100/60 ${
        isList ? "sm:p-6" : ""
      }`}
    >
      <div
        className={`flex flex-col gap-5 ${
          isList ? "sm:flex-row sm:items-center sm:justify-between" : ""
        }`}
      >
        {/* Doctor identity */}
        <div className={`flex gap-4 ${isList ? "sm:w-[38%]" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doctor.image}
            alt={doctor.name}
            className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-slate-100 transition-transform duration-200 group-hover:scale-[1.03]"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-base font-semibold text-slate-900">
                {doctor.name}
              </h3>
              {doctor.verified && (
                <BadgeCheck
                  className="h-4 w-4 shrink-0 fill-blue-600 text-white"
                  strokeWidth={2}
                />
              )}
            </div>
            <p className="mt-0.5 truncate text-sm text-slate-500">
              {doctor.qualification}
            </p>

            <div className="mt-2 space-y-1.5 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                <span className="truncate">{doctor.specialization}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                <span>{doctor.experienceYears}+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location & fee */}
        <div
          className={`space-y-1.5 text-sm text-slate-600 ${
            isList ? "sm:w-[26%]" : ""
          }`}
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-500" />
            <span className="truncate">
              {doctor.hospital}, {doctor.city}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="h-3.5 w-3.5 shrink-0 text-blue-500" />
            <span>₹{doctor.consultationFee} Consultation Fee</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
            <span className="font-medium text-slate-800">
              {doctor.rating.toFixed(1)}
            </span>
            <span className="text-slate-400">({doctor.reviewCount})</span>
          </div>
        </div>

        {/* Availability & actions */}
        <div
          className={`flex flex-col gap-2.5 ${
            isList ? "sm:w-[26%] sm:items-end" : ""
          }`}
        >
          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${availabilityStyles[doctor.availability]}`}
          >
            {doctor.availability}
          </span>
          {doctor.availability !== "Not Available" && (
            <p className="text-sm text-slate-600">
              Next Slot:{" "}
              <span className="font-medium text-blue-600">
                {doctor.nextSlot}
              </span>
            </p>
          )}

        <div className={`mt-1 flex gap-2 ${isList ? "sm:flex-col sm:w-40" : ""}`}>
            <Link
              href={profileHref}
              className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-red-600 hover:shadow-green-200"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
