"use client";
import { Users, Hash, Wifi } from "lucide-react";
import { queueData } from "@/lib/patient-dashboard-data";

export default function QueueStatusCard() {
  const { estimatedWaitDisplay, patientsAhead, queueNumber, isRealTime } = queueData;

  // Circle parameters
const radius = 70; // smaller radius = more inner space
const circumference = 2 * Math.PI * radius;
const progress = 0.72;
const dashOffset = circumference * (1 - progress);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Your Queue Status</h3>

      {/* Circular Timer */}
      <div className="flex justify-center mb-5">
        <div className="relative w-64 h-64 flex items-center justify-center">
<svg
  className="absolute inset-0 w-full h-full -rotate-90"
  viewBox="0 0 180 180"
>
  <circle
    cx="90"
    cy="90"
    r={radius}
    stroke="#F0F4FF"
    strokeWidth="12"
    fill="none"
  />
  <circle
    cx="90"
    cy="90"
    r={radius}
    stroke="url(#queueGrad)"
    strokeWidth="12"
    fill="none"
    strokeLinecap="round"
    strokeDasharray={circumference}
    strokeDashoffset={dashOffset}
  />

  <defs>
    <linearGradient id="queueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#6366F1" />
      <stop offset="100%" stopColor="#3B82F6" />
    </linearGradient>
  </defs>
</svg>
          <div className="text-center z-10">
            <p className="text-2xl font-bold text-gray-800">{estimatedWaitDisplay}</p>
            <p className="text-xs text-gray-600 font-medium">Minutes</p>
            <p className="text-xs text-gray-600">Estimated Wait</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-sm">Patients Ahead</span>
          </div>
          <span className="text-sm font-bold text-gray-800">{patientsAhead}</span>
        </div>

        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2 text-gray-500">
            <Hash className="w-4 h-4" />
            <span className="text-sm">Queue Number</span>
          </div>
          <span className="text-sm font-bold text-gray-800">{queueNumber}</span>
        </div>

        {isRealTime && (
          <div className="flex items-center gap-2 px-1 pt-1">
            <Wifi className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Queue updates in real time</span>
          </div>
        )}
      </div>
    </div>
  );
}