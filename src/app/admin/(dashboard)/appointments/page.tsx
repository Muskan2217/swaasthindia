"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, CheckCircle2, XCircle, CalendarCheck, X } from "lucide-react";
import SearchBar from "@/components/admin/SearchBar";
import FilterDropdown from "@/components/admin/FilterDropdown";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ActionMenu from "@/components/admin/ActionMenu";
import Pagination from "@/components/admin/Pagination";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastProvider";
import { getAppointments, updateAppointmentStatus } from "@/lib/admin/services";
import { ApiError } from "@/lib/admin/api-client";
import type { ApiAppointment, AppointmentStatus, ActionMenuItem } from "@/types/admin";

const PER_PAGE = 10;
const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

type PendingChange = { appointment: ApiAppointment; nextStatus: AppointmentStatus } | null;

export default function AppointmentsPage() {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingChange, setPendingChange] = useState<PendingChange>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewing, setViewing] = useState<ApiAppointment | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAppointments({
        search: search || undefined,
        status: (status || undefined) as AppointmentStatus | undefined,
        date: date || undefined,
        page,
        per_page: PER_PAGE,
      });
      setAppointments(res.data);
      setTotalPages(res.meta?.last_page ?? 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [search, status, date, page]);

  useEffect(() => {
    load();
  }, [load]);

  const applyChange = async () => {
    if (!pendingChange) return;
    setActionLoading(true);
    try {
      await updateAppointmentStatus(pendingChange.appointment.id, pendingChange.nextStatus);
      showToast("Appointment status updated.");
      setPendingChange(null);
      load();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to update status.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const columns: DataTableColumn<ApiAppointment>[] = [
    { header: "Patient", accessor: (a) => <span className="font-medium text-slate-800">{a.patient_name}</span> },
    { header: "Doctor", accessor: (a) => a.doctor.name },
    { header: "Date", accessor: (a) => a.appointment_date ?? "—" },
    { header: "Time", accessor: (a) => a.appointment_time },
    { header: "Status", accessor: (a) => <StatusBadge status={a.status} /> },
    {
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      accessor: (a) => {
        const items: ActionMenuItem[] = [{ label: "View", icon: Eye, onClick: () => setViewing(a) }];
        if (a.status === "pending") {
          items.push(
            { label: "Confirm", icon: CheckCircle2, onClick: () => setPendingChange({ appointment: a, nextStatus: "confirmed" }) },
            { label: "Cancel", icon: XCircle, onClick: () => setPendingChange({ appointment: a, nextStatus: "cancelled" }), danger: true }
          );
        } else if (a.status === "confirmed") {
          items.push(
            { label: "Complete", icon: CalendarCheck, onClick: () => setPendingChange({ appointment: a, nextStatus: "completed" }) },
            { label: "Cancel", icon: XCircle, onClick: () => setPendingChange({ appointment: a, nextStatus: "cancelled" }), danger: true }
          );
        }
        return (
          <div className="flex justify-end">
            <ActionMenu items={items} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by patient or doctor..."
          className="sm:max-w-xs"
        />
        <FilterDropdown
          value={status}
          options={STATUS_OPTIONS}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          className="sm:w-48"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <DataTable
        columns={columns}
        data={appointments}
        keyField={(a) => String(a.id)}
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle="No appointments found"
        emptyDescription="Try adjusting your search or filters."
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmModal
        open={pendingChange !== null}
        loading={actionLoading}
        variant={pendingChange?.nextStatus === "cancelled" ? "danger" : "default"}
        title={pendingChange ? `Mark appointment as ${pendingChange.nextStatus}?` : ""}
        description={
          pendingChange
            ? `${pendingChange.appointment.patient_name} with ${pendingChange.appointment.doctor.name} — ${pendingChange.appointment.appointment_date} at ${pendingChange.appointment.appointment_time}`
            : undefined
        }
        confirmLabel={pendingChange?.nextStatus ?? "Confirm"}
        onConfirm={applyChange}
        onCancel={() => setPendingChange(null)}
      />

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Appointment Details</h3>
              <button type="button" onClick={() => setViewing(null)} aria-label="Close" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p><span className="font-medium text-slate-800">Patient:</span> {viewing.patient_name}</p>
              <p><span className="font-medium text-slate-800">Phone:</span> {viewing.patient_phone}</p>
              {viewing.patient_email && <p><span className="font-medium text-slate-800">Email:</span> {viewing.patient_email}</p>}
              <p><span className="font-medium text-slate-800">Doctor:</span> {viewing.doctor.name}</p>
              <p><span className="font-medium text-slate-800">Date & Time:</span> {viewing.appointment_date} at {viewing.appointment_time}</p>
              <p className="flex items-center gap-2"><span className="font-medium text-slate-800">Status:</span> <StatusBadge status={viewing.status} /></p>
              {viewing.notes && <p><span className="font-medium text-slate-800">Notes:</span> {viewing.notes}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
