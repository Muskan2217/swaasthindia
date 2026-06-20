import { Users2, ArrowRight } from "lucide-react";
import QueuePatientCard from "./QueuePatientCard";
import { liveQueue } from "@/lib/doctor-dashboard-data";

export default function LiveQueueSection() {
  const waitingCount = liveQueue.filter((p) => p.status === "waiting").length;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users2 className="w-4 h-4 text-gray-700" />
          <h3 className="text-sm font-bold text-gray-800">Live Queue</h3>
        </div>
        <span className="text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
          {waitingCount} Waiting
        </span>
      </div>

      <div className="space-y-2.5 flex-1">
        {liveQueue.map((patient) => (
          <QueuePatientCard key={patient.id} patient={patient} />
        ))}
      </div>

      <button className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl py-2.5 hover:bg-blue-50 transition-colors">
        View All Queue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
