// src/app/doctor-profile/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DoctorProfileView from "@/components/doctor-profile/DoctorProfileView";
import BookingGate from "@/components/doctor-profile/BookingGate";
import { getDoctorBySlug, DoctorNotFoundError } from "@/lib/api";

interface DoctorProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DoctorProfilePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const doctor = await getDoctorBySlug(slug);
    return {
      title: `${doctor.name} – ${doctor.specialization} | Swaasth India`,
      description:
        doctor.about?.slice(0, 155) ??
        `Book an appointment with ${doctor.name}.`,
    };
  } catch {
    return { title: "Doctor Profile | Swaasth India" };
  }
}

export default async function DoctorProfilePage({
  params,
}: DoctorProfilePageProps) {
  const { slug } = await params;

  let doctor;
  try {
    doctor = await getDoctorBySlug(slug);
  } catch (error) {
    if (error instanceof DoctorNotFoundError) {
      notFound();
    }
    throw error; // handled by error.tsx
  }

  return (
    <div className="space-y-6">
      <DoctorProfileView doctor={doctor} />
      <BookingGate
  doctorSlug={doctor.slug}
  consultationFee={doctor.consultationFee}
  availability={doctor.availability}
  nextSlot={doctor.nextSlot}
/>
    </div>
  );
}