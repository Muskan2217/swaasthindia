"use client";

// src/app/admin/(dashboard)/doctors/[id]/page.tsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Star,
  MapPin,
  Briefcase,
  Stethoscope,
  IndianRupee,
  Languages as LanguagesIcon,
  CheckCircle2,
  XCircle,
  Power,
  PowerOff,
  FileText,
  Download,
  Hash,
} from "lucide-react";
import ErrorState from "@/components/admin/ErrorState";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastProvider";
import { getDoctor, approveDoctor, rejectDoctor, toggleDoctorStatus } from "@/lib/admin/services";
import { ApiError } from "@/lib/admin/api-client";
import type { ApiDoctor } from "@/types/admin";

type PendingAction = "approve" | "reject" | "toggle" | null;

const DOCUMENT_LABELS: Record<keyof ApiDoctor["documents"], string> = {
  registration_certificate: "Medical Registration Certificate",
  degree_certificate: "Degree Certificate",
  identity_proof: "Identity Proof",
};

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [doctor, setDoctor] = useState<ApiDoctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDoctor(id);
      setDoctor(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load doctor.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async () => {
    if (!pendingAction || !doctor) return;
    setActionLoading(true);
    try {
      let updated: ApiDoctor;
      if (pendingAction === "approve") updated = await approveDoctor(doctor.id);
      else if (pendingAction === "reject") updated = await rejectDoctor(doctor.id);
      else updated = await toggleDoctorStatus(doctor.id);

      setDoctor(updated);
      showToast("Doctor updated successfully.");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Action failed.", "error");
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  };

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm" />;
  }

  if (error || !doctor) {
    return <ErrorState message={error ?? "Doctor not found."} onRetry={load} />;
  }

  const statusLabel = !doctor.is_verified ? "pending" : doctor.is_active ? "verified" : "inactive";

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.push("/admin/doctors")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Doctors
      </button>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doctor.profile_image ?? "https://i.pravatar.cc/300"}
            alt={doctor.name}
            className="h-28 w-28 shrink-0 rounded-2xl object-cover ring-1 ring-slate-100"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-[#0D1B3E] sm:text-2xl">{doctor.name}</h1>
              {doctor.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
              <StatusBadge status={statusLabel} />
            </div>

            <p className="mt-1 text-sm text-slate-500">{doctor.qualification}</p>

            {doctor.registration_number && (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                <Hash className="h-3 w-3" />
                Reg. No: {doctor.registration_number}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 text-blue-500" />
                {doctor.specialization}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-blue-500" />
                {doctor.experience_years}+ Years Experience
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-500" />
                {doctor.hospital_name}
                {doctor.city ? `, ${doctor.city}` : ""}
                {doctor.state ? `, ${doctor.state}` : ""}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-slate-800">{doctor.rating.toFixed(1)}</span>
                <span className="text-slate-400">({doctor.total_reviews})</span>
              </span>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-xl bg-blue-50 p-4 text-center sm:w-40">
            {doctor.consultation_fee !== null && doctor.consultation_fee !== undefined ? (
              <p className="flex items-center justify-center gap-1 text-2xl font-semibold text-[#0D1B3E]">
                <IndianRupee className="h-5 w-5" />
                {doctor.consultation_fee}
              </p>
            ) : (
              <p className="text-base font-medium text-slate-400">Not Added Yet</p>
            )}
            <p className="mt-1 text-xs text-slate-500">Consultation Fee</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-2.5 border-t border-slate-100 pt-5">
          {!doctor.is_verified ? (
            <>
              <button
                type="button"
                onClick={() => setPendingAction("approve")}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </button>
              <button
                type="button"
                onClick={() => setPendingAction("reject")}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setPendingAction("toggle")}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {doctor.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              {doctor.is_active ? "Deactivate" : "Activate"}
            </button>
          )}
        </div>
      </div>

      {/* Documents — verification files uploaded at signup */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0D1B3E]">
          <FileText className="h-4 w-4 text-blue-500" />
          Verification Documents
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(Object.keys(DOCUMENT_LABELS) as Array<keyof ApiDoctor["documents"]>).map((key) => {
            const url = doctor.documents?.[key] ?? null;
            return (
              <div
                key={key}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-sm font-medium text-slate-700">{DOCUMENT_LABELS[key]}</p>
                {url ? (
                  <div className="flex gap-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-600 ring-1 ring-blue-200 transition hover:bg-blue-50"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Preview
                    </a>
                    <a
                      href={url}
                      download
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs italic text-slate-400">Document not uploaded</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {doctor.about && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-2 text-sm font-semibold text-[#0D1B3E]">About</h2>
          <p className="text-sm leading-relaxed text-slate-600">{doctor.about}</p>
        </div>
      )}

      {doctor.languages && doctor.languages.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0D1B3E]">
            <LanguagesIcon className="h-4 w-4 text-blue-500" />
            Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {doctor.languages.map((lang) => (
              <span key={lang} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {doctor.availability && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-2 text-sm font-semibold text-[#0D1B3E]">Availability</h2>
          <p className="text-sm text-slate-600">
            {doctor.availability}
            {doctor.next_slot && <> — Next slot: <span className="font-medium text-blue-600">{doctor.next_slot}</span></>}
          </p>
        </div>
      )}

      <ConfirmModal
        open={pendingAction !== null}
        loading={actionLoading}
        variant={pendingAction === "reject" ? "danger" : "default"}
        title={
          pendingAction === "approve"
            ? `Approve ${doctor.name}?`
            : pendingAction === "reject"
              ? `Reject ${doctor.name}?`
              : `${doctor.is_active ? "Deactivate" : "Activate"} ${doctor.name}?`
        }
        confirmLabel={pendingAction === "approve" ? "Approve" : pendingAction === "reject" ? "Reject" : doctor.is_active ? "Deactivate" : "Activate"}
        onConfirm={runAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}