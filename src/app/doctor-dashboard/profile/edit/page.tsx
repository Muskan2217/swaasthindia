// src/app/doctor-dashboard/profile/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getMyDoctorProfile,
  updateMyDoctorProfile,
  type MyDoctorProfile,
  type DoctorAvailability,
} from "@/lib/api";
import {
  InputField,
  SelectField,
  FileUploadField,
} from "@/components/auth/FormField";
import { AlertCircle, CheckCircle2, ArrowLeft, Stethoscope } from "lucide-react";

const AVAILABILITY_OPTIONS: DoctorAvailability[] = [
  "Available Today",
  "Available Tomorrow",
  "Not Available",
];

interface FormState {
  qualification: string;
  city: string;
  state: string;
  consultationFee: string;
  about: string;
  languages: string;
  availability: DoctorAvailability | "";
  nextSlot: string;
  profilePhoto: File | null;
}

export default function EditDoctorProfilePage() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState<string>("");

  const [form, setForm] = useState<FormState>({
    qualification: "",
    city: "",
    state: "",
    consultationFee: "",
    about: "",
    languages: "",
    availability: "",
    nextSlot: "",
    profilePhoto: null,
  });

  const set =
    (key: keyof FormState) => (v: string | File | null) =>
      setForm((f) => ({ ...f, [key]: v }));

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "doctor") {
      router.replace("/patient-dashboard");
      return;
    }
    if (!token) return;

    (async () => {
      try {
        setInitialLoading(true);
        setLoadError(null);
        const profile: MyDoctorProfile = await getMyDoctorProfile(token);

        setDoctorName(profile.name ?? user?.name ?? "");
        setForm({
          qualification: profile.qualification ?? "",
          city: profile.city ?? "",
          state: profile.state ?? "",
          consultationFee:
            profile.consultationFee !== null ? String(profile.consultationFee) : "",
          about: profile.about ?? "",
          languages: profile.languages?.join(", ") ?? "",
          availability: profile.availability ?? "",
          nextSlot: profile.nextSlot ?? "",
          profilePhoto: null,
        });
        setCurrentPhotoUrl(profile.profileImage);
      } catch (err: any) {
        setLoadError(err?.message || "Failed to load your profile.");
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [user, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaveError(null);
    setSaveSuccess(false);

    if (!form.qualification.trim()) {
      setSaveError("Qualification is required.");
      return;
    }

    setSaving(true);
    try {
      const languagesArray = form.languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);

      const updated = await updateMyDoctorProfile(token, {
        qualification: form.qualification,
        city: form.city || undefined,
        state: form.state || undefined,
        consultationFee: form.consultationFee || undefined,
        about: form.about || undefined,
        languages: languagesArray.length > 0 ? languagesArray : undefined,
        availability: form.availability || undefined,
        nextSlot: form.nextSlot || undefined,
        profilePhoto: form.profilePhoto,
      });

      setCurrentPhotoUrl(updated.profileImage);
      setForm((f) => ({ ...f, profilePhoto: null }));
      setSaveSuccess(true);
    } catch (err: any) {
      setSaveError(
        err?.message ||
          (err?.errors ? Object.values(err.errors).flat().join(" ") : null) ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200 mb-6" />
          <div className="h-[520px] animate-pulse rounded-3xl border border-slate-100 bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <BackButton />
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle size={16} className="mt-0.5 text-red-500" />
            <p className="text-sm text-red-600">{loadError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <div className="mx-auto max-w-3xl p-4 md:p-6">
        <BackButton />

        {/* Header */}
        <div className="mt-4 mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3864D5]/10 text-[#3864D5]">
            <Stethoscope size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0D1B3E]">
              Edit Profile
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {doctorName ? `Dr. ${doctorName} — ` : ""}Complete your details to appear fully in patient search results.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6"
        >
          {saveSuccess && (
            <div className="flex items-start gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle2 size={16} className="mt-0.5 text-green-600" />
              <p className="text-sm text-green-700">Profile updated successfully.</p>
            </div>
          )}

          {saveError && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle size={16} className="mt-0.5 text-red-500" />
              <p className="text-sm text-red-600">{saveError}</p>
            </div>
          )}

          {/* Photo Card */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading title="Profile Photo" />

            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-50 to-blue-100 ring-8 ring-slate-50">
                {currentPhotoUrl && !form.profilePhoto ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={currentPhotoUrl}
                    alt="Current profile photo"
                    className="h-full w-full object-cover"
                  />
                ) : form.profilePhoto ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={URL.createObjectURL(form.profilePhoto)}
                    alt="New profile photo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#3864D5]">
                    {(doctorName || "D").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <FileUploadField
                  label=""
                  accept="image/*"
                  hint={
                    currentPhotoUrl
                      ? "Upload a new photo to replace your current one · JPG, PNG up to 5MB"
                      : "JPG, PNG up to 5MB"
                  }
                  fileName={form.profilePhoto?.name}
                  onChange={(f) => set("profilePhoto")(f)}
                />
              </div>
            </div>
          </section>

          {/* Professional Info */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading title="Professional Information" />

            <div className="mt-5 flex flex-col gap-4">
              <InputField
                label="Qualification"
                placeholder="MBBS, MD"
                value={form.qualification}
                onChange={set("qualification")}
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="Consultation Fee (₹)"
                  type="number"
                  placeholder="e.g. 500"
                  value={form.consultationFee}
                  onChange={set("consultationFee")}
                />
                <InputField
                  label="Languages Spoken"
                  placeholder="e.g. English, Hindi, Punjabi"
                  value={form.languages}
                  onChange={set("languages")}
                />
              </div>


              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0D1B3E]">About</label>
                <textarea
                  value={form.about}
                  onChange={(e) => set("about")(e.target.value)}
                  placeholder="A short bio patients will see on your profile"
                  rows={4}
                  className="w-full rounded-[14px] border border-[#E5E7EB] bg-[#F7F8FC] px-4 py-3 text-sm font-medium text-[#0D1B3E] outline-none transition-all duration-150 placeholder-gray-400 focus:border-[#3864D5] focus:bg-white focus:ring-2 focus:ring-[#3864D5]/10"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading title="Location" />

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="City"
                placeholder="e.g. Delhi"
                value={form.city}
                onChange={set("city")}
              />
              <InputField
                label="State"
                placeholder="e.g. Delhi"
                value={form.state}
                onChange={set("state")}
              />
            </div>
          </section>

          {/* Sticky action bar */}
          <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
            <Link
              href="/doctor-dashboard"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#3864D5] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#2f54b8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Small helper components
------------------------------------------------------- */

function BackButton() {
  return (
    <Link
      href="/doctor-dashboard"
      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#3864D5]"
    >
      <ArrowLeft size={16} />
      Back to Dashboard
    </Link>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
      <div className="h-2 w-2 rounded-full bg-[#3864D5]" />
      <h2 className="text-base font-bold text-[#0D1B3E]">{title}</h2>
    </div>
  );
}