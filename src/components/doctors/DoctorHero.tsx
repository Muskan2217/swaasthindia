// src/components/doctors/DoctorHero.tsx
import Image from "next/image";

export default function DoctorHero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left: Heading */}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Find the Right Doctor
            </h1>
            <p className="mt-3 max-w-lg text-base text-slate-600 sm:text-lg">
              Book appointments with trusted and verified doctors across
              India.
            </p>
          </div>

          {/* Right: Banner Image */}
          <div className="relative mx-auto h-56 w-full max-w-lg sm:h-72 lg:h-80">
            <Image
              src="/hero-banner.png"
              alt="Doctor consulting with a patient"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
