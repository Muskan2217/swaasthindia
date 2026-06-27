// src/components/auth/FormField.tsx
"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "tel" | "number";
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  autoComplete?: string;
}

interface PasswordFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}

const fieldBase =
  "w-full px-4 py-3 rounded-[14px] border border-[#E5E7EB] bg-[#F7F8FC] text-[#0D1B3E] text-sm font-medium placeholder-gray-400 outline-none focus:border-[#3864D5] focus:bg-white focus:ring-2 focus:ring-[#3864D5]/10 transition-all duration-150";

const errorClass = "!border-red-400 !bg-red-50 focus:!ring-red-200";

export function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
  icon,
  autoComplete,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#0D1B3E]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={`${fieldBase} ${icon ? "pl-10" : ""} ${error ? errorClass : ""}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export function PasswordField({
  label,
  placeholder = "Enter password",
  value,
  onChange,
  error,
  required,
  autoComplete = "current-password",
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#0D1B3E]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={`${fieldBase} pr-12 ${error ? errorClass : ""}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  error,
  required,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#0D1B3E]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldBase} appearance-none cursor-pointer ${error ? errorClass : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

interface FileUploadFieldProps extends BaseFieldProps {
  accept?: string;
  hint?: string;
  fileName?: string;
  onChange: (file: File | null) => void;
}

export function FileUploadField({
  label,
  accept = "image/*,.pdf",
  hint,
  fileName,
  onChange,
  error,
  required,
}: FileUploadFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#0D1B3E]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <label
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-[14px] px-4 py-5 cursor-pointer transition-all duration-150 ${
          error
            ? "border-red-400 bg-red-50"
            : "border-[#E5E7EB] bg-[#F7F8FC] hover:border-[#3864D5] hover:bg-blue-50/30"
        }`}
      >
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center">
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="#3864D5"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        </div>
        {fileName ? (
          <p className="text-sm font-semibold text-[#3864D5] text-center break-all">
            {fileName}
          </p>
        ) : (
          <div className="text-center">
            <p className="text-sm font-semibold text-[#3864D5]">Click to upload</p>
            {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
          </div>
        )}
      </label>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}