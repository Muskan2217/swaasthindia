// src/app/doctor-profile/[slug]/loading.tsx
export default function DoctorProfileLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header card skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="h-28 w-28 shrink-0 rounded-2xl bg-slate-200 sm:h-32 sm:w-32" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-2/3 rounded bg-slate-200" />
            <div className="h-4 w-1/2 rounded bg-slate-200" />
            <div className="flex flex-wrap gap-3">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-4 w-20 rounded bg-slate-200" />
            </div>
            <div className="h-6 w-32 rounded-full bg-slate-200" />
          </div>
          <div className="h-20 w-full shrink-0 rounded-xl bg-slate-100 sm:w-44" />
        </div>
      </div>

      {/* Location card skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
        <div className="mt-2 h-4 w-1/3 rounded bg-slate-100" />
      </div>

      {/* About card skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-2/3 rounded bg-slate-100" />
        </div>
      </div>

      {/* Languages card skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="mt-4 flex gap-2">
          <div className="h-7 w-16 rounded-full bg-slate-100" />
          <div className="h-7 w-20 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
