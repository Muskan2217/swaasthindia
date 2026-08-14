"use client";
import Image from "next/image";
import { RefreshCw, Calendar } from "lucide-react";
import { patientData } from "@/lib/patient-dashboard-data";





interface PatientInfoCardProps {
  onRefresh?: () => void;
}

export default function PatientInfoCard({ onRefresh }: PatientInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Avatar */}
    <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
  <Image
    src={patientData.avatar || "/images/default-avatar.png"}
    alt={patientData.name}
    width={80}
    height={80}
    className="w-full h-full object-cover"
  />
</div>
      {/* Patient Details */}
      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-800 ">{patientData.name}</h2>
        <p className="text-sm  text-600" >Patient ID: {patientData.id}</p>
      </div>

      {/* Appointment */}
      <div className="flex items-center gap-4 bg-blue-50 rounded-xl px-4 py-2.5">
        <Calendar className="w-6 h-6 text-blue-500 shrink-0" />
        <div>
          <p className="text-xs text-gray-600 font-medium">Appointment</p>
          <p className="text-sm font-semibold text-gray-700">
            {patientData.appointment.date} &bull; {patientData.appointment.time}
          </p>
        </div>
      </div>

      {/* Refresh */}
      <button
        onClick={onRefresh}
className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 w-32 h-12 border border-blue-300 rounded-xl px-4 hover:bg-blue-50 transition-colors shrink-0"      >
        <RefreshCw className="w-5.5 h-3.5" />
        Refresh
      </button>
    </div>
  );
}