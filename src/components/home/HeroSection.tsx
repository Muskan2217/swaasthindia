"use client";

import Link from "next/link";
import Image from "next/image";


export default function HeroSection() {
  return (
    <section className="bg-white rounded-2xl mx-4 sm:mx-6 mt-4 overflow-hidden shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 sm:py-14 flex flex-col md:flex-row items-center gap-2">
        {/* Left: Text Content */}
     
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-text-primary leading-tight tracking-tight">
                Quality Care is <br />
                Just a <span className="text-[#E8192C]">Click Away</span>
              </h1>
            </div>

            <p className="mt-5 text-text-primary text-xl sm:text-2xl leading-relaxed max-w-sm">
              Get expert medical advice from the comfort of your home. Consult
              with verified specialists across India starting at just{" "}
              <span className="font-semibold text-text-primary">₹50</span>.
            </p>

            {/* CTA Row */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/consult"
                className="inline-flex items-center gap-3 bg-[#E8192C] hover:bg-red-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-105 active:scale-100"
              >
                Consult Now
                <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>

              {/* Price Badge */}
              {/* <div className="border-2 border-dashed border-[#E8192C] rounded-xl px-5 py-2 text-center"> */}
              <div className="w-40 border-2 border-dashed border-[#E8192C] rounded-xl px-5 py-2 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-gray-400 line-through text-sm font-medium">
                    ₹500
                  </span>
                  <span className="text-[#E8192C] font-extrabold text-xl">
                    ₹50
                  </span>
                </div>
                <div className="bg-green-100 text-700 text-sm font-bold tracking-wider mt-0.5 px-3 py-1 rounded-full inline-block">
                  90% OFF
                </div>
              </div>
            </div>
          </div>
      
        {/* Right: Illustration */}

      
          <div className="flex-1 flex justify-center">
            <Image
              src="/hero-banner.png"
              alt="Doctor Consultation"
              width={700}
              height={700}
              // className="w-full max-w-md h-auto"
              // className="w-full max-w-xl h-auto"
            />
          </div>
      
      </div>
    </section>
  );
}
