// src/components/auth/PatientSignupForm.tsx
"use client";
import { registerPatient } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  PATIENT_SIGNUP_DEFAULTS,
  type PatientSignupFormData,
} from "@/lib/auth-dummy-data";
import { InputField, PasswordField } from "./FormField";

interface Errors extends Partial<Record<keyof PatientSignupFormData, string>> {
  general?: string;
}

function validate(data: PatientSignupFormData): Errors {
  const errors: Errors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required.";
  if (!/^\d{10}$/.test(data.mobile))
    errors.mobile = "Enter a valid 10-digit mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address.";
  if (!data.address.trim())
  errors.address = "Address is required.";
  if (data.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  if (!data.acceptTerms)
    errors.acceptTerms = "You must accept the Terms & Conditions.";
  return errors;
}

export default function PatientSignupForm() {
  const router = useRouter();
  const [form, setForm] = useState<PatientSignupFormData>(
    PATIENT_SIGNUP_DEFAULTS,
  );
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof PatientSignupFormData) => (v: string | boolean) =>
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

  try {
    await registerPatient({
      name: form.fullName,
      email: form.email,
      mobile: form.mobile,
      address: form.address,
      password: form.password,
      password_confirmation: form.confirmPassword,
      role: "patient",
    });

    router.push("/login?registered=patient");
  } catch (err: any) {
    if (err.errors) {
      setErrors({
        fullName: err.errors.name?.[0],
        email: err.errors.email?.[0],
        mobile: err.errors.mobile?.[0],
        address: err.errors.address?.[0],
        password: err.errors.password?.[0],
        confirmPassword: err.errors.password_confirmation?.[0],
        general: err.message,
      });
    } else {
      setErrors({
        general: "Something went wrong. Please try again.",
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
          Patient Registration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create your account to access healthcare services.
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

      <InputField
        label="Full Name"
        placeholder="Rahul Verma"
        value={form.fullName}
        onChange={set("fullName")}
        error={errors.fullName}
        required
        icon={<User size={15} />}
        autoComplete="name"
      />

      <InputField
        label="Mobile Number"
        type="tel"
        placeholder="mobile number"
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
        placeholder="name@example.com"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
        required
        icon={<Mail size={15} />}
        autoComplete="email"
      />

     <InputField
  label="Address"
  placeholder="Enter your address"
  value={form.address}
  onChange={set("address")}
  error={errors.address}
  required
  autoComplete="street-address"
/>

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
        placeholder="Re-enter your password"
        value={form.confirmPassword}
        onChange={set("confirmPassword")}
        error={errors.confirmPassword}
        required
        autoComplete="new-password"
      />

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
            and{" "}
            <Link
              href="/privacy"
              className="text-[#3864D5] font-semibold hover:underline"
            >
              Privacy Policy
            </Link>
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
        className="w-full flex items-center justify-center gap-2 bg-[#3864D5] hover:bg-[#2450B0] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-[14px] transition-all shadow-md shadow-blue-200 mt-1"
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
            <CheckCircle2 size={15} />
            Create Patient Account
            <ArrowRight size={15} />
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
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
