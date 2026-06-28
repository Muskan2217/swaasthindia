// src/components/doctor-profile/AccessVerifiedBanner.tsx
import Image from "next/image";

export default function AccessVerifiedBanner() {
  return (
    <div className="bg-blue-50 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-5 gap-4">
        {/* Left — QR phone illustration */}
        <div className="flex-shrink-0 w-40 h-40 relative hidden sm:block">
          <Image
            src="/doctor-profile/QR-verified.png"
            alt="Swaasth India Verified Shield"
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </div>

        {/* Centre — text */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-text-primary leading-tight">
              QR Access Verified
            </h2>

            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
            >
              <circle cx="17" cy="17" r="17" fill="#3B82F6" />
              <path
                d="M9 17l5 5L25 11"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Your access is verified. You can now
            <br className="hidden sm:block" />
            book your appointment.
          </p>
        </div>

        {/* Right — shield image */}
        <div className="flex-shrink-0 w-40 h-40 relative hidden sm:block">
          <Image
            src="/doctor-profile/shield-verified.png"
            alt="Swaasth India Verified Shield"
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
