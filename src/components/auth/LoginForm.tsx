// src/components/auth/LoginForm.tsx
"use client";
import { login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
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
  const { login: saveLogin } = useAuth();
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


try {
  const result = await login({
    login: form.identifier,
    password: form.password,
  });

// Save authenticated user in global auth context
saveLogin(result.token, result.user);

// Redirect user based on role
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

   
    </form>
  );
}
