// src/components/patient-dashboard/LiveQueueCard.tsx
"use client";

import { useEffect, useState } from "react";
import { Users, ListOrdered, Radio, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getLiveQueueStatus, type LiveQueueStatus } from "@/lib/api";

function WaitRing({
  minutes,
  patientsAhead,
  isNext,
}: {
  minutes: number;
  patientsAhead: number;
  isNext: boolean;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = isNext ? 1 : Math.min(patientsAhead / 8, 1);
  const offset = circumference * (1 - progress);
  const color = isNext ? "#16A34A" : "#2563EB";

  return (
    <div className="relative w-36 h-36 mx-auto">
      {isNext && (
        <span className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
      )}
      <svg
        className="w-full h-full -rotate-90 relative"
        viewBox="0 0 120 120"
        style={isNext ? { animation: "spin 3s linear infinite" } : undefined}
      >
        <circle cx="60" cy="60" r={radius} fill="none" stroke={isNext ? "#F0FDF4" : "#EFF6FF"} strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isNext ? (
          <>
            <span className="text-lg font-bold text-green-700">You&apos;re Next!</span>
            <span className="text-[10px] text-green-600 mt-0.5">Get ready</span>
          </>
        ) : (
          <>
            <span className="text-2xl font-bold text-gray-900">{minutes}</span>
            <span className="text-xs text-gray-500">Minutes</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Estimated Wait</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function LiveQueueCard() {
  const { token } = useAuth();
  const [queue, setQueue] = useState<LiveQueueStatus | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const fetchStatus = () => {
      getLiveQueueStatus(token)
        .then((data) => { if (!cancelled) setQueue(data); })
        .catch(() => { if (!cancelled) setQueue({ has_live_queue: false }); });
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [token]);

  if (queue?.has_live_queue && queue.is_your_turn) {
    return (
      <div className="bg-green-600 text-white rounded-2xl p-5 shadow-sm flex items-center gap-3">
        <span className="text-2xl">🎉</span>
        <div>
          <p className="font-bold">It&apos;s Your Turn!</p>
          <p className="text-sm text-green-50">Please proceed to Dr. {queue.doctor_name}&apos;s room.</p>
        </div>
      </div>
    );
  }

  if (!queue || !queue.has_live_queue) {
    return (
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 opacity-50 grayscale select-none">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800">Your Queue Status</h2>
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-400">
            <Lock className="w-3 h-3" /> Inactive
          </span>
        </div>
        <div className="w-36 h-36 mx-auto rounded-full border-[10px] border-gray-100 flex items-center justify-center">
          <span className="text-xs text-gray-400 text-center px-4">No live queue right now</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Patients Ahead</p>
            <p className="text-lg font-bold text-gray-300">—</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Queue Number</p>
            <p className="text-lg font-bold text-gray-300">—</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          This activates automatically on the day of your confirmed appointment.
        </p>
        <div className="absolute inset-0 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800">Your Queue Status</h2>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Dr. {queue.doctor_name} • In-Clinic
        </span>
      </div>

      <WaitRing
        minutes={queue.estimated_wait_minutes ?? 0}
        patientsAhead={queue.patients_ahead ?? 0}
        isNext={(queue.patients_ahead ?? 0) === 0}
      />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
            <Users className="w-3 h-3" /> Patients Ahead
          </p>
          <p className="text-lg font-bold text-blue-700">{queue.patients_ahead}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
            <ListOrdered className="w-3 h-3" /> Queue Number
          </p>
          <p className="text-lg font-bold text-purple-700">
            #{String(queue.your_token).padStart(2, "0")}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
        <Radio className="w-3 h-3" /> Queue updates in real time
      </p>
    </div>
  );
}