"use client";

// src/components/admin/AdminNavbar.tsx
import { Menu } from "lucide-react";

interface AdminNavbarProps {
  onMenuClick: () => void;
  pageTitle: string;
}

export default function AdminNavbar({ onMenuClick, pageTitle }: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3.5 sm:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} aria-label="Open menu" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-[#0D1B3E]">{pageTitle}</h1>
      </div>
    </header>
  );
}
