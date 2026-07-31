"use client";

// src/app/admin/(dashboard)/patients/page.tsx
import { useEffect, useState, useCallback } from "react";
import { Eye, X, Mail, Phone, CalendarCheck } from "lucide-react";
import SearchBar from "@/components/admin/SearchBar";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import ActionMenu from "@/components/admin/ActionMenu";
import Pagination from "@/components/admin/Pagination";
import { getPatients } from "@/lib/admin/services";
import { ApiError } from "@/lib/admin/api-client";
import type { ApiPatient } from "@/types/admin";

const PER_PAGE = 10;

export default function PatientsPage() {
  const [patients, setPatients] = useState<ApiPatient[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<ApiPatient | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPatients({ search: search || undefined, page, per_page: PER_PAGE });
      setPatients(res.data);
      setTotalPages(res.meta?.last_page ?? 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load patients.");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const columns: DataTableColumn<ApiPatient>[] = [
    {
      header: "Patient",
      accessor: (p) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800">{p.name}</p>
          <p className="truncate text-xs text-slate-400">{p.email}</p>
        </div>
      ),
    },
    { header: "Phone", accessor: (p) => p.phone ?? "—" },
    { header: "Appointments", accessor: (p) => p.appointments_count ?? 0 },
    { header: "Registered", accessor: (p) => (p.created_at ? new Date(p.created_at).toLocaleDateString() : "—") },
    {
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      accessor: (p) => (
        <div className="flex justify-end">
          <ActionMenu items={[{ label: "View Details", icon: Eye, onClick: () => setViewing(p) }]} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <SearchBar
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder="Search by name or email..."
        className="max-w-xs"
      />

      <DataTable
        columns={columns}
        data={patients}
        keyField={(p) => String(p.id)}
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle="No patients found"
        emptyDescription="Try adjusting your search."
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <p className="text-base font-semibold text-slate-900">{viewing.name}</p>
              <button type="button" onClick={() => setViewing(null)} aria-label="Close" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-sm text-slate-600">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-500" /> {viewing.email}
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-500" /> {viewing.phone ?? "Not provided"}
              </div>
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="h-4 w-4 text-blue-500" /> {viewing.appointments_count ?? 0} appointments
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
