// src/components/admin/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const baseBtn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav className="flex items-center justify-between gap-3 px-1 py-3" aria-label="Pagination">
      <p className="hidden text-sm text-slate-500 sm:block">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <button type="button" className={baseBtn} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <span key={`e-${idx}`} className="inline-flex h-9 min-w-9 items-center justify-center text-sm text-slate-400">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={
                p === currentPage
                  ? "inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-semibold text-white shadow-sm shadow-blue-200"
                  : baseBtn
              }
            >
              {p}
            </button>
          )
        )}
        <button type="button" className={baseBtn} disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
