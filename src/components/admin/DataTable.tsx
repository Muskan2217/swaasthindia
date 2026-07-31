// src/components/admin/DataTable.tsx
import type { ReactNode } from "react";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";

export interface DataTableColumn<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyField: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyField,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search or filters.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : data.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className={`whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${col.headerClassName ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={keyField(row)}
                  className="border-b border-slate-50 transition-colors last:border-b-0 hover:bg-slate-50/70"
                >
                  {columns.map((col) => (
                    <td key={col.header} className={`px-5 py-3.5 align-middle text-slate-700 ${col.className ?? ""}`}>
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
