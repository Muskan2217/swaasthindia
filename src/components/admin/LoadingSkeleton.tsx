// src/components/admin/LoadingSkeleton.tsx

interface LoadingSkeletonProps {
  rows?: number;
}

export default function LoadingSkeleton({ rows = 5 }: LoadingSkeletonProps) {
  return (
    <div className="animate-pulse space-y-3 p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200" />
          <div className="h-3.5 flex-1 rounded bg-slate-200" />
          <div className="h-3.5 w-20 rounded bg-slate-100" />
          <div className="h-3.5 w-16 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
