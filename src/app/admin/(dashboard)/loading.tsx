// src/app/admin/(dashboard)/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm" />
    </div>
  );
}
