// src/components/auth/PendingApprovalCard.tsx
import Link from "next/link";
import { ShieldCheck, Clock, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const STEPS = [
  { label: "Profile Submitted",       done: true  },
  { label: "Credentials Under Review", done: false },
  { label: "Account Activation",       done: false },
];

export default function PendingApprovalCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden max-w-lg mx-auto w-full">

      {/* Top banner */}
      <div className="bg-gradient-to-br from-[#3864D5] to-[#1A3FA4] px-8 py-10 flex flex-col items-center text-center text-white">
        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
          <ShieldCheck size={40} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">Verification Under Review</h1>
        <p className="text-sm text-white/85 leading-relaxed max-w-sm">
          Your profile has been submitted successfully. Our team will verify your
          medical credentials and activate your account within 1–2 working days.
        </p>
        {/* Status pill */}
        <div className="mt-5 inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5">
          <Clock size={13} className="text-yellow-300" />
          <span className="text-xs font-bold text-yellow-200 tracking-wider uppercase">
            Pending Approval
          </span>
        </div>
      </div>

      {/* Progress steps */}
      <div className="px-8 py-6 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          Verification Progress
        </p>
        <ol className="relative space-y-5 pl-6 border-l-2 border-gray-100">
          {STEPS.map((step, i) => (
            <li key={i} className="relative">
              <div
                className={`absolute -left-[25px] w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  step.done
                    ? "bg-[#3864D5] border-[#3864D5]"
                    : "bg-white border-gray-300"
                }`}
              >
                {step.done && (
                  <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 10 10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2.5 2.5L8 3"/>
                  </svg>
                )}
              </div>
              <p
                className={`text-sm font-semibold ${
                  step.done ? "text-[#3864D5]" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Info boxes */}
      <div className="px-8 py-6 space-y-3">
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3.5">
          <Mail size={16} className="text-[#3864D5] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 font-medium">
            You will receive an email notification once your account is approved.
          </p>
        </div>

        <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-2xl px-4 py-3.5">
          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 font-medium">
            Ensure your registration number and degree certificate are valid to avoid delays.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 pb-8 flex flex-col gap-3">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 bg-[#3864D5] hover:bg-[#2450B0] text-white font-bold text-sm py-3.5 rounded-[14px] transition-all shadow-md shadow-blue-200"
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>
        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 border-2 border-[#3864D5]/25 text-[#3864D5] font-semibold text-sm py-3 rounded-[14px] hover:bg-[#EEF2FF] transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}