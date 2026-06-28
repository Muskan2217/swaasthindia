// src/app/pending-approval/page.tsx
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import PendingApprovalCard from "@/components/auth/PendingApprovalCard";

export const metadata: Metadata = {
  title: "Verification Pending – Swaasth India",
  description:
    "Your doctor profile is under review. We'll notify you once approved.",
};

export default function PendingApprovalPage() {
  return (
    <AuthLayout maxWidth="sm">
      <PendingApprovalCard />
    </AuthLayout>
  );
}
