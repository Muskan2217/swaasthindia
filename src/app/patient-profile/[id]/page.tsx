"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getPatientProfile,
  updatePatientProfile,
} from "@/lib/api";

type Patient = {
  id: number;
  name: string;
  email: string;
  mobile?: string | null;
  patient_code: string;

  age?: number | null;
  gender?: string | null;
  height?: string | number | null;
  weight?: string | number | null;
  blood_group?: string | null;

  allergies?: string | null;
  medical_conditions?: string | null;
  current_medications?: string | null;

  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;

  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;

  profile_image?: string | null;
  created_at?: string | null;
};

type FormState = {
  name: string;
  mobile: string;
  email: string;

  age: string;
  gender: string;
  height: string;
  weight: string;
  blood_group: string;

  allergies: string;
  medical_conditions: string;
  current_medications: string;

  emergency_contact_name: string;
  emergency_contact_phone: string;

  address: string;
  city: string;
  state: string;
  pincode: string;
};

const emptyForm: FormState = {
  name: "",
  mobile: "",
  email: "",

  age: "",
  gender: "",
  height: "",
  weight: "",
  blood_group: "",

  allergies: "",
  medical_conditions: "",
  current_medications: "",

  emergency_contact_name: "",
  emergency_contact_phone: "",

  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function PatientProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
  if (!token || !id) return;

  const authToken = token; // Local constant created for TS narrowing

  async function loadProfile() {
    try {
      const data = await getPatientProfile(String(id), authToken);

      setPatient(data);

      setForm({
        name: data.name ?? "",
        mobile: data.mobile ?? "",
        email: data.email ?? "",

        age: data.age == null ? "" : String(data.age),
        gender: data.gender ?? "",
        height: data.height == null ? "" : String(data.height),
        weight: data.weight == null ? "" : String(data.weight),
        blood_group: data.blood_group ?? "",

        allergies: data.allergies ?? "",
        medical_conditions: data.medical_conditions ?? "",
        current_medications: data.current_medications ?? "",

        emergency_contact_name: data.emergency_contact_name ?? "",
        emergency_contact_phone: data.emergency_contact_phone ?? "",

        address: data.address ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        pincode: data.pincode ?? "",
      });

      // Restore saved profile image after refresh/navigation
      setImagePreview(data.profile_image ?? null);
    } catch (error) {
      console.error("Failed to load patient profile:", error);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }

  loadProfile();
}, [id, token]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function startEditing() {
    if (!patient) return;

    setForm({
      name: patient.name ?? "",
      mobile: patient.mobile ?? "",
      email: patient.email ?? "",

      age: patient.age == null ? "" : String(patient.age),
      gender: patient.gender ?? "",
      height: patient.height == null ? "" : String(patient.height),
      weight: patient.weight == null ? "" : String(patient.weight),
      blood_group: patient.blood_group ?? "",

      allergies: patient.allergies ?? "",
      medical_conditions: patient.medical_conditions ?? "",
      current_medications: patient.current_medications ?? "",

      emergency_contact_name: patient.emergency_contact_name ?? "",
      emergency_contact_phone: patient.emergency_contact_phone ?? "",

      address: patient.address ?? "",
      city: patient.city ?? "",
      state: patient.state ?? "",
      pincode: patient.pincode ?? "",
    });

    setSelectedImage(null);
    setEditing(true);
  }

  function cancelEditing() {
    if (!patient) return;

    setForm({
      name: patient.name ?? "",
      mobile: patient.mobile ?? "",
      email: patient.email ?? "",

      age: patient.age == null ? "" : String(patient.age),
      gender: patient.gender ?? "",
      height: patient.height == null ? "" : String(patient.height),
      weight: patient.weight == null ? "" : String(patient.weight),
      blood_group: patient.blood_group ?? "",

      allergies: patient.allergies ?? "",
      medical_conditions: patient.medical_conditions ?? "",
      current_medications: patient.current_medications ?? "",

      emergency_contact_name: patient.emergency_contact_name ?? "",
      emergency_contact_phone: patient.emergency_contact_phone ?? "",

      address: patient.address ?? "",
      city: patient.city ?? "",
      state: patient.state ?? "",
      pincode: patient.pincode ?? "",
    });

    setImagePreview(patient.profile_image ?? null);
    setSelectedImage(null);
    setEditing(false);
  }

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!token) return;

    try {
      setSaving(true);

      /*
       * Text profile data is saved through the existing PATCH API.
       *
       * Profile image will be sent after the Laravel endpoint
       * is upgraded to accept multipart/form-data.
       */
      const updated = await updatePatientProfile(token, {
        name: form.name,
        mobile: form.mobile,

        age: form.age === "" ? null : Number(form.age),
        gender: form.gender || null,

        height: form.height === "" ? null : Number(form.height),
        weight: form.weight === "" ? null : Number(form.weight),

        blood_group: form.blood_group || null,

        allergies: form.allergies || null,
        medical_conditions: form.medical_conditions || null,
        current_medications: form.current_medications || null,

        emergency_contact_name:
          form.emergency_contact_name || null,

        emergency_contact_phone:
          form.emergency_contact_phone || null,

        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        pincode: form.pincode || null,
        profile_image: selectedImage,
      });

      setPatient((previous) => ({
        ...previous!,
        ...updated,
        profile_image:
          imagePreview ?? previous?.profile_image ?? null,
      }));

      setEditing(false);
      setSelectedImage(null);
    } catch (error) {
      console.error("Failed to update patient profile:", error);
      alert("Profile update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-3 text-sm text-slate-500">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (!patient) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">
            Patient profile not found
          </h1>

          <button
            onClick={() => router.push("/patient-dashboard")}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">

        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="flex h-24 items-center border-b border-slate-100 px-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                  ♥
                </div>

                <span className="text-xl font-extrabold">
                  <span className="text-red-600">Swaasth</span>{" "}
                  <span className="text-blue-700">India</span>
                </span>
              </div>

              <div className="ml-12 mt-1 inline-block rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-600">
                Patient Portal
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">

            <SidebarLink
              href="/patient-dashboard"
              icon="⌂"
              label="Dashboard"
            />

            <SidebarLink
              href="/patient-dashboard"
              icon="▣"
              label="My Appointments"
            />

            <SidebarLink
              href="/doctor-listing"
              icon="▦"
              label="Book Appointment"
            />

            <SidebarLink
              href="/patient-dashboard"
              icon="▤"
              label="Prescriptions"
            />

            <SidebarLink
              href="/patient-dashboard"
              icon="▥"
              label="Reports"
            />

            <div className="pt-3">
              <div className="flex items-center gap-3 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-red-100">
                <span>♙</span>
                <span>My Profile</span>
              </div>
            </div>


          </nav>

          <div className="border-t border-slate-100 p-3">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <span>↪</span>
              Logout
            </button>
          </div>

        </div>
      </aside>


      {/* Main */}
      <main className="lg:pl-64">

        {/* Top Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">

          <div className="flex min-h-20 items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Hey, {patient.name}   Welcome
                </h1>

                {editing && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                    Edit Mode – For Patient
                  </span>
                )}
              </div>

               <p className="mt-1 text-sm text-slate-500">
                Manage your personal information and health details
              </p> 

               {!editing && (
  <button
    type="button"
    onClick={startEditing}
    className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
  >
    Edit Profile
  </button>
)}
            </div>

            <div className="hidden items-center gap-4 sm:flex">


              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-blue-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={patient.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-blue-700">
                      {patient.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {patient.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {patient.patient_code}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </header>


        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <form onSubmit={handleSave}>

            <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">

              {/* Profile Card */}
              <section className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex flex-col items-center">

                  <div className="relative">

                    <div className="h-40 w-40 overflow-hidden rounded-full bg-gradient-to-br from-red-50 to-blue-50 ring-8 ring-slate-50">

                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt={patient.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-blue-700">
                          {patient.name.charAt(0)}
                        </div>
                      )}

                    </div>

                    {editing && (
                      <>
                        <button
                          type="button"
                          onClick={handleImageClick}
                          className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-lg text-white shadow-lg hover:bg-blue-700"
                          title="Change profile photo"
                        >
                          📷
                        </button>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </>
                    )}

                  </div>

                  <h2 className="mt-5 text-xl font-extrabold text-slate-900">
                    {patient.name}
                  </h2>

                  <span className="mt-2 rounded-full bg-red-50 px-4 py-1 text-xs font-bold text-red-600">
                    {patient.patient_code}
                  </span>

                </div>


                <div className="mt-6 rounded-2xl bg-blue-50 p-4">

                  <MiniContact
                    icon="☎"
                    value={patient.mobile || "Not added"}
                  />

                  <MiniContact
                    icon="✉"
                    value={patient.email || "Not added"}
                  />

                  <MiniContact
                    icon="▣"
                    value={
                      patient.created_at
                        ? new Date(patient.created_at).toLocaleDateString()
                        : "—"
                    }
                  />

                </div>

                {editing && (
                  <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                    Click the camera button to choose a profile photo.
                    Maximum recommended size: 5MB.
                  </p>
                )}

              </section>


              {/* Profile Information */}
              <div className="space-y-6">

                {/* Personal */}
                <ProfileCard
                  title="Personal Information"
                  accent="blue"
                >

                  <div className="grid gap-5 md:grid-cols-3">

                    <Field
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      editing={editing}
                    />

                    <Field
                      label="Age"
                      name="age"
                      type="number"
                      value={form.age}
                      onChange={handleChange}
                      editing={editing}
                    />

                    <Field
                      label="Mobile Number"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      editing={editing}
                    />

                    <SelectField
                      label="Gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      editing={editing}
                      options={[
                        ["", "Select Gender"],
                        ["Male", "Male"],
                        ["Female", "Female"],
                        ["Other", "Other"],
                        ["Prefer not to say", "Prefer not to say"],
                      ]}
                    />

                    <Field
                      label="Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      editing={false}
                    />

                  </div>

                </ProfileCard>


                {/* Health */}
                <ProfileCard
                  title="Health Information"
                  accent="red"
                >

                  <div className="grid gap-5 md:grid-cols-3">

                    <SelectField
                      label="Blood Group"
                      name="blood_group"
                      value={form.blood_group}
                      onChange={handleChange}
                      editing={editing}
                      options={[
                        ["", "Select Blood Group"],
                        ["A+", "A+"],
                        ["A-", "A-"],
                        ["B+", "B+"],
                        ["B-", "B-"],
                        ["AB+", "AB+"],
                        ["AB-", "AB-"],
                        ["O+", "O+"],
                        ["O-", "O-"],
                        ["Unknown", "Unknown"],
                      ]}
                    />

                    <Field
                      label="Height (cm)"
                      name="height"
                      type="number"
                      value={form.height}
                      onChange={handleChange}
                      editing={editing}
                    />

                    <Field
                      label="Weight (kg)"
                      name="weight"
                      type="number"
                      value={form.weight}
                      onChange={handleChange}
                      editing={editing}
                    />

                    <div className="md:col-span-3">
                      <Field
                        label="Allergies"
                        name="allergies"
                        value={form.allergies}
                        onChange={handleChange}
                        editing={editing}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <Field
                        label="Medical Conditions"
                        name="medical_conditions"
                        value={form.medical_conditions}
                        onChange={handleChange}
                        editing={editing}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <Field
                        label="Current Medications"
                        name="current_medications"
                        value={form.current_medications}
                        onChange={handleChange}
                        editing={editing}
                      />
                    </div>

                  </div>

                </ProfileCard>


                {/* Emergency */}
                <ProfileCard
                  title="Emergency Contact"
                  accent="blue"
                >

                  <div className="grid gap-5 md:grid-cols-2">

                    <Field
                      label="Contact Name"
                      name="emergency_contact_name"
                      value={form.emergency_contact_name}
                      onChange={handleChange}
                      editing={editing}
                    />

                    <Field
                      label="Contact Phone"
                      name="emergency_contact_phone"
                      value={form.emergency_contact_phone}
                      onChange={handleChange}
                      editing={editing}
                    />

                  </div>

                </ProfileCard>


                {/* Address */}
                <ProfileCard
                  title="Address"
                  accent="red"
                >

                  <div className="grid gap-5 md:grid-cols-3">

                    <div className="md:col-span-3">
                      <Field
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        editing={editing}
                        multiline
                      />
                    </div>

                    <Field
                      label="City"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      editing={editing}
                    />

                    <Field
                      label="State"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      editing={editing}
                    />

                    <Field
                      label="Pincode"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      editing={editing}
                    />

                  </div>

                </ProfileCard>


                {/* Bottom actions */}
                {editing && (
                  <div className="flex justify-end gap-3 pb-8">

                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded-xl border border-red-300 bg-white px-6 py-3 font-semibold text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-red-600 px-7 py-3 font-bold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                  </div>
                )}

              </div>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
}


