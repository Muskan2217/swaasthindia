import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccessVerifiedBanner from "@/components/doctor-profile/AccessVerifiedBanner";
import DoctorProfileHeader from "@/components/doctor-profile/DoctorProfileHeader";
import AboutDoctor from "@/components/doctor-profile/AboutDoctor";
import AppointmentBooking from "@/components/doctor-profile/AppointmentBooking";
import ReviewsSection from "@/components/doctor-profile/ReviewsSection";
import RelatedDoctors from "@/components/doctor-profile/RelatedDoctors";
import BottomInfoRow from "@/components/doctor-profile/BottomInfoRow";

import {
  DOCTOR_PROFILE,
  DATE_SLOTS,
  TIME_SLOTS,
  PATIENT_REVIEWS,
  RELATED_DOCTORS,
  SERVICE_SUPPORT,
  DATE_RANGE_LABEL,
} from "@/lib/doctor-profile-data";

export const metadata = {
  title: `${DOCTOR_PROFILE.name} – ${DOCTOR_PROFILE.specialty} | Swaasth India`,
  description: DOCTOR_PROFILE.about.slice(0, 155),
};

export default function DoctorProfilePage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* 1. QR Access Verified Banner */}
        <AccessVerifiedBanner />

        {/* 2. Doctor Profile Header (name, specialty, fee, verification) */}
        <DoctorProfileHeader doctor={DOCTOR_PROFILE} />

        {/* 3 + 4. Two-column layout on desktop: About | Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <AboutDoctor doctor={DOCTOR_PROFILE} />
            <ReviewsSection
              reviews={PATIENT_REVIEWS}
              rating={DOCTOR_PROFILE.rating}
              reviewCount={DOCTOR_PROFILE.reviewCount}
            />
          </div>

          {/* Right column — sticky booking card on large screens */}
          <div className="lg:sticky lg:top-[80px] self-start">
            <AppointmentBooking
              dateSlots={DATE_SLOTS}
              timeSlots={TIME_SLOTS}
              dateRangeLabel={DATE_RANGE_LABEL}
            />
          </div>
        </div>

        {/* 5. Service Support + Clinic Images */}
        <BottomInfoRow
          supportItems={SERVICE_SUPPORT}
          clinicImages={DOCTOR_PROFILE.clinicImages}
        />

        {/* 6. Related / Similar Doctors */}
        <RelatedDoctors doctors={RELATED_DOCTORS} />

        <Footer />
      </main>
    </div>
  );
}
