// src/components/patient-dashboard/LiveQueueCard.tsx
//
// NOTE ON HEURISTICS (no backend changes made):
// - "queue not started yet" is inferred from existing fields (no explicit
//   appointment_time/queue_started field in the API yet).
// - "emergency/override" notice is inferred by watching this patient's own
//   position regress (was NEXT / 0 ahead, then reverts to waiting behind
//   someone). Best-effort proxy, not a guaranteed detection.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Users, ListOrdered, Radio, Lock, Clock3, AlertTriangle, Hourglass } from "lucide-react";
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

// ---------------------------------------------------------------------------
// sessionStorage persistence (survives page refresh)
// ---------------------------------------------------------------------------

const LIVE_QUEUE_STORAGE_KEY = "swaasth_live_queue_timer_v1";

interface StoredTimerState {
  remainingSeconds: number;
  estimatedWaitSeconds: number;
  lastServerRemaining: number | null;
  lastServerEstimatedWait: number | null;
  savedAt: number;
}

function loadStoredTimerState(): StoredTimerState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(LIVE_QUEUE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredTimerState;
    const elapsed = Math.floor((Date.now() - parsed.savedAt) / 1000);
    if (!Number.isFinite(elapsed) || elapsed < 0 || elapsed > 600) return null;
    return {
      ...parsed,
      remainingSeconds: Math.max(0, parsed.remainingSeconds - elapsed),
      estimatedWaitSeconds: Math.max(0, parsed.estimatedWaitSeconds - elapsed),
    };
  } catch {
    return null;
  }
}

function saveStoredTimerStateSync(state: Omit<StoredTimerState, "savedAt">) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      LIVE_QUEUE_STORAGE_KEY,
      JSON.stringify({ ...state, savedAt: Date.now() }),
    );
  } catch {
    // ignore (e.g. private browsing) — timer still works, just won't survive a refresh
  }
}

// ---------------------------------------------------------------------------
// Wait ring
// ---------------------------------------------------------------------------

