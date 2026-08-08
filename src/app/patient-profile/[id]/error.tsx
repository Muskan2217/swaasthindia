"use client";

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-600 font-medium">
        Something went wrong while loading the patient profile.
      </p>
    </div>
  );
}