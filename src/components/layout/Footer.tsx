"use client";

import Link from "next/link";
import Image from "next/image";
import { HELP_LINKS, COMPANY_LINKS } from "@/lib/constants";

export default function Footer() {
  const quickLinks = COMPANY_LINKS?.filter(
    (item) =>
      !["Verified Doctor", "Careers", "Certificate"].includes(item.label)
  );

  return (
    <footer className="w-full bg-white shadow-sm border-t border-[#E0EDFF] mt-8">
      {/* <div className="w-full"> */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 py-6 lg:py-8">

    <div className="lg:pr-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 relative flex-shrink-0">
          <Image
            src="/site-logo.png"
            alt="Swaasth India"
            fill
            className="object-contain"
          />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#10285F]">
          Swaasth <span className="text-[#E8192C]">India</span>
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 leading-5 max-w-sm">
        Better healthcare through trusted doctors, easy appointments
        and reliable support.
      </p>
    </div>

    <div>
      <h4 className="text-base font-bold text-[#1A3FA4] mb-2">
        Quick Links
      </h4>

      <div className="w-8 h-[2px] bg-[#E8192C] mb-3" />

      <div className="space-y-1.5">
        {quickLinks?.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-[#1A3FA4] transition-colors"
          >
            <span className="text-[#1A3FA4] text-base leading-none">›</span>
            {item.label}
          </Link>
        ))}

        {HELP_LINKS?.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-[#1A3FA4] transition-colors"
          >
            <span className="text-[#1A3FA4] text-base leading-none">›</span>
            {item.label}
          </Link>
        ))}
      </div>
    </div>

    <div>
      <h4 className="text-base font-bold text-[#1A3FA4] mb-2">
        For Patients
      </h4>

      <div className="w-8 h-[2px] bg-[#E8192C] mb-3" />

      <div className="space-y-1.5">
        <Link
          href="/doctor-listing"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-[#1A3FA4] transition-colors"
        >
          <span className="text-[#1A3FA4] text-base leading-none">›</span>
          Doctors
        </Link>

        <Link
          href="/lab-tests"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-[#1A3FA4] transition-colors"
        >
          <span className="text-[#1A3FA4] text-base leading-none">›</span>
          Lab Tests
        </Link>

        <Link
          href="/appointments"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-[#1A3FA4] transition-colors"
        >
          <span className="text-[#1A3FA4] text-base leading-none">›</span>
          Appointments
        </Link>

        <Link
          href="/patient-dashboard"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-[#1A3FA4] transition-colors"
        >
          <span className="text-[#1A3FA4] text-base leading-none">›</span>
          Patient Dashboard
        </Link>
      </div>
    </div>

    <div>
      <h4 className="text-base font-bold text-[#1A3FA4] mb-2">
        For Doctors
      </h4>

      <div className="w-8 h-[2px] bg-[#E8192C] mb-3" />

      <div className="space-y-1.5">
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-[#1A3FA4] transition-colors"
        >
          <span className="text-[#1A3FA4] text-base leading-none">›</span>
          Doctor Login
        </Link>

        <Link
          href="/doctor-dashboard"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-[#1A3FA4] transition-colors"
        >
          <span className="text-[#1A3FA4] text-base leading-none">›</span>
          Doctor Dashboard
        </Link>
      </div>
    </div>
  </div>
</div>

        <div className="w-full border-t border-[#E5EAF3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 text-center">
                <p className="text-xs sm:text-sm text-gray-500">
                  © {new Date().getFullYear()} Swaasth India. All rights reserved.
                </p>

                <span className="hidden sm:block text-gray-300">|</span>

                <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#10285F] uppercase">
                  <span className="text-[#E8192C]">❤️</span>
                  <span>Health is Love</span>
                  <span className="text-[#E8192C]">❤️</span>
                </div>
              </div>

                <div className="flex items-center gap-3">
  {/* Instagram */}
  <Link
    href="https://www.instagram.com/swaasthindia?igsh=ODYzOTlzcTg3ODV4"
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-full bg-[#1A3FA4] text-white flex items-center justify-center hover:bg-red-700  transition-all"
    aria-label="Instagram"
  >
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  </Link>

  {/* X (Twitter) */}
  <Link
    href="https://x.com/swaasthindiamed"
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-full bg-[#1A3FA4] text-white flex items-center justify-center hover:bg-red-700  transition-all"
    aria-label="X (Twitter)"
  >
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  </Link>

  {/* Email */}
  <Link
    href="mailto:swaasthindiasupport@gmail.com"
    className="w-9 h-9 rounded-full bg-[#1A3FA4] text-white flex items-center justify-center hover:bg-red-700 transition-all"
    aria-label="Email"
  >
    <svg className="w-4 h-4 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  </Link>
</div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </footer>
  );
}