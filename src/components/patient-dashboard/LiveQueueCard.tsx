// src/components/patient-dashboard/LiveQueueCard.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, ListOrdered, Radio, Lock, Clock3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getLiveQueueStatus,
  type LiveQueueStatus,
} from "@/lib/api";

function formatTime(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function getStatusLabel(status?: LiveQueueStatus["queue_status"]) {
  switch (status) {
    case "NEXT":
      return "You're Next";
    case "IN_ROOM":
      return "In Consultation";
    case "TIME_REACHED":
  return "Doctor Busy";
    case "COMPLETED":
      return "Completed";
    default:
      return "Waiting";
  }
}

function WaitRing({
  seconds,
  patientsAhead,
  status,
}: {
  seconds: number;
  patientsAhead: number;
  status?: LiveQueueStatus["queue_status"];
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  const isNext = status === "NEXT";
  const isInRoom = status === "IN_ROOM";
  const isTimeReached = status === "TIME_REACHED";
  const isCompleted = status === "COMPLETED";

  const progress =
    isNext || isCompleted
      ? 1
      : isInRoom || isTimeReached
        ? Math.min(seconds / 600, 1)
        : Math.max(0.08, Math.min(patientsAhead / 8, 1));

  const offset = circumference * (1 - progress);

  const ringColor = isTimeReached
    ? "#DC2626"
    : isInRoom
      ? "#7C3AED"
      : isNext
        ? "#16A34A"
        : "#2563EB";

  return (
    <div className="relative w-36 h-36 mx-auto">
      {isNext && (
        <span className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
      )}

      <svg
        className="w-full h-full -rotate-90 relative"
        viewBox="0 0 120 120"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={
            isTimeReached
              ? "#FEF2F2"
              : isInRoom
                ? "#F5F3FF"
                : isNext
                  ? "#F0FDF4"
                  : "#EFF6FF"
          }
          strokeWidth="10"
        />

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isNext ? (
          <>
            <span className="text-lg font-bold text-green-700">
              You&apos;re Next!
            </span>
            <span className="text-[10px] text-green-600 mt-0.5">
              Get ready
            </span>
          </>
        ) : isInRoom ? (
          <>
            <span className="text-2xl font-bold text-purple-700">
              {formatTime(seconds)}
            </span>
            <span className="text-xs text-purple-600">Consultation</span>
            <span className="text-[10px] text-gray-400 mt-0.5">
              Remaining
            </span>
          </>
        ) : isTimeReached ? (
          <>
            <Clock3 className="w-6 h-6 text-red-600 mb-1" />
            <span className="text-xs font-bold text-red-600 text-center px-2">
              Time Reached
            </span>
          </>
        ) : isCompleted ? (
          <>
            <span className="text-lg font-bold text-gray-700">
              Completed
            </span>
          </>
        ) : (
          <>
            <span className="text-2xl font-bold text-gray-900">
              {formatTime(seconds)}
            </span>
            <span className="text-xs text-gray-500">Estimated Wait</span>
            <span className="text-[10px] text-gray-400 mt-0.5">
              Live estimate
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default function LiveQueueCard() {
  const { token } = useAuth();

  const [queue, setQueue] = useState<LiveQueueStatus | null>(null);

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [estimatedWaitSeconds, setEstimatedWaitSeconds] = useState(0);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const data = await getLiveQueueStatus(token);

        if (cancelled) return;

        setQueue(data);
        setRemainingSeconds(
          Math.max(0, data.remaining_consultation_seconds ?? 0),
        );
        setEstimatedWaitSeconds(
          Math.max(0, data.estimated_wait_seconds ?? 0),
        );
      } catch {
        if (!cancelled) {
          setQueue({ has_live_queue: false });
          setRemainingSeconds(0);
          setEstimatedWaitSeconds(0);
        }
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
      setEstimatedWaitSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const liveStatus = useMemo(() => {
    if (!queue) return undefined;

    if (
      queue.queue_status === "IN_ROOM" &&
      remainingSeconds <= 0
    ) {
      return "TIME_REACHED";
    }

    return queue.queue_status;
  }, [queue, remainingSeconds]);

  if (!queue || !queue.has_live_queue) {
    return (
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 opacity-50 grayscale select-none">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800">
            Your Queue Status
          </h2>

          <span className="flex items-center gap-1 text-xs font-semibold text-gray-400">
            <Lock className="w-3 h-3" />
            Inactive
          </span>
        </div>

        <div className="w-36 h-36 mx-auto rounded-full border-[10px] border-gray-100 flex items-center justify-center">
          <span className="text-xs text-gray-400 text-center px-4">
            No live queue right now
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">
              Patients Ahead
            </p>
            <p className="text-lg font-bold text-gray-300">—</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">
              Queue Number
            </p>
            <p className="text-lg font-bold text-gray-300">—</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-3">
          This activates automatically on the day of your confirmed
          appointment.
        </p>
      </div>
    );
  }

  const patientsAhead = queue.patients_ahead ?? 0;
  const status = liveStatus ?? "WAITING";

  const isInRoom = status === "IN_ROOM";
  const isNext = status === "NEXT";
  const isTimeReached = status === "TIME_REACHED";
  const isCompleted = status === "COMPLETED";

  const displayWaitSeconds = Math.max(0, estimatedWaitSeconds);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800">
          Your Queue Status
        </h2>

        <span
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            isTimeReached
              ? "text-red-600"
              : isInRoom
                ? "text-purple-600"
                : isCompleted
                  ? "text-gray-500"
                  : "text-green-600"
          }`}
        >
          <span className="relative flex h-2 w-2">
            {!isCompleted && (
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isTimeReached
                    ? "bg-red-400"
                    : isInRoom
                      ? "bg-purple-400"
                      : "bg-green-400"
                }`}
              />
            )}

            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isTimeReached
                  ? "bg-red-500"
                  : isInRoom
                    ? "bg-purple-500"
                    : isCompleted
                      ? "bg-gray-400"
                      : "bg-green-500"
              }`}
            />
          </span>

          {queue.doctor_status === "IN_CONSULTATION"
            ? "Doctor • In Consultation"
            : queue.doctor_status === "TIME_REACHED"
              ? "Doctor • Time Reached"
              : `Dr. ${queue.doctor_name} • In-Clinic`}
        </span>
      </div>

      <WaitRing
        seconds={
          isInRoom || isTimeReached
            ? remainingSeconds
            : displayWaitSeconds
        }
        patientsAhead={patientsAhead}
        status={status}
      />

      <div
        className={`mt-4 rounded-xl p-3 text-center ${
          isNext
            ? "bg-green-50"
            : isInRoom
              ? "bg-purple-50"
              : isTimeReached
                ? "bg-red-50"
                : isCompleted
                  ? "bg-gray-50"
                  : "bg-blue-50"
        }`}
      >
        <p
          className={`text-sm font-bold ${
            isNext
              ? "text-green-700"
              : isInRoom
                ? "text-purple-700"
                : isTimeReached
                  ? "text-red-700"
                  : isCompleted
                    ? "text-gray-600"
                    : "text-blue-700"
          }`}
        >
          {getStatusLabel(status)}
        </p>

        {isInRoom && (
          <p className="text-xs text-purple-600 mt-1">
            Please stay in the consultation room.
          </p>
        )}

        {isNext && (
          <p className="text-xs text-green-600 mt-1">
            Please get ready. You will be called next.
          </p>
        )}

        {isTimeReached && (
          <p className="text-xs text-red-600 mt-1">
            Consultation time has been reached. Please wait for the
            doctor&apos;s action.
          </p>
        )}

        {isCompleted && (
          <p className="text-xs text-gray-500 mt-1">
            Your consultation has been completed.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
            <Users className="w-3 h-3" />
            Patients Ahead
          </p>

          <p className="text-lg font-bold text-blue-700">
            {patientsAhead}
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
            <ListOrdered className="w-3 h-3" />
            Queue Number
          </p>

          <p className="text-lg font-bold text-purple-700">
            #{String(queue.your_token ?? 0).padStart(2, "0")}
          </p>
        </div>
      </div>

      {queue.current_serving_token !== undefined &&
        queue.current_serving_token > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">
                Current Token
              </p>

              <p className="text-base font-bold text-gray-700">
                #{String(queue.current_serving_token).padStart(2, "0")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">
                Estimated Wait
              </p>

              <p className="text-base font-bold text-gray-700">
                {formatTime(displayWaitSeconds)}
              </p>
            </div>
          </div>
        )}

      {isInRoom && (
        <div className="mt-3 rounded-xl bg-purple-50 border border-purple-100 p-3 text-center">
          <p className="text-xs text-purple-600">
            Consultation remaining
          </p>

          <p className="text-xl font-bold text-purple-700 mt-1">
            {formatTime(remainingSeconds)}
          </p>
        </div>
      )}

      {isTimeReached && (
  <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-center">
    <p className="text-sm font-semibold text-amber-800">
      Seems doctor is busy, please wait for sometime.
    </p>
  </div>
)}

      {queue.current_patient_name && !isInRoom && !isCompleted && (
        <p className="text-xs text-gray-500 text-center mt-3">
          Currently with:{" "}
          <span className="font-semibold text-gray-700">
            {queue.current_patient_name}
          </span>
        </p>
      )}

      <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
        <Radio className="w-3 h-3" />
        Queue updates every 10 seconds
      </p>
    </div>
  );
}