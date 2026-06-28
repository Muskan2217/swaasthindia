// src/app/signup/patient/page.tsx
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import PatientSignupForm from "@/components/auth/PatientSignupForm";

export const metadata: Metadata = {
  title: "Patient Registration – Swaasth India",
  description: "Create your patient account to access healthcare services.",
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
          Patient Registration
        </h2>
        <p className="text-white/80 text-sm leading-relaxed mb-8">
          Join thousands of patients who trust Swaasth India for their
          healthcare needs.
        </p>

        <ul className="space-y-4">
          {[
            "Book appointments with verified doctors",
            "Receive digital prescriptions instantly",
            "Order medicines with home delivery",
            "Maintain your complete health record",
            "Get consultation from ₹50 only",
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

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        {[
          { value: "50K+", label: "Patients" },
          { value: "500+", label: "Doctors" },
          { value: "₹50", label: "Min. fee" },
          { value: "4.9★", label: "Avg rating" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white/10 rounded-2xl p-4 text-center"
          >
            <p className="text-xl font-extrabold text-white">{s.value}</p>
            <p className="text-xs text-white/70 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PatientSignupPage() {
  return (
    <AuthLayout leftPanel={<LeftPanel />} maxWidth="lg">
      <PatientSignupForm />
    </AuthLayout>
  );
}
