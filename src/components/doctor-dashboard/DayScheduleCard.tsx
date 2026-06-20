import { CalendarOff } from "lucide-react";
import type { DaySchedule } from "@/lib/doctor-dashboard-data";

interface DayScheduleCardProps {
  schedule: DaySchedule;
}

export default function DayScheduleCard({ schedule }: DayScheduleCardProps) {
  if (schedule.isOff) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-3 flex flex-col items-center justify-center text-center min-h-[88px]">
        <p className="text-sm font-bold text-red-500 mb-1">{schedule.day}</p>
        <p className="text-xs font-semibold text-red-400 mb-1.5">OFF</p>
        <CalendarOff className="w-3.5 h-3.5 text-red-300" />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-3 flex flex-col items-center justify-center text-center min-h-[88px]"
      style={{ backgroundColor: `${schedule.accentColor}0D`, borderColor: `${schedule.accentColor}33` }}
    >
      <p className="text-sm font-bold mb-1" style={{ color: schedule.accentColor }}>
        {schedule.day}
      </p>
      <p className="text-xs font-medium text-gray-600 leading-tight">{schedule.startTime}</p>
      <p className="text-xs text-gray-400">-</p>
      <p className="text-xs font-medium text-gray-600 leading-tight">{schedule.endTime}</p>
    </div>
  );
}
