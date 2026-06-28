// src/app/signup/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import RoleCard from "@/components/auth/RoleCard";
import { ROLE_OPTIONS } from "@/lib/auth-dummy-data";

export const metadata: Metadata = {
  title: "Create Account – Swaasth India",
  description: "Choose your account type to get started with Swaasth India.",
};

export default function SignupPage() {
  return (
    <AuthLayout maxWidth="xl">
      <div className="flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center max-w-md">
          {/* Brand mark */}
          <div className="flex items-center justify-center gap-2 mb-5">
          <Image
                      src="/site-logo.png"
                      alt="Swaasth India"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
            <span className="text-2xl font-extrabold text-[#0D1B3E]">
              Swaasth <span className="text-[#E8192C]">India</span>
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0D1B3E] mb-2">
            Create Your Account 
          </h1>
          <p className="text-gray-500 text-base">
            Choose how you&apos;ll use Swaasth India and we&apos;ll set up the
            right experience for you.
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
