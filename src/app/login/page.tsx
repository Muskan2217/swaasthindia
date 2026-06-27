// src/app/login/page.tsx

import type { Metadata } from "next";
import Image from "next/image";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login – Swaasth India",
  description: "Sign in to access your Swaasth India healthcare dashboard.",
};

function LeftPanel() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/site-logo.png"
            alt="Swaasth India"
            width={48}
            height={48}
            className="object-contain"
          />

          <div>
            <h2 className="text-2xl font-bold">Swaasth India</h2>
            <p className="text-sm text-white/80">
              Trusted Digital Healthcare Platform
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold leading-tight mb-4">
          Welcome Back
        </h2>

        <p className="text-white/80 text-base leading-relaxed mb-8">
          Access your healthcare dashboard securely. Book appointments,
          consult verified doctors, view prescriptions and manage your health
          records from one place.
        </p>

        <ul className="space-y-4">
          {[
            {
              icon: "🩺",
              text: "Connect with verified doctors across India",
            },
            {
              icon: "📋",
              text: "Access your complete health records anytime",
            },
            {
              icon: "💊",
              text: "Digital prescriptions & lab test management",
            },
            {
              icon: "🔒",
              text: "Your medical information is fully encrypted",
            },
          ].map((item) => (
            <li key={item.text} className="flex items-start gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-white/85 leading-relaxed">
                {item.text}
              </span>
            </li>
          ))}
        </ul>

        
      </div>

      

      {/* Real illustration */}
      {/* <div className="mt-10 flex justify-center">
        <Image
          src="/auth/login-illustration.png"
          alt="Healthcare Illustration"
          width={340}
          height={260}
          priority
          className="object-contain"
        />
      </div>
    </div> */}

     {/* Illustration */}
      <div className="mt-8 flex justify-center">
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          {/* Doctor */}
          <circle cx="80" cy="44" r="22" fill="white" opacity="0.15"/>
          <circle cx="80" cy="44" r="18" fill="#FDDBB4"/>
          <path d="M62 42 Q63 30 80 30 Q97 30 98 42 Q94 34 80 34 Q66 34 62 42Z" fill="#2D1B0E"/>
          <ellipse cx="80" cy="90" rx="28" ry="22" fill="white" opacity="0.2"/>
          <ellipse cx="80" cy="90" rx="24" ry="18" fill="white" opacity="0.15"/>
          <path d="M72 62 L80 78 L88 62 Q86 60 80 60 Q74 60 72 62Z" fill="white" opacity="0.5"/>
          {/* Stethoscope */}
          <circle cx="96" cy="84" r="5" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
          <path d="M96 79 Q96 74 90 74" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
          {/* Patient phone */}
          <rect x="130" y="30" width="44" height="76" rx="8" fill="white" opacity="0.15"/>
          <rect x="134" y="38" width="36" height="60" rx="4" fill="white" opacity="0.1"/>
          <circle cx="148" cy="58" r="12" fill="white" opacity="0.2"/>
          <circle cx="148" cy="58" r="8" fill="white" opacity="0.15"/>
          <rect x="136" y="76" width="32" height="4" rx="2" fill="white" opacity="0.2"/>
          <rect x="136" y="84" width="24" height="4" rx="2" fill="white" opacity="0.15"/>
          {/* Heart */}
          <path d="M100 30 A6 6 0 0 1 112 30 A6 6 0 0 1 112 30 C112 36 106 42 106 42 C106 42 100 36 100 30Z" fill="#E8192C" opacity="0.7"/>
          {/* Plus signs */}
          <text x="20" y="30" fill="white" opacity="0.3" fontSize="18" fontWeight="300">+</text>
          <text x="168" y="28" fill="white" opacity="0.3" fontSize="14" fontWeight="300">+</text>
          <text x="46" y="140" fill="white" opacity="0.2" fontSize="12" fontWeight="300">+</text>
        </svg>
      </div>
    </div>
  );
}
 



//   );
// }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col">
      <Navbar />

      <main className="flex-1">
        <AuthLayout leftPanel={<LeftPanel />} maxWidth="lg">
          <LoginForm />
        </AuthLayout>
      </main>

      <Footer />
    </div>



  );
}