/* -------------------------------------------------------
   Reusable UI components
------------------------------------------------------- */

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
    >
      <span className="w-5 text-center text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}


function MiniContact({
  icon,
  value,
}: {
  icon: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 text-sm text-slate-600">
      <span className="w-5 text-center text-blue-700">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}


function ProfileCard({
  title,
  accent,
  children,
}: {
  title: string;
  accent: "blue" | "red";
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            accent === "blue"
              ? "bg-blue-50 text-blue-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {accent === "blue" ? "♙" : "♡"}
        </div>

        <h2
          className={`text-lg font-bold ${
            accent === "blue"
              ? "text-blue-700"
              : "text-red-600"
          }`}
        >
          {title}
        </h2>

      </div>

      {children}
    </section>
  );
}


function Field({
  label,
  name,
  value,
  onChange,
  editing,
  type = "text",
  multiline = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  editing: boolean;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </label>

      {editing && name !== "email" ? (
        multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
          />
        ) : (
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
          />
        )
      ) : (
        <div className="min-h-[42px] rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700">
          {value || "—"}
        </div>
      )}

    </div>
  );
}


function SelectField({
  label,
  name,
  value,
  onChange,
  editing,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  editing: boolean;
  options: string[][];
}) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </label>

      {editing ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
        >
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
      ) : (
        <div className="min-h-[42px] rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700">
          {value || "—"}
        </div>
      )}

    </div>
  );
}