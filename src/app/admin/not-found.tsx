// src/app/admin/not-found.tsx
import Link from "next/link";
import { SearchX } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <SearchX className="h-7 w-7" />
      </span>
      <h2 className="text-lg font-semibold text-[#0D1B3E]">Page not found</h2>
      <p className="mt-1.5 text-sm text-slate-500">This admin page doesn&apos;t exist.</p>
      <Link href="/admin/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700">
        Back to Dashboard
      </Link>
    </div>
  );
}
