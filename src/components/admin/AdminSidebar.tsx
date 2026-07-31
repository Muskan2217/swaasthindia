"use client";

// src/components/admin/AdminSidebar.tsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Stethoscope, Users, CalendarCheck, Activity, LogOut, X } from "lucide-react";
import { clearAuthToken } from "@/lib/admin/auth";
import { logout as logoutRequest } from "@/lib/admin/services";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/admin/patients", label: "Patients", icon: Users },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/admin/activities", label: "Recent Activities", icon: Activity },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch {
      // even if the API call fails, clear local session so the user isn't stuck
    } finally {
      clearAuthToken();
      router.push("/admin/login");
    }
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-[#0D1B3E] transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            {/* Replace /public/images/logo.png with your logo — falls back gracefully if missing */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Swaasth India"
              className="h-9 w-9 rounded-lg object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-base font-semibold leading-tight text-white">
              Swaasth India
              <span className="block text-xs font-normal text-slate-400">Admin Panel</span>
            </span>
          </Link>
          <button type="button" onClick={onClose} aria-label="Close sidebar" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(pathname, item.href) ? "bg-[#2563EB] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
