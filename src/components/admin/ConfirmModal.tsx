// src/components/admin/ConfirmModal.tsx
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;
  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <span className={`flex h-11 w-11 items-center justify-center rounded-full ${isDanger ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}>
            <AlertTriangle className="h-5 w-5" />
          </span>
          <button type="button" onClick={onCancel} aria-label="Close" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-1.5 text-sm text-slate-500">{description}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} disabled={loading} className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 ${
              isDanger ? "bg-red-500 shadow-red-100 hover:bg-red-600" : "bg-[#2563EB] shadow-blue-200 hover:bg-blue-700"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
