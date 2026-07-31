"use client";

// src/app/admin/(dashboard)/layout.tsx
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ToastProvider from "@/components/admin/ToastProvider";
import { isAuthenticated } from "@/lib/admin/auth";

const PAGE_TITLES: { match: (path: string) => boolean; title: string }[] = [
  { match: (p) => p === "/admin/dashboard", title: "Dashboard" },
  { match: (p) => p === "/admin/doctors", title: "Doctors" },
  { match: (p) => p.startsWith("/admin/doctors/"), title: "Doctor Details" },
  { match: (p) => p === "/admin/patients", title: "Patients" },
  { match: (p) => p === "/admin/appointments", title: "Appointments" },
  { match: (p) => p === "/admin/activities", title: "Recent Activities" },
];

function getPageTitle(pathname: string): string {
  return PAGE_TITLES.find((entry) => entry.match(pathname))?.title ?? "Admin";
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminNavbar onMenuClick={() => setSidebarOpen(true)} pageTitle={getPageTitle(pathname)} />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
