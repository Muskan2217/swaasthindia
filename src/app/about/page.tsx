import React from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* max-w-4xl ko max-w-7xl kar diya hai taaki width match ho jaye */}
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
          
          {/* Banner Image Section */}
          <div className="relative w-full h-64 sm:h-96 bg-blue-900">
            <Image
              src="/hero-banner.png" 
              alt="Swaasth India Healthcare"
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 to-blue-900/40 flex items-center px-8 sm:px-12">
              <div>
                <span className="text-red-400 font-semibold tracking-wider uppercase text-sm bg-red-950/40 px-3 py-1 rounded-full border border-red-500/30">
                  Welcome to Swaasth India
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3">
                  About Us
                </h1>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-12 space-y-8">
            <div className="border-l-4 border-red-600 pl-4 py-1">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-950">
                About the Founders & Our Mission
              </h2>
              <p className="text-gray-600 mt-2 leading-relaxed text-lg">
                We make Swaasth India with a simple mission: to make healthcare more accessible, transparent, and convenient for everyone.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-900">
                The Story Behind Swaasth India
              </h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                The idea for Swaasth India came from a common problem that we personally experienced while visiting doctors and diagnostic centers. Patients often spend hours waiting in long queues without knowing when their turn will arrive. Many clinics still rely on manual appointment systems, making it difficult for patients to manage their time effectively. We also noticed that online appointment booking for blood tests and diagnostic services was limited or unavailable in many areas.
              </p>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                To solve these challenges, we created Swaasth India — a healthcare platform that helps patients connect with doctors, diagnostic laboratories, and pharmacies through a simple digital experience.
              </p>
            </div>

            <div className="bg-blue-50/50 rounded-xl p-6 sm:p-8 border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-950 mb-6">
                What Users Can Do Through Swaasth India
              </h3>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
                {[
                  "Book doctor appointments online",
                  "Track appointment number and expected turn",
                  "Book blood tests and diagnostic services",
                  "Access and track laboratory reports",
                  "Order medicines online",
                  "Book consultations with health professionals",
                  "Manage healthcare from one platform",
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                    <span className="text-red-600 font-bold mt-0.5">✓</span>
                    <span className="text-sm sm:text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                Our vision is to reduce waiting time, improve healthcare accessibility, and bring modern digital healthcare services to every patient across India.
              </p>
              <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-600 text-red-950 font-semibold rounded-r-lg text-base sm:text-lg">
                At Swaasth India, we believe that healthcare should be simple, transparent, and available whenever people need it.
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}