"use client";

// src/app/doctor-profile/[slug]/error.tsx
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DoctorProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h2 className="text-lg font-semibold text-slate-900">
        Couldn&apos;t load this doctor&apos;s profile
      </h2>
      <p className="mt-1.5 text-sm text-slate-500">
        Something went wrong while fetching this profile. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
      >
        <RotateCcw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
