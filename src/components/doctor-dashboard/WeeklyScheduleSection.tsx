import { CalendarClock, Settings2 } from "lucide-react";
import DayScheduleCard from "./DayScheduleCard";
import { weeklySchedule } from "@/lib/doctor-dashboard-data";

export default function WeeklyScheduleSection() {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-gray-700" />
          <h3 className="text-sm font-bold text-gray-800">Weekly Schedule</h3>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl px-3 py-2 hover:bg-blue-50 transition-colors">
          <Settings2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Manage Slots</span>
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-4">Customize your availability</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {weeklySchedule.map((day) => (
          <DayScheduleCard key={day.day} schedule={day} />
        ))}
      </div>
    </div>
  );
}
