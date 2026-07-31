"use client";

// src/app/admin/page.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/admin/auth";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(isAuthenticated() ? "/admin/dashboard" : "/admin/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" />
    </div>
  );
}
