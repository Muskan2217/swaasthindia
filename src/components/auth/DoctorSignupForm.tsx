// src/components/auth/DoctorSignupForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Stethoscope,
  Briefcase,
  Building2,
  Hash,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  DOCTOR_SIGNUP_DEFAULTS,
  SPECIALIZATIONS,
  EXPERIENCE_OPTIONS,
  type DoctorSignupFormData,
} from "@/lib/auth-dummy-data";
import {
  InputField,
  PasswordField,
  SelectField,
  FileUploadField,
} from "./FormField";

interface Errors extends Partial<Record<keyof DoctorSignupFormData, string>> {
  general?: string;
}

function validate(data: DoctorSignupFormData): Errors {
  const errors: Errors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required.";
  if (!/^\d{10}$/.test(data.mobile))
    errors.mobile = "Enter a valid 10-digit mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address.";
  if (data.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  if (!data.specialization)
    errors.specialization = "Please select a specialization.";
  if (!data.experience) errors.experience = "Please select your experience.";
  if (!data.clinicName.trim())
    errors.clinicName = "Clinic / Hospital name is required.";
  if (!data.registrationNumber.trim())
    errors.registrationNumber = "Medical registration number is required.";
  if (!data.profilePhoto) errors.profilePhoto = "Profile photo is required.";
  if (!data.degreeCertificate)
    errors.degreeCertificate = "Degree certificate is required.";
  if (!data.acceptTerms)
    errors.acceptTerms = "You must accept the Terms & Conditions.";
  return errors;
}

export default function DoctorSignupForm() {
  const router = useRouter();
  const [form, setForm] = useState<DoctorSignupFormData>(
    DOCTOR_SIGNUP_DEFAULTS,
  );
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set =
    (key: keyof DoctorSignupFormData) => (v: string | boolean | File | null) =>
      setForm((f) => ({ ...f, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    // Simulate API: await fetch('/api/auth/register/doctor', { method: 'POST', body: formData })
    await new Promise((r) => setTimeout(r, 1000));

    setLoading(false);
    router.push("/pending-approval");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="mb-1">
        <h1 className="text-2xl font-extrabold text-[#0D1B3E]">
          Doctor Registration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Submit your credentials. Verification typically takes 1–2 working
          days.
        </p>
      </div>

      {errors.general && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          <AlertCircle
            size={15}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-red-600 font-medium">{errors.general}</p>
        </div>
      )}

      {/* ── Personal details ─────────────────────────── */}
      <SectionLabel>Personal Details</SectionLabel>

      <InputField
        label="Full Name"
        placeholder="Dr. Full Name"
        value={form.fullName}
        onChange={set("fullName")}
        error={errors.fullName}
        required
        icon={<User size={15} />}
        autoComplete="name"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Mobile Number"
          type="tel"
          placeholder="10-digit number"
          value={form.mobile}
          onChange={set("mobile")}
          error={errors.mobile}
          required
          icon={<Phone size={15} />}
          autoComplete="tel"
        />
        <InputField
          label="Email Address"
          type="email"
          placeholder="doctor@clinic.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          required
          icon={<Mail size={15} />}
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PasswordField
          label="Password"
          placeholder="Min. 6 characters"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          required
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm Password"
          placeholder="Re-enter password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />
      </div>

      {/* ── Professional details ──────────────────────── */}
      <SectionLabel>Professional Details</SectionLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Specialization"
          value={form.specialization}
          onChange={set("specialization")}
          options={SPECIALIZATIONS}
          placeholder="Select specialization"
          error={errors.specialization}
          required
        />
        <SelectField
          label="Experience"
          value={form.experience}
          onChange={set("experience")}
          options={EXPERIENCE_OPTIONS}
          placeholder="Select experience"
          error={errors.experience}
          required
        />
      </div>

      <InputField
        label="Clinic / Hospital Name"
        placeholder="Swaasth Heart & Care Clinic"
        value={form.clinicName}
        onChange={set("clinicName")}
        error={errors.clinicName}
        required
        icon={<Building2 size={15} />}
      />

      <InputField
        label="Medical Registration Number"
        placeholder="MCI-XXXXXX"
        value={form.registrationNumber}
        onChange={set("registrationNumber")}
        error={errors.registrationNumber}
        required
        icon={<Hash size={15} />}
      />

      {/* ── Document uploads ──────────────────────────── */}
      <SectionLabel>Document Uploads</SectionLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadField
          label="Profile Photo"
          accept="image/*"
          hint="JPG, PNG up to 5 MB"
          fileName={form.profilePhoto?.name}
          onChange={(f) => set("profilePhoto")(f)}
          error={errors.profilePhoto}
          required
        />
        <FileUploadField
          label="Degree Certificate"
          accept="image/*,.pdf"
          hint="PDF or image up to 10 MB"
          fileName={form.degreeCertificate?.name}
          onChange={(f) => set("degreeCertificate")(f)}
          error={errors.degreeCertificate}
          required
        />
      </div>

      {/* Terms */}
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={(e) => set("acceptTerms")(e.target.checked)}
            className="w-4 h-4 accent-[#3864D5] rounded mt-0.5 flex-shrink-0"
          />
          <span className="text-sm text-gray-600 font-medium leading-relaxed">
            I accept the{" "}
            <Link
              href="/terms"
              className="text-[#3864D5] font-semibold hover:underline"
            >
              Terms & Conditions
            </Link>{" "}
            and confirm all information provided is accurate.
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-xs text-red-500 font-medium pl-6">
            {errors.acceptTerms}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#E8192C] hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-[14px] transition-all shadow-md shadow-red-200 mt-1"
      >
        {loading ? (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        ) : (
          <>
            <Stethoscope size={15} />
            Submit For Verification
            <ArrowRight size={15} />
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-bold text-[#3864D5] hover:text-[#2450B0] transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-xs font-bold text-[#3864D5] uppercase tracking-widest">
        {children}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}
