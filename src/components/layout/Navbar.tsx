"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/doctor-profile", label: "Doctors" },
    { href: "/patient-dashboard", label: "Patient Dashboard" },
    { href: "/doctor-dashboard", label: "Doctor Dashboard" },
    // { href: "/appointments", label: "Appointments" },
    { href: "/login", label: "Login / Sign up" },
  ];

  return (
    <>
      {/* Click Outside Backdrop: Jab menu open hoga tabhi screen pe active hoga */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setMenuOpen(false)} 
        />
      )}

      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Main Navbar Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Hamburger Menu Button & Logo */}
            <div className="flex items-center gap-2">
              {/* Hamburger Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-600 hover:text-gray-900 p-1 flex-shrink-0 relative z-50"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6 transition-transform duration-300"
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
                <div className="w-9 h-9 relative flex items-center justify-center">
                  <Image
                    src="/site-logo.png"
                    alt="Swasth India"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-text-primary leading-tight">
                  Swaasth India
                </span>
              </Link>
            </div>

            {/* Center: Search Bar */}
            <div className="flex flex-1 max-w-xs items-center bg-gray-100 rounded-lg px-3 py-2 gap-2 mx-4">
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

            {/* Right: Quick Action Buttons (Desktop Only) */}
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
                href="/patient-dashboard"
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

            {/* Quick Login Button (Mobile Only) */}
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
        </div>

        {/* Global Full-Width Dropdown Menu */}
        <div
          className={`absolute left-0 w-full top-16 bg-white shadow-xl border-t border-gray-100 py-3 pb-4 space-y-1 transition-all duration-300 ease-in-out z-50 origin-top ${
            menuOpen
              ? "opacity-100 scale-y-100 pointer-events-auto"
              : "opacity-0 scale-y-95 pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Menu Links */}
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
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