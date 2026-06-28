// src/app/signup/doctor/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import DoctorSignupForm from "@/components/auth/DoctorSignupForm";

export const metadata: Metadata = {
  title: "Doctor Registration – Swaasth India",
  description: "Register as a verified doctor on Swaasth India.",
};

function LeftPanel() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to role selection
        </Link>

        <h2 className="text-3xl font-extrabold leading-tight mb-4">
          Doctor Registration
        </h2>
        <p className="text-white/80 text-sm leading-relaxed mb-8">
          Join our growing network of verified medical professionals and expand
          your practice.
        </p>

        <ul className="space-y-4">
          {[
            "Manage your patient queue digitally",
            "Issue digital prescriptions instantly",
            "Set your own schedule and availability",
            "Access a full clinical dashboard",
            "Reach patients across India",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  width="10"
                  height="10"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  viewBox="0 0 10 10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2 5l2.5 2.5L8 3"
                  />
                </svg>
              </div>
              <span className="text-sm text-white/85 font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Verification steps */}
      <div className="mt-8 bg-white/10 rounded-2xl p-5">
        <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">
          Verification Process
        </p>
        <ol className="space-y-3 relative pl-5 border-l border-white/20">
          {[
            { step: "Submit your registration", time: "Immediate" },
            { step: "Team reviews your credentials", time: "1–2 working days" },
            { step: "Account activated", time: "After approval" },
          ].map((s, i) => (
            <li key={i} className="relative">
              <div className="absolute -left-[23px] w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <p className="text-sm text-white font-semibold">{s.step}</p>
              <p className="text-xs text-white/60">{s.time}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function DoctorSignupPage() {
  return (
    // xl width to accommodate the long form comfortably
    <AuthLayout leftPanel={<LeftPanel />} maxWidth="xl">
      <div className="max-h-[85vh] overflow-y-auto pr-1 scrollbar-thin">
        <DoctorSignupForm />
      </div>
    </AuthLayout>
  );
}
