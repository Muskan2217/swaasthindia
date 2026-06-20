// src/components/doctor-profile/AboutDoctor.tsx
import type { DoctorProfile } from "@/lib/doctor-profile-data";
import { Languages, Briefcase, Info } from "lucide-react";

interface Props {
  doctor: DoctorProfile;
}

export default function AboutDoctor({ doctor }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Info size={18} className="text-[#1A3FA4]" />
        <h2 className="text-lg font-bold text-[#0D1B3E]">About Doctor</h2>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-5">{doctor.about}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Languages */}
        <div className="flex items-start gap-3 bg-[#F7F8FC] rounded-xl p-4">
          <div className="w-9 h-9 bg-[#EEF2FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Languages size={16} className="text-[#1A3FA4]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Languages</p>
            <div className="flex flex-wrap gap-1.5">
              {doctor.languages.map((lang) => (
                <span key={lang} className="text-xs font-semibold text-[#1A3FA4] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-start gap-3 bg-[#F7F8FC] rounded-xl p-6">
          <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Briefcase size={16} className="text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Experience</p>
            <p className="text-2xl font-bold text-text-primary">{doctor.experience}<span className="text-sm font-semibold text-gray-500 ml-1">years</span></p>
          </div>
        </div>

        {/* Hospital */}
        <div className="sm:col-span-2 flex items-start gap-3 bg-[#F7F8FC] rounded-xl p-4">
          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <path d="M9 22V12h6v10"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Clinic / Hospital</p>
            <p className="text-sm font-bold text-[#0D1B3E]">{doctor.hospital}</p>
            <p className="text-xs text-gray-500 mt-0.5">{doctor.location}</p>
          </div>
        </div>

        {/* Online availability */}
        <div className="sm:col-span-2 flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-green-700">
              {doctor.isOnlineAvailable ? "Online Consultation Available" : "In-clinic Only"}
            </span>
          </div>
          <span className="text-xs text-green-600 font-medium bg-green-100 px-2.5 py-1 rounded-full">
            {doctor.isOnlineAvailable ? "Video / Chat" : "In-person"}
          </span>
        </div>
      </div>
    </div>
  );
}
