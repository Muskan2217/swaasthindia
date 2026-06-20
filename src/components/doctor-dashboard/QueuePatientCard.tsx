import { Activity, Clock } from "lucide-react";
import Avatar from "./Avatar";
import type { QueuePatient } from "@/lib/doctor-dashboard-data";

interface QueuePatientCardProps {
  patient: QueuePatient;
}

export default function QueuePatientCard({ patient }: QueuePatientCardProps) {
  const isInRoom = patient.status === "in-room";

  return (
    <div
      className="rounded-xl p-3 flex items-center gap-3 bg-white border-l-4 shadow-sm"
      style={{ borderLeftColor: patient.borderColor }}
    >
      <Avatar name={patient.name} avatarUrl={patient.avatarUrl} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{patient.name}</p>
        <p className="text-xs text-gray-500 truncate">{patient.reason}</p>
      </div>
      <div
        className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
          isInRoom ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
        }`}
      >
        {isInRoom ? <Activity className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
        <span className="hidden sm:inline">{patient.statusLabel}</span>
      </div>
    </div>
  );
}
