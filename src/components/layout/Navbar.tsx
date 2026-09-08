"use client";

import { useState, useRef, useEffect } from "react";
import { logout as logoutApi } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout user from backend and clear local session
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await logoutApi(token);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
      setDropdownOpen(false);
      setMenuOpen(false);
      router.push("/login");
    }
  };

  // Helper for profile route determination
  const getProfileHref = () => {
    if (!user) return "/login";

    if (user.role === "doctor") {
      return `/doctor-profile/${user.slug}`;
    }

    return `/patient-profile/${user.id}`;
  };

  // Desktop nav links — role-based
  const desktopNavItems = user
    ? user.role === "doctor"
      ? [
          { href: "/", label: "Home" },
          { href: "/doctor-dashboard", label: "Dashboard" },
        ]
      : [
          // { href: "/", label: "Home" },
          { href: "/doctor-listing", label: "Doctors" },
          { href: "/lab-tests", label: "Lab Tests" },
          { href: "/appointments", label: "Appointments" },
           { href: "/patient-dashboard", label: "Dashboard" },
        ]
    : [
        { href: "/", label: "Home" },
        { href: "/doctor-listing", label: "Doctors" },
        { href: "/lab-tests", label: "Lab Tests" },
      ];

  // Profile dropdown items — role-based
  const dropdownItems = user
    ? user.role === "doctor"
      ? [
          { href: getProfileHref(), label: "My Profile" },
        ]
      : [
          { href: "/patient-dashboard", label: "Dashboard" },
          { href: getProfileHref(), label: "My Profile" },
        ]
    : [];

  // Mobile hamburger links — role-based
  const mobileMenuItems = user
    ? user.role === "doctor"
      ? [
          { href: "/", label: "Home" },
          { href: "/doctor-dashboard", label: "Dashboard" },
          { href: getProfileHref(), label: "My Profile" },
        ]
      : [
          { href: "/", label: "Home" },
          { href: "/doctor-listing", label: "Doctors" },
          { href: "/lab-tests", label: "Lab Tests" },
          { href: "/appointments", label: "Appointments" },
          { href: "/patient-dashboard", label: "Dashboard" },
          { href: getProfileHref(), label: "My Profile" },
        ]
    : [
        // { href: "/", label: "Home" },
        { href: "/doctor-listing", label: "Doctors" },
        { href: "/lab-tests", label: "Lab Tests" },
         { href: "/patient-dashboard", label: "Dashboard" },
        { href: "/login", label: "Login / Sign up" },
      ];

  return (
    <>
      {/* Backdrop — closes mobile menu on outside click */}
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
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-2">
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
              <Link
                href={
                  !user
                    ? "/"
                    : user.role === "doctor"
                      ? "/doctor-dashboard"
                      : "/patient-dashboard"
                }
                className="flex items-center gap-1 flex-shrink-0"
              >
                <div className="w-9 h-9 relative flex items-center justify-center">
                  <Image
                    src="/site-logo.png"
                    alt="Swaasth India"
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
                placeholder=""
                className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400 sm:placeholder:text-sm"
              />
            </div>

            {/* Right: Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              {/* Role-based nav links */}
              {desktopNavItems.map((item) => (
                <NavButton
                  key={item.href + item.label}
                  href={item.href}
                  label={item.label}
                  icon={null}
                />
              ))}

              {/* Guest: Login / Sign up */}
              {!user && (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#0D1B3E] border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  Login / Sign Up
                </Link>
              )}

              {/* Authenticated: name + profile dropdown */}
          {user && (
  <div className="flex items-center gap-2">
    <Link
      href={getProfileHref()}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#0D1B3E] hover:bg-gray-100 transition-colors"
      aria-label="My Profile"
    >
      <span className="w-7 h-7 rounded-full bg-[#3864D5] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {user.name?.charAt(0).toUpperCase() ?? "U"}
      </span>

      <span className="hidden lg:block max-w-[120px] truncate">
        {user.name}
      </span>
    </Link>

    <button
  onClick={handleLogout}
  className="relative group w-9 h-9 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
  aria-label="Logout"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m3 8H5a2 2 0 01-2-2V6a2 2 0 012-2h5"
    />
  </svg>

  <span className="absolute top-full right-0 mt-2 px-3 py-1.5 rounded-md bg-[#0D1B3E] text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
    Logout
  </span>
</button>
  </div>
)}
            </nav>

            {/* Mobile: avatar button (authenticated) or login icon (guest) */}
            {user ? (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-8 h-8 zrounded-full bg-[#3864D5] text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                aria-label="Open menu"
              >
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </button>
            ) : (
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
            )}
          </div>
        </div>

        {/* Mobile / Hamburger Dropdown Menu */}
        <div
          className={`absolute left-0 w-full top-16 bg-white shadow-xl border-t border-gray-100 py-3 pb-4 space-y-1 transition-all duration-300 ease-in-out z-50 origin-top ${
            menuOpen
              ? "opacity-100 scale-y-100 pointer-events-auto"
              : "opacity-0 scale-y-95 pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Authenticated: user greeting with role label */}
            {user && (
              <div className="px-4 py-2.5 mb-1 flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <span className="w-8 h-8 rounded-full bg-[#3864D5] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase() ?? "U"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0D1B3E] leading-tight">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            )}

            {/* Role-based mobile menu links */}
            <div className="flex flex-col gap-0.5">
              {mobileMenuItems.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-[#0D1B3E] hover:bg-gray-50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {/* Logout — only when authenticated */}
              {user && (
                <>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
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