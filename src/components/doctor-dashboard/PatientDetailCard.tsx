import { History, ChevronRight } from "lucide-react";
import Avatar from "./Avatar";
import VitalCard from "./VitalCard";
import { currentPatient } from "@/lib/doctor-dashboard-data";

export default function PatientDetailCard() {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Avatar name={currentPatient.name} avatarUrl={currentPatient.avatarUrl} size="lg" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">{currentPatient.name}</h2>
            <p className="text-sm text-gray-500">
              {currentPatient.age} Years &bull; {currentPatient.gender} &bull; {currentPatient.bloodGroup}
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors shrink-0">
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">History</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <VitalCard type="bp" value={currentPatient.vitals.bp} />
        <VitalCard type="temperature" value={currentPatient.vitals.temperature} />
      </div>
    </div>
  );
}
