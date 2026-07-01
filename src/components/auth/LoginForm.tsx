// src/components/auth/LoginForm.tsx
"use client";
import { login } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  AlertCircle,
  ArrowRight,
  User,
  Stethoscope,
} from "lucide-react";
import {
  LOGIN_FORM_DEFAULTS,
  type LoginFormData,
  validateLogin,
  type UserRole,
} from "@/lib/auth-dummy-data";
import { InputField, PasswordField } from "./FormField";

interface LoginFormErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

function validate(data: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};
  if (!data.identifier.trim()) {
    errors.identifier = "Mobile number or email is required.";
  }
  if (!data.password) {
    errors.password = "Password is required.";
  }
  return errors;
}

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormData>(LOGIN_FORM_DEFAULTS);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof LoginFormData) => (v: string | boolean) =>
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

    // Simulate network latency — replace with: await fetch('/api/auth/login', ...)
    await new Promise((r) => setTimeout(r, 800));

try {
  const result = await login({
    login: form.identifier,
    password: form.password,
  });

  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));

 if (result.user.role === "doctor") {
  router.push("/doctor-dashboard");
} else {
  router.push("/patient-dashboard");
}
} catch (err: any) {
  setErrors({
    general: err.message || "Invalid credentials",
  });
} finally {
  setLoading(false);
}
  };

  const continueAs = (role: UserRole) => {
    // Quick-login with demo credentials
    const creds: Record<UserRole, { id: string; pw: string }> = {
      patient: { id: "patient@swaasth.in", pw: "patient123" },
      doctor: { id: "doctor@swaasth.in", pw: "doctor123" },
    };
    const user = validateLogin(creds[role].id, creds[role].pw);
    if (user) router.push(user.redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D1B3E] mb-1">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500">
          Sign in to your Swaasth India account.
        </p>
      </div>

      {/* General error */}
      {errors.general && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          <AlertCircle
            size={16}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-red-600 font-medium">{errors.general}</p>
        </div>
      )}

      <InputField
        label="Mobile Number or Email"
        placeholder="9876543210 or name@email.com"
        value={form.identifier}
        onChange={set("identifier")}
        error={errors.identifier}
        required
        icon={<Phone size={15} />}
        autoComplete="username"
      />

      <div className="flex flex-col gap-1">
        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          required
        />
        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) => set("rememberMe")(e.target.checked)}
              className="w-4 h-4 accent-[#3864D5] rounded"
            />
            <span className="text-sm text-gray-600 font-medium">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-[#3864D5] hover:text-[#2450B0] transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Primary login */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#3864D5] hover:bg-[#2450B0] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-[14px] transition-all duration-150 shadow-md shadow-blue-200"
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
            Login <ArrowRight size={15} />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">
          or continue as
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Quick-login buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => continueAs("patient")}
          className="flex items-center justify-center gap-2 border-2 border-[#3864D5]/25 text-[#3864D5] font-semibold text-sm py-3 rounded-[14px] hover:bg-[#EEF2FF] hover:border-[#3864D5]/50 transition-all"
        >
          <User size={15} />
          Patient
        </button>
        <button
          type="button"
          onClick={() => continueAs("doctor")}
          className="flex items-center justify-center gap-2 border-2 border-[#3864D5]/25 text-[#3864D5] font-semibold text-sm py-3 rounded-[14px] hover:bg-[#EEF2FF] hover:border-[#3864D5]/50 transition-all"
        >
          <Stethoscope size={15} />
          Doctor
        </button>
      </div>

      {/* Create account */}
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#3864D5] hover:text-[#2450B0] transition-colors"
        >
          Create Account
        </Link>
      </p>

      {/* Demo hint */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
        <p className="text-xs text-[#3864D5] font-semibold mb-0.5">
          Demo credentials
        </p>
        <p className="text-xs text-gray-600">
          Patient: patient@swaasth.in / patient123
        </p>
        <p className="text-xs text-gray-600">
          Doctor: doctor@swaasth.in / doctor123
        </p>
      </div>
    </form>
  );
}
