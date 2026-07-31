"use client";

// src/app/admin/(dashboard)/doctors/page.tsx
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Power,
  PowerOff,
  BadgeCheck,
} from "lucide-react";
import SearchBar from "@/components/admin/SearchBar";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ActionMenu from "@/components/admin/ActionMenu";
import Pagination from "@/components/admin/Pagination";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastProvider";
import {
  getDoctors,
  approveDoctor,
  rejectDoctor,
  toggleDoctorStatus,
} from "@/lib/admin/services";
import { ApiError } from "@/lib/admin/api-client";
import type { ApiDoctor, ActionMenuItem } from "@/types/admin";

const PER_PAGE = 10;

type PendingAction = {
  type: "approve" | "reject" | "toggle";
  doctor: ApiDoctor;
} | null;

function doctorStatusLabel(doc: ApiDoctor): string {
  if (!doc.is_verified) return "pending";
  return doc.is_active ? "verified" : "inactive";
}

export default function DoctorsPage() {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState<ApiDoctor[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDoctors({
        search: search || undefined,
        page,
        per_page: PER_PAGE,
      });
      setDoctors(res.data);
      setTotalPages(res.meta?.last_page ?? 1);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load doctors.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    try {
      if (pendingAction.type === "approve") {
        await approveDoctor(pendingAction.doctor.id);
        showToast(`${pendingAction.doctor.name} approved.`);
      } else if (pendingAction.type === "reject") {
        await rejectDoctor(pendingAction.doctor.id);
        showToast(`${pendingAction.doctor.name} rejected.`);
      } else {
        await toggleDoctorStatus(pendingAction.doctor.id);
        showToast(`${pendingAction.doctor.name}'s status updated.`);
      }
      setPendingAction(null);
      load();
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Action failed.",
        "error",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const columns: DataTableColumn<ApiDoctor>[] = [
    {
      header: "Profile",
      accessor: (doc) => (
        <Link
          href={`/admin/doctors/${doc.id}`}
          className="flex items-center gap-3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doc.profile_image ?? "https://i.pravatar.cc/150"}
            alt={doc.name}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
              {doc.name}
            </p>
            <p className="truncate text-xs text-slate-400">
              {doc.qualification}
            </p>
          </div>
        </Link>
      ),
    },
    { header: "Specialization", accessor: (doc) => doc.specialization },
    { header: "Hospital", accessor: (doc) => doc.hospital_name },
    { header: "City", accessor: (doc) => doc.city },
    { header: "Experience", accessor: (doc) => `${doc.experience_years}+ yrs` },
    { header: "Fee", accessor: (doc) => `₹${doc.consultation_fee}` },
    {
      header: "Rating",
      accessor: (doc) =>
        doc.rating != null ? Number(doc.rating).toFixed(1) : "-",
    },
    {
      header: "Status",
      accessor: (doc) => <StatusBadge status={doctorStatusLabel(doc)} />,
    },
    {
      header: "Verified",
      accessor: (doc) =>
        doc.is_verified ? (
          <BadgeCheck className="h-4 w-4 text-green-600" />
        ) : (
          <span className="text-xs text-slate-300">—</span>
        ),
    },
    {
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      accessor: (doc) => {
        const items: ActionMenuItem[] = [
          {
            label: "View",
            icon: Eye,
            onClick: () => (window.location.href = `/admin/doctors/${doc.id}`),
          },
        ];
        if (!doc.is_verified) {
          items.push(
            {
              label: "Approve",
              icon: CheckCircle2,
              onClick: () => setPendingAction({ type: "approve", doctor: doc }),
            },
            {
              label: "Reject",
              icon: XCircle,
              onClick: () => setPendingAction({ type: "reject", doctor: doc }),
              danger: true,
            },
          );
        } else {
          items.push(
            doc.is_active
              ? {
                  label: "Deactivate",
                  icon: PowerOff,
                  onClick: () =>
                    setPendingAction({ type: "toggle", doctor: doc }),
                }
              : {
                  label: "Activate",
                  icon: Power,
                  onClick: () =>
                    setPendingAction({ type: "toggle", doctor: doc }),
                },
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
      <SearchBar
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder="Search by name, specialization, hospital..."
        className="max-w-xs"
      />

      <DataTable
        columns={columns}
        data={doctors}
        keyField={(doc) => String(doc.id)}
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle="No doctors found"
        emptyDescription="Try adjusting your search."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmModal
        open={pendingAction !== null}
        loading={actionLoading}
        variant={pendingAction?.type === "reject" ? "danger" : "default"}
        title={
          pendingAction?.type === "approve"
            ? `Approve ${pendingAction.doctor.name}?`
            : pendingAction?.type === "reject"
              ? `Reject ${pendingAction.doctor.name}?`
              : pendingAction
                ? `${pendingAction.doctor.is_active ? "Deactivate" : "Activate"} ${pendingAction.doctor.name}?`
                : ""
        }
        confirmLabel={
          pendingAction?.type === "approve"
            ? "Approve"
            : pendingAction?.type === "reject"
              ? "Reject"
              : pendingAction?.doctor.is_active
                ? "Deactivate"
                : "Activate"
        }
        onConfirm={runAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
