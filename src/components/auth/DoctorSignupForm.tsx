// src/components/auth/DoctorSignupForm.tsx
//
// ⚠️ REQUIRES auth-dummy-data.ts UPDATE — see companion file below.
// DoctorSignupFormData must include: qualification (already present),
// registrationCertificate: File | null, identityProof: File | null
"use client";
import { registerUser } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Stethoscope,
  Building2,
  Hash,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  DOCTOR_SIGNUP_DEFAULTS,
  SPECIALIZATIONS,
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

// NOTE: city, state, consultationFee, languages are intentionally NOT collected
// at signup. Doctor fills these later from the profile-edit screen after
// admin approval. Qualification and all documents (except profile photo)
// ARE required at signup per production requirements.
function validate(data: DoctorSignupFormData): Errors {
  const errors: Errors = {};

  // Personal Details
  if (!data.fullName.trim()) errors.fullName = "Full name is required.";

  if (!/^\d{10}$/.test(data.mobile))
    errors.mobile = "Enter a valid 10-digit mobile number.";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address.";

  if (!data.address.trim()) errors.address = "Address is required.";

  if (data.password.length < 6)
    errors.password = "Password must be at least 6 characters.";

  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";

  // Professional Details
  if (!data.specialization)
    errors.specialization = "Please select a specialization.";

  if (!data.experience) errors.experience = "Experience is required.";

  if (!data.qualification.trim())
    errors.qualification = "Qualification is required.";

  if (!data.clinicName.trim())
    errors.clinicName = "Clinic / Hospital name is required.";

  if (!data.registrationNumber.trim())
    errors.registrationNumber = "Medical registration number is required.";

  // Documents — Registration Certificate, Degree Certificate, Identity Proof
  // are mandatory. Profile Photo remains optional.
  if (!data.registrationCertificate)
    errors.registrationCertificate = "Registration certificate is required.";

  if (!data.degreeCertificate)
    errors.degreeCertificate = "Degree certificate is required.";

  if (!data.identityProof)
    errors.identityProof = "Identity proof is required.";

  // Terms
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

    console.log("✅ SUBMIT CLICKED");
    console.log("Form Data:", form);

    const errs = validate(form);

    console.log("Validation Errors:", errs);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setLoading(false);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      console.log("📤 Calling registerUser API...");

      // Field names below match Laravel's AuthController@register exactly.
      // city, state, consultation_fee, languages are deliberately NOT sent —
      // doctor adds these later via profile edit after admin approval.
      const response = await registerUser({
        name: form.fullName,
        email: form.email,
        mobile: form.mobile,
        address: form.address,
        password: form.password,
        password_confirmation: form.confirmPassword,
        role: "doctor",

        specialization: form.specialization,
        experience_years: Number(form.experience),
        hospital_name: form.clinicName,
        qualification: form.qualification,
        registration_number: form.registrationNumber,

        registration_certificate: form.registrationCertificate,
        degree_certificate: form.degreeCertificate,
        identity_proof: form.identityProof,
        profile_photo: form.profilePhoto, // optional — may be null
      });

      console.log("✅ Registration Success:", response);

      router.push("/pending-approval");
    } catch (err: any) {
      console.error("❌ API Error:", err);

      // Laravel 422 responses look like:
      // { message: "...", errors: { field_name: ["msg1", "msg2"] } }
      // Map each backend field error onto the matching form field so the
      // user sees it inline, instead of only a generic banner message.
      if (err?.errors && typeof err.errors === "object") {
        const fieldMap: Record<string, keyof DoctorSignupFormData> = {
          name: "fullName",
          email: "email",
          mobile: "mobile",
          address: "address",
          password: "password",
          specialization: "specialization",
          experience_years: "experience",
          hospital_name: "clinicName",
          qualification: "qualification",
          registration_number: "registrationNumber",
          registration_certificate: "registrationCertificate",
          degree_certificate: "degreeCertificate",
          identity_proof: "identityProof",
          profile_photo: "profilePhoto",
        };

        const mappedErrors: Errors = {};
        Object.entries(err.errors).forEach(([backendField, messages]) => {
          const frontendField = fieldMap[backendField];
          const message = Array.isArray(messages) ? messages[0] : String(messages);
          if (frontendField) {
            mappedErrors[frontendField] = message;
          } else {
            // Unknown field — surface it in the general banner so it's not lost
            mappedErrors.general = mappedErrors.general
              ? `${mappedErrors.general} ${message}`
              : message;
          }
        });

        setErrors(mappedErrors);
      } else {
        setErrors({
          general:
            err?.message ||
            err?.error ||
            "Registration failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
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
          <AlertCircle size={15} className="text-red-500 mt-0.5" />
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <SectionLabel>Personal Details</SectionLabel>

      <InputField
        label="Full Name"
        placeholder="Dr. Full Name"
        value={form.fullName}
        onChange={set("fullName")}
        error={errors.fullName}
        required
        icon={<User size={15} />}
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
        />

        <InputField
          label="Email Address"
          type="email"
          placeholder="doctor@example.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          required
          icon={<Mail size={15} />}
        />
      </div>

      <InputField
        label="Address"
        placeholder="Enter your address"
        value={form.address}
        onChange={set("address")}
        error={errors.address}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PasswordField
          label="Password"
          placeholder="Min. 6 characters"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          required
        />

        <PasswordField
          label="Confirm Password"
          placeholder="Re-enter password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword}
          required
        />
      </div>

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

        <InputField
          label="Experience (Years)"
          type="number"
          placeholder="5"
          value={form.experience}
          onChange={set("experience")}
          error={errors.experience}
          required
        />
      </div>

      <InputField
        label="Qualification"
        placeholder="MBBS, MD"
        value={form.qualification}
        onChange={set("qualification")}
        error={errors.qualification}
        required
      />

      <InputField
        label="Clinic / Hospital Name"
        placeholder="ABC Hospital"
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

      {/*
        City, State, Consultation Fee, Languages are intentionally removed
        from signup. Doctor completes these later from the profile-edit
        screen after admin approval.
      */}

      <SectionLabel>Document Uploads</SectionLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadField
          label="Medical Registration Certificate"
          accept="image/*,.pdf"
          hint="PDF or image up to 10 MB"
          fileName={form.registrationCertificate?.name}
          onChange={(f) => set("registrationCertificate")(f)}
          error={errors.registrationCertificate}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadField
          label="Identity Proof"
          accept="image/*,.pdf"
          hint="Aadhaar / PAN / Passport — PDF or image up to 10 MB"
          fileName={form.identityProof?.name}
          onChange={(f) => set("identityProof")(f)}
          error={errors.identityProof}
          required
        />

        <FileUploadField
          label="Profile Photo"
          accept="image/*"
          hint="Optional — JPG, PNG up to 5 MB"
          fileName={form.profilePhoto?.name}
          onChange={(f) => set("profilePhoto")(f)}
          error={errors.profilePhoto}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={(e) => set("acceptTerms")(e.target.checked)}
          />
          <span className="text-sm">
            I accept the{" "}
            <Link href="/terms" className="text-[#3864D5] font-semibold">
              Terms & Conditions
            </Link>
          </span>
        </label>

        {errors.acceptTerms && (
          <p className="text-xs text-red-500">{errors.acceptTerms}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#E8192C] text-white font-semibold py-3.5 rounded-[14px] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit For Verification"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[#3864D5]">
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