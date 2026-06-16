"use client";

import Link from "next/link";
import Image from "next/image";
import { HEALTH_MENU_ITEMS } from "@/lib/constants";
import { motion } from "framer-motion";

function QRCodeIllustration() {
  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <div className="w-20 h-28 bg-gray-900 rounded-2xl border-4 border-gray-700 shadow-xl mx-auto overflow-hidden flex flex-col">
        <div className="h-2 bg-gray-800" />
        <div className="flex-1 bg-white flex items-center justify-center p-2">
          {/*  SVG for (ECG / QR stays SVG) icons */}
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect x="2" y="2" width="12" height="12" fill="#0D1B3E" />
            <rect x="26" y="2" width="12" height="12" fill="#0D1B3E" />
            <rect x="2" y="26" width="12" height="12" fill="#0D1B3E" />

            <polyline
              points="0,20 10,20 15,10 20,30 25,15 30,25 40,20"
              fill="none"
              stroke="#E8192C"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className="h-2 bg-gray-800" />
      </div>
    </div>
  );
}

export default function QuickActionsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* left hand side */}
        {/* ================= QR CARD ================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-[#EEF2FF] rounded-2xl p-6 border border-gray-100 shadow-sm flex justify-between items-top hover:shadow-md transition-all duration-300"
        >
          {/* TEXT */}
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-15 h-15 bg-[#EEF2FF] rounded-xl flex items-center justify-center">
                <Image
                  src="/icons/QuickActions/qr-icon.png"
                  alt="scan"
                  width={200}
                  height={200}
                />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Scan QR to Book
              </h3>
            </div>

            <p className="text-text-primary text-xl sm:text-1xl text-500 mb-5">
              Scan the QR code to book a consultation with our specialists.
            </p>

            <Link
              href="/scan-qr"
              className="inline-flex items-center gap-2 bg-[#1A3FA4] hover:bg-[#0F2872] text-white font-semibold text-sm px-5 py-2.5 rounded-xl"
            >
              Scan QR Now ➔
            </Link>
          </div>

          {/* QR IMAGE */}

          <Image
            src="/icons/QuickActions/Scan-qr.png"
            alt="scan"
            width={200}
            height={200}
          />
        </motion.div>

        {/* right hand side */}
        {/* ================= HEALTH CARD ================= */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#EEF2FF] rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <Image
                src="/icons/QuickActions/heart.png"
                alt="scan"
                width={200}
                height={200}
              />
            </div>
            <h3 className="text-text-primary text-xl sm:text-2xl font-bold">
              My Health
            </h3>
          </div>

          <div className="space-y-3">
            {HEALTH_MENU_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-300 hover:border-[#1A3FA4]/40 hover:bg-[#EEF2FF] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  {/* ICON IMAGE */}
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={30}
                    height={30}
                  />

                  <span className="text-base sm:text-lg font-semibold text-text-primary">
                    {item.label}
                  </span>
                </div>

                <svg
                  className="w-5 h-5 text-brand-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>

          {/* ECG ONLY SVG */}
          <div className="absolute bottom-0 left-0 right-0 h-14 opacity-10">
            <svg viewBox="0 0 400 60" className="w-full h-full">
              <polyline
                points="0,30 80,30 100,10 120,50 140,30 160,20 180,40 200,30 400,30"
                fill="none"
                stroke="#E8192C"
                strokeWidth="2"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
