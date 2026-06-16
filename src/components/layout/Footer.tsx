"use client";

import Link from "next/link";
import Image from "next/image";
import { HELP_LINKS, COMPANY_LINKS } from "@/lib/constants";

const helpIconMap: Record<string, React.ReactNode> = {
  secure: (
    <svg
      className="w-4 h-4 text-[#1A3FA4]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ),
  terms: (
    <svg
      className="w-4 h-4 text-[#1A3FA4]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  privacy: (
    <svg
      className="w-4 h-4 text-[#1A3FA4]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 w-full">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Help and Support Card */}
        <div className="bg-[#F4F8FF] rounded-2xl p-6 border border-[#E0EDFF] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10  flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-[#1A3FA4]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12a9 9 0 0118 0v7a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4a2 2 0 012-2h4M3 12v7a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2H3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Help and Support
              </h3>
            </div>

            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="col-span-3 space-y-3">
                {HELP_LINKS?.map((link) => {
                  const isFilePath =
                    link.icon?.startsWith("/") || link.icon?.includes(".");
                  return (
                    <Link
                      key={link.id}
                      href={link.href}
                      className="flex items-center gap-3 group w-max"
                    >
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
                        {link.icon &&
                          (isFilePath ? (
                            <div className="w-6 h-6 relative">
                              <Image
                                src={link.icon}
                                alt={link.label}
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <span>{link.icon}</span>
                          ))}
                      </div>
                      <span className="text-sm sm:text-lg text-gray-600 group-hover:text-[#1A3FA4] transition-colors font-medium whitespace-nowrap">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="col-span-2 relative w-full aspect-square min-w-[120px] max-w-[200px] justify-self-start -ml-2 overflow-visible">
                <Image
                  src="/home/shield.png"
                  alt="Shield"
                  fill
                  className="object-contain scale-110 origin-left"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Swasth India Info Card */}
        <div className="bg-[#FFF8F4] rounded-2xl p-6 border border-[#FFEADA] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 relative flex-shrink-0">
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-9 h-9"
                >
                  <path
                    d="M18 29s-11-7.5-11-15A7 7 0 0118 9a7 7 0 0111 5c0 7.5-11 15-11 15z"
                    fill="none"
                    stroke="#E8192C"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15 17h6M18 14v6"
                    stroke="#1A3FA4"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Swasth <span className="text-[#E8192C]">India</span>
              </h3>
            </div>

            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="col-span-3 space-y-3">
                {COMPANY_LINKS?.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-3 group w-max"
                  >
                    <div className="w-5 h-5 bg-[#E8192C] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm  sm:text-lg text-gray-600 group-hover:text-[#1A3FA4] transition-colors font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="col-span-2 relative w-full aspect-square min-w-[120px] max-w-[200px] justify-self-start -ml-2 overflow-visible">
                <Image
                  src="/home/notepad.png"
                  alt="Notepad"
                  fill
                  className="object-contain scale-110 origin-left"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Clean & Unified Gradient Bottom Panel */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#0D1B3E] via-[#152A5B] to-[#1A3FA4] text-white p-6 shadow-md">
        {/* Social Icons with Smooth Transitions */}
        <div className="flex justify-center items-center gap-5 mb-4">
          <Link
            href="https://www.instagram.com/swaasthindia?igsh=ODYzOTlzcTg3ODV4"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E8192C] flex items-center justify-center transition-all duration-200 transform hover:scale-105 text-sm font-semibold"
          >
            i
          </Link>
          <Link
            href="https://x.com/swaasthindiamed"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E8192C] flex items-center justify-center transition-all duration-200 transform hover:scale-105 text-sm font-semibold"
          >
            x
          </Link>
          <Link
            href="mailto:swaasthindiasupport@gmail.com"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E8192C] flex items-center justify-center transition-all duration-200 transform hover:scale-105 text-sm font-semibold"
          >
            m
          </Link>
        </div>

        {/* Unified Label & Copyright Info */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold tracking-widest text-white/90 uppercase">
            <span className="text-[#E8192C] animate-pulse">❤️</span>
            <span>Health is Love</span>
            <span className="text-[#E8192C] animate-pulse">❤️</span>
          </div>
          <p className="text-[11px] text-white/60 tracking-wide">
            © {new Date().getFullYear()} Swasth India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
