// src/app/signup/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import RoleCard from "@/components/auth/RoleCard";
import { ROLE_OPTIONS } from "@/lib/auth-dummy-data";

export const metadata: Metadata = {
  title: "Create Account – Swasth India",
  description: "Choose your account type to get started with Swasth India.",
};

export default function SignupPage() {
  return (
    <AuthLayout maxWidth="xl">
      <div className="flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center max-w-md">
          {/* Brand mark */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <svg viewBox="0 0 36 36" fill="none" className="w-10 h-10">
              <path
                d="M18 31s-13-8.5-13-17A8 8 0 0118 8a8 8 0 0113 6c0 8.5-13 17-13 17z"
                fill="#E8192C"
                opacity="0.15"
              />
              <path
                d="M18 29s-11-7.5-11-15A7 7 0 0118 9a7 7 0 0111 5c0 7.5-11 15-11 15z"
                fill="none"
                stroke="#E8192C"
                strokeWidth="1.5"
              />
              <path
                d="M15 17h6M18 14v6"
                stroke="#3864D5"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl font-extrabold text-[#0D1B3E]">
              Swasth <span className="text-[#E8192C]">India</span>
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0D1B3E] mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-base">
            Choose how you&apos;ll use Swasth India and we&apos;ll set up the right experience for you.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {ROLE_OPTIONS.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>

        {/* Back / login links */}
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#3864D5] transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <span className="text-gray-300">|</span>
          <p className="text-gray-500">
            Have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#3864D5] hover:text-[#2450B0] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}