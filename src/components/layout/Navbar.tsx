"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 ">
         <div className="flex items-center gap-2">
  {/* Hamburger */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="text-gray-600 hover:text-gray-900 p-1 flex-shrink-0"
    aria-label="Toggle menu"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={
          menuOpen
            ? "M6 18L18 6M6 6l12 12"
            : "M4 6h16M4 12h16M4 18h16"
        }
      />
    </svg>
  </button>

  {/* Logo */}
  <Link href="/" className="flex items-center gap-1 flex-shrink-0">
    <div className="w-9 h-9 relative">
      <Image
        src="/site-logo.png"
        alt="Swasth India"
        width={140}
        height={140}
      />
    </div>

    <span className="text-lg font-bold text-text-primary leading-tight">
      Swasth India
    </span>
  </Link>
</div>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-xs items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
            <svg
              className="w-4 h-4 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400"
            />
          </div>

          {/* Nav Buttons */}
          <nav className="hidden md:flex items-center gap-2">
            <NavButton
              href="/appointments"
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                   stroke="#3864d5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              label="Appointments"
            />

            <NavButton
              href="/dashboard"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                   stroke="#3864d5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              }
              label="Dashboard"
            />

            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#0D1B3E] hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="#3864d5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Login / Sign up
            </Link>
          </nav>

          {/* Mobile Login */}
          <Link href="/login" className="md:hidden p-2 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="#3864d5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 pb-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2 mb-3">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none w-full"
              />
            </div>
            {[
              { href: "/appointments", label: "Appointments" },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/login", label: "Login / Sign up" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function NavButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#0D1B3E] hover:bg-gray-100 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
