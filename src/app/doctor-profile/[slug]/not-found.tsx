// src/app/doctor-profile/[slug]/not-found.tsx
import Link from "next/link";
import { UserX } from "lucide-react";

export default function DoctorNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <UserX className="h-7 w-7" />
      </span>
      <h2 className="text-lg font-semibold text-slate-900">
        Doctor not found
      </h2>
      <p className="mt-1.5 text-sm text-slate-500">
        This doctor profile doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/doctor-listing"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
      >
        Back to Doctor Listing
      </Link>
    </div>
  );
}
