// src/components/doctor-dashboard/WeeklyScheduleSection.tsx
"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getDoctorSchedule,
  updateDoctorSchedule,
  type DayScheduleData,
} from "@/lib/api";

const DAY_COLORS: Record<string, string> = {
  Mon: "#2563EB",
  Tue: "#2563EB",
  Wed: "#EF4444",
  Thu: "#8B5CF6",
  Fri: "#2563EB",
  Sat: "#F97316",
  Sun: "#EF4444",
};

export default function WeeklyScheduleSection() {
  const { token } = useAuth();
  const [schedule, setSchedule] = useState<DayScheduleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) return;
    getDoctorSchedule(token)
      .then(setSchedule)
      .catch(() => setSchedule([]))
      .finally(() => setLoading(false));
  }, [token]);

  const updateDay = (day: string, patch: Partial<DayScheduleData>) => {
    setSchedule((prev) =>
      prev.map((d) => (d.day === day ? { ...d, ...patch } : d))
    );
    setSaved(false);
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await updateDoctorSchedule(token, schedule);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save schedule:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
        <div className="h-24 animate-pulse rounded-xl bg-gray-50" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            Weekly Schedule
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Customize your availability</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 px-3.5 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {saved && (
        <p className="text-xs text-green-600 mb-3">Schedule saved successfully.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {schedule.map((d) => (
          <div
            key={d.day}
            className="rounded-xl border border-gray-100 p-3 flex flex-col gap-2"
            style={{ borderTopColor: DAY_COLORS[d.day], borderTopWidth: 3 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">{d.day}</span>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!d.isOff}
                  onChange={(e) => updateDay(d.day, { isOff: !e.target.checked })}
                  className="w-3.5 h-3.5"
                />
              </label>
            </div>

            {d.isOff ? (
              <span className="text-xs font-medium text-red-500">Off</span>
            ) : (
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Start (9:00 AM)"
                  value={d.startTime ?? ""}
                  onChange={(e) => updateDay(d.day, { startTime: e.target.value })}
                  className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
                <input
                  type="text"
                  placeholder="End (2:00 PM)"
                  value={d.endTime ?? ""}
                  onChange={(e) => updateDay(d.day, { endTime: e.target.value })}
                  className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}