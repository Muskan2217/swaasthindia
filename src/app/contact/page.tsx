import React from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
          
          {/* Banner Image Section */}
          <div className="relative w-full h-64 sm:h-96 bg-blue-900">
            <Image
              src="/hero-banner.png" 
              alt="Swaasth India Support"
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 to-blue-900/40 flex items-center px-8 sm:px-12">
              <div>
                <span className="text-red-400 font-semibold tracking-wider uppercase text-sm bg-red-950/40 px-3 py-1 rounded-full border border-red-500/30">
                  We are here to help
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3">
                  Help & Support / Contact Us
                </h1>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-12 space-y-10">
            
            <div className="border-l-4 border-red-600 pl-4 py-1">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-950">
                Get in Touch with Us
              </h2>
              <p className="text-gray-600 mt-2 leading-relaxed text-lg">
                Have questions about booking an appointment or need assistance with our services? Reach out to us directly—our support team is available every day to assist you.
              </p>
            </div>

            {/* Contact Details Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-blue-950 text-lg">Customer Support</h3>
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold block text-gray-900">Call & WhatsApp:</span>
                  <a href="tel:+916397673470" className="text-red-600 hover:underline">+91 6397673470</a>
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold block text-gray-900">Call Support:</span>
                  <a href="tel:+918534988633" className="text-red-600 hover:underline">+91 8534988633</a>
                </p>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-blue-950 text-lg">Email Support</h3>
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold block text-gray-900">Drop us a line:</span>
                  <a href="mailto:swaasthindiasupport@gmail.com" className="text-red-600 hover:underline break-all">
                    swaasthindiasupport@gmail.com
                  </a>
                </p>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-blue-950 text-lg">Office Address</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Santi Colony, Etawah, Uttar Pradesh – 206001, India
                </p>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-blue-950 text-lg">Operating Hours</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-semibold block text-gray-900">Monday to Sunday:</span>
                  9:00 AM – 9:00 PM (Open all 7 days)
                </p>
              </div>

            </div>

            {/* Frequently Asked Questions */}
            <div className="border-t pt-8 space-y-6">
              <h3 className="text-2xl font-bold text-blue-950 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-red-600" />
                Frequently Asked Questions (FAQ)
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                
                <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
                  <h4 className="font-semibold text-blue-900 text-base">
                    How can I reach customer care quickly?
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    You can either call us directly or drop a message on WhatsApp at +91 6397673470 for quick support.
                  </p>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
                  <h4 className="font-semibold text-blue-900 text-base">
                    How do I book a doctor's appointment?
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Select your preferred doctor or clinic on the platform, choose an available date and time slot, and confirm your booking.
                  </p>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
                  <h4 className="font-semibold text-blue-900 text-base">
                    Can I cancel or reschedule my appointment?
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Yes, you can manage your bookings directly from the "My Bookings" section or reach out to our team via WhatsApp/Call for assistance.
                  </p>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
                  <h4 className="font-semibold text-blue-900 text-base">
                    Is customer support available on Sundays?
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Yes, our team is available 7 days a week, Monday through Sunday, from 9:00 AM to 9:00 PM.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}