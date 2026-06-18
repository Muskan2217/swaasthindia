"use client";

import Link from "next/link";
import Image from "next/image";

export default function DoctorPatientSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-6"
    >
   <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">

  {/* Top Header */}
  <div className="flex items-center gap-3 mb-0">
    <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center">
      <svg
        className="w-6 h-6 text-[#1A3FA4]"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    </div>

    <h3 className="text-xl font-bold text-text-primary">
      Doctor / Patient
    </h3>
  </div>

  {/* Content */}
  <div className="grid md:grid-cols-2 items-center gap-6">

    {/* Left Image */}
    <div className="flex justify-center">
      <Image
        src="/home/doctor-patient.png"
        alt="Doctor Consultation"
        width={500}
        height={400}
        className="w-full max-w-md h-auto"
      />
    </div>


          {/* RIGHT CONTENT */}
          <div className="p-6 sm:p-2"
          >
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Doctor Consultation
              </h3>
            </div>

            <p className="text-text-primary text-lg leading-relaxed mb-6">
              Connect with experienced doctors, get expert medical advice,
              and book appointments from the comfort of your home.
            </p>

            <Link
              href="/find-doctors"
              className="inline-flex items-center gap-3 bg-brand-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Find Doctors

              <svg
                className="w-5 h-5"
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
          </div>

        </div>
      </div>
    </section>
  );
}