function WaitRing({
  seconds,
  patientsAhead,
  status,
  timeExceeded,
}: {
  seconds: number;
  patientsAhead: number;
  status?: LiveQueueStatus["queue_status"];
  timeExceeded: boolean;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  const isNext = status === "NEXT";
  const isInRoom = status === "IN_ROOM";
  const isTimeReached = status === "TIME_REACHED";
  const isCompleted = status === "COMPLETED";
  // Waiting/Next but past the estimated wait time — still stuck waiting
  const isWaitBlown = !isInRoom && !isTimeReached && !isCompleted && timeExceeded;

  const progress =
    isNext || isCompleted
      ? 1
      : isInRoom || isTimeReached
        ? Math.min(seconds / 600, 1)
        : Math.max(0.08, Math.min(patientsAhead / 8, 1));

  const offset = circumference * (1 - progress);

  // Colour rules:
  // - IN_ROOM -> purple (unchanged)
  // - TIME_REACHED (in-room, time up) -> red (unchanged)
  // - COMPLETED -> gray (unchanged)
  // - WAITING/NEXT, still within estimated time -> GREEN
  // - WAITING/NEXT, estimated time already elapsed -> RED
  const ringColor = isTimeReached
    ? "#DC2626"
    : isInRoom
      ? "#7C3AED"
      : isCompleted
        ? "#6B7280"
        : isWaitBlown
          ? "#DC2626"
          : "#16A34A";

  const trackColor = isTimeReached
    ? "#FEF2F2"
    : isInRoom
      ? "#F5F3FF"
      : isCompleted
        ? "#F3F4F6"
        : isWaitBlown
          ? "#FEF2F2"
          : "#F0FDF4";

  return (
    <div className="relative w-36 h-36 mx-auto">
      {isNext && !isWaitBlown && (
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
          stroke={trackColor}
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
            <span className={`text-lg font-bold ${isWaitBlown ? "text-red-700" : "text-green-700"}`}>
              You&apos;re Next!
            </span>
            <span className={`text-[10px] mt-0.5 ${isWaitBlown ? "text-red-600" : "text-green-600"}`}>
              {isWaitBlown ? "Still waiting" : "Get ready"}
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
            <span className={`text-2xl font-bold ${isWaitBlown ? "text-red-700" : "text-gray-900"}`}>
              {formatTime(seconds)}
            </span>
            <span className={`text-xs ${isWaitBlown ? "text-red-600" : "text-gray-500"}`}>
              {isWaitBlown ? "Time exceeded" : "Estimated Wait"}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">
              {isWaitBlown ? "Still waiting" : "Live estimate"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function LiveQueueCard() {
  const { token } = useAuth();

  const [queue, setQueue] = useState<LiveQueueStatus | null>(null);

  const [remainingSeconds, setRemainingSeconds] = useState(
    () => loadStoredTimerState()?.remainingSeconds ?? 0,
  );
  const [estimatedWaitSeconds, setEstimatedWaitSeconds] = useState(
    () => loadStoredTimerState()?.estimatedWaitSeconds ?? 0,
  );

  // Mirror of the two state values above, kept in sync on every tick so
  // the unload/visibility handlers can read the *latest* number
  // synchronously without waiting for a React re-render + effect cycle.
  const remainingSecondsRef = useRef(remainingSeconds);
  const estimatedWaitSecondsRef = useRef(estimatedWaitSeconds);

  const lastServerRemainingRef = useRef<number | null>(
    loadStoredTimerState()?.lastServerRemaining ?? null,
  );
  const lastServerEstimatedWaitRef = useRef<number | null>(
    loadStoredTimerState()?.lastServerEstimatedWait ?? null,
  );

  // --- emergency/override detection ---------------------------------------
  const prevPatientsAheadRef = useRef<number | null>(null);
  const prevQueueStatusRef = useRef<LiveQueueStatus["queue_status"] | null>(null);
  const [showOverrideNotice, setShowOverrideNotice] = useState(false);
  const overrideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const data = await getLiveQueueStatus(token);

        if (cancelled) return;

        const prevAhead = prevPatientsAheadRef.current;
        const prevStatus = prevQueueStatusRef.current;

        if (
          data.has_live_queue &&
          prevAhead !== null &&
          prevStatus !== null &&
          typeof data.patients_ahead === "number"
        ) {
          const wasAboutToBeSeen = prevStatus === "NEXT" || prevAhead === 0;
          const regressed =
            data.queue_status === "WAITING" &&
            (data.patients_ahead ?? 0) > 0 &&
            wasAboutToBeSeen;

          if (regressed) {
            setShowOverrideNotice(true);
            if (overrideTimeoutRef.current) {
              clearTimeout(overrideTimeoutRef.current);
            }
            overrideTimeoutRef.current = setTimeout(() => {
              setShowOverrideNotice(false);
            }, 45000);
          }
        }

        prevPatientsAheadRef.current = data.patients_ahead ?? null;
        prevQueueStatusRef.current = data.queue_status ?? null;

        setQueue(data);

        if (typeof data.remaining_consultation_seconds === "number") {
          const serverValue = Math.max(
            0,
            Math.floor(data.remaining_consultation_seconds),
          );

          const previousServerValue = lastServerRemainingRef.current;

          if (
            previousServerValue === null ||
            serverValue !== previousServerValue
          ) {
            setRemainingSeconds(serverValue);
            remainingSecondsRef.current = serverValue;
            lastServerRemainingRef.current = serverValue;
          }
        } else {
          lastServerRemainingRef.current = null;
          setRemainingSeconds(0);
          remainingSecondsRef.current = 0;
        }

        if (typeof data.estimated_wait_seconds === "number") {
          const serverValue = Math.max(
            0,
            Math.floor(data.estimated_wait_seconds),
          );

          const previousServerValue = lastServerEstimatedWaitRef.current;

          if (
            previousServerValue === null ||
            serverValue !== previousServerValue
          ) {
            setEstimatedWaitSeconds(serverValue);
            estimatedWaitSecondsRef.current = serverValue;
            lastServerEstimatedWaitRef.current = serverValue;
          }
        } else {
          lastServerEstimatedWaitRef.current = null;
          setEstimatedWaitSeconds(0);
          estimatedWaitSecondsRef.current = 0;
        }
      } catch {
        if (!cancelled) {
          setQueue({ has_live_queue: false });
          setRemainingSeconds(0);
          setEstimatedWaitSeconds(0);
          remainingSecondsRef.current = 0;
          estimatedWaitSecondsRef.current = 0;

          lastServerRemainingRef.current = null;
          lastServerEstimatedWaitRef.current = null;
        }
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      if (overrideTimeoutRef.current) {
        clearTimeout(overrideTimeoutRef.current);
      }
    };
  }, [token]);

  // Local 1-second tick — updates state AND writes to sessionStorage in the
  // same callback (not a separate effect), so the save can never lag
  // behind a fast reload.
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((current) => {
        const next = Math.max(0, current - 1);
        remainingSecondsRef.current = next;
        return next;
      });
      setEstimatedWaitSeconds((current) => {
        const next = Math.max(0, current - 1);
        estimatedWaitSecondsRef.current = next;
        return next;
      });

      saveStoredTimerStateSync({
        remainingSeconds: remainingSecondsRef.current,
        estimatedWaitSeconds: estimatedWaitSecondsRef.current,
        lastServerRemaining: lastServerRemainingRef.current,
        lastServerEstimatedWait: lastServerEstimatedWaitRef.current,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Belt-and-braces: force a synchronous save right before the page
  // actually unloads/reloads/goes to background, so we never lose the
  // last second or two of ticking that a normal effect might miss.
  useEffect(() => {
    const forceSave = () => {
      saveStoredTimerStateSync({
        remainingSeconds: remainingSecondsRef.current,
        estimatedWaitSeconds: estimatedWaitSecondsRef.current,
        lastServerRemaining: lastServerRemainingRef.current,
        lastServerEstimatedWait: lastServerEstimatedWaitRef.current,
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") forceSave();
    };

    window.addEventListener("beforeunload", forceSave);
    window.addEventListener("pagehide", forceSave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", forceSave);
      window.removeEventListener("pagehide", forceSave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const liveStatus = useMemo(() => {
    if (!queue) return undefined;

    if (queue.queue_status === "IN_ROOM" && remainingSeconds <= 0) {
      return "TIME_REACHED";
    }

    return queue.queue_status;
  }, [queue, remainingSeconds]);

  const queueNotYetStarted =
    !!queue &&
    queue.has_live_queue &&
    liveStatus === "WAITING" &&
    (queue.patients_ahead ?? 0) === 0 &&
    !queue.current_serving_token;

  const waitingTimeExceeded =
    !!queue &&
    queue.has_live_queue &&
    (liveStatus === "WAITING" || liveStatus === "NEXT") &&
    !queueNotYetStarted &&
    estimatedWaitSeconds <= 0;

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
  const isWaitBlown = !isInRoom && !isTimeReached && !isCompleted && waitingTimeExceeded;

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
                  : isWaitBlown
                    ? "text-red-600"
                    : "text-green-600"
          }`}
        >
          <span className="relative flex h-2 w-2">
            {!isCompleted && (
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isTimeReached || isWaitBlown
                    ? "bg-red-400"
                    : isInRoom
                      ? "bg-purple-400"
                      : "bg-green-400"
                }`}
              />
            )}

            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isTimeReached || isWaitBlown
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

      {queueNotYetStarted ? (
        <div className="py-6 flex flex-col items-center text-center">
          <Hourglass className="w-9 h-9 text-blue-400 mb-2" />
          <p className="text-sm font-bold text-gray-800">
            Waiting for doctor to start the queue
          </p>
          <p className="text-xs text-gray-500 mt-1 max-w-[220px]">
            Your appointment time hasn&apos;t started yet, or the doctor
            hasn&apos;t begun today&apos;s queue. This will update
            automatically.
          </p>
        </div>
      ) : (
        <WaitRing
          seconds={
            isInRoom || isTimeReached ? remainingSeconds : displayWaitSeconds
          }
          patientsAhead={patientsAhead}
          status={status}
          timeExceeded={waitingTimeExceeded}
        />
      )}

      {showOverrideNotice && !isInRoom && !isCompleted && (
        <div className="mt-4 rounded-xl bg-orange-50 border border-orange-200 p-3 flex items-start gap-2 text-left">
          <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
          <p className="text-xs text-orange-700">
            Due to an emergency or priority consultation, another patient
            has been called in. Your turn has been slightly delayed,
            please continue to wait.
          </p>
        </div>
      )}

      {!queueNotYetStarted && (
        <div
          className={`mt-4 rounded-xl p-3 text-center ${
            isInRoom
              ? "bg-purple-50"
              : isTimeReached
                ? "bg-red-50"
                : isCompleted
                  ? "bg-gray-50"
                  : isWaitBlown
                    ? "bg-red-50"
                    : "bg-green-50"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              isInRoom
                ? "text-purple-700"
                : isTimeReached
                  ? "text-red-700"
                  : isCompleted
                    ? "text-gray-600"
                    : isWaitBlown
                      ? "text-red-700"
                      : "text-green-700"
            }`}
          >
            {getStatusLabel(status)}
          </p>

          {isInRoom && (
            <p className="text-xs text-purple-600 mt-1">
              Please stay in the consultation room.
            </p>
          )}

          {isNext && !isWaitBlown && (
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
      )}

      {waitingTimeExceeded && (
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-center">
          <p className="text-sm font-semibold text-amber-800">
            Your waiting time has been completed. Please wait for the
            doctor, the doctor seems busy.
          </p>
        </div>
      )}

      {!queueNotYetStarted && (
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
      )}

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