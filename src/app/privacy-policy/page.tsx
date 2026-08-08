import LegalPage from "@/components/common/LegalPage";
import { Mail, Phone, MapPin, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Shield className="h-4 w-4 text-blue-600" />
        <span>
          <strong>Effective Date:</strong> 1 August 2026
        </span>
      </div>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        1. Information We Collect
      </h2>

      <p className="text-gray-700 leading-7">
        We may collect:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Name, phone number, email address, and address.</li>
        <li>Date of birth and gender.</li>
        <li>Appointment and medical service information.</li>
        <li>Prescription and medicine order details.</li>
        <li>Payment and transaction information.</li>
        <li>Device and usage information.</li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        2. How We Use Your Information
      </h2>

      <p className="text-gray-700 leading-7">
        We use your information to:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Book doctor appointments and diagnostic tests.</li>
        <li>Process medicine orders.</li>
        <li>Provide customer support.</li>
        <li>Improve our services.</li>
        <li>Comply with legal and regulatory requirements.</li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        3. Sharing of Information
      </h2>

      <p className="text-gray-700 leading-7">
        We may share your information with:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Doctors and healthcare providers.</li>
        <li>Diagnostic laboratories.</li>
        <li>Pharmacies and delivery partners.</li>
        <li>Payment service providers.</li>
        <li>Government authorities when required by law.</li>
      </ul>

      <p className="text-gray-700 leading-7 mt-4">
        We do not sell your personal information to third parties.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        4. Data Security
      </h2>

      <p className="text-gray-700 leading-7">
        We take reasonable measures to protect your information from
        unauthorized access, misuse, or disclosure. However, no
        internet-based service can guarantee complete security.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        5. User Rights
      </h2>

      <p className="text-gray-700 leading-7">
        You may request correction or deletion of inaccurate personal
        information, subject to legal and regulatory requirements.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        6. Cookies and Analytics
      </h2>

      <p className="text-gray-700 leading-7">
        Our website and application may use cookies and similar
        technologies to improve user experience and analyse platform
        performance.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        7. Third-Party Services
      </h2>

      <p className="text-gray-700 leading-7">
        Our platform may contain links to third-party websites or
        services. We are not responsible for their privacy practices
        or content.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        8. Children's Privacy
      </h2>

      <p className="text-gray-700 leading-7">
        Our services are not intended for children under 18 years of
        age without parental or guardian supervision.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        9. Changes to This Policy
      </h2>

      <p className="text-gray-700 leading-7">
        We may update this Privacy Policy from time to time. Updated
        versions will be posted on our platform.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        10. Contact Us
      </h2>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-6">

        <div>
          <h3 className="text-xl font-bold text-[#0D1B3E]">
            Swaasth India
          </h3>

          <p className="text-gray-600 mt-2">
            If you have any questions regarding this Privacy Policy,
            please contact us using the details below.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-600 mt-1" />

          <div>
            <p className="font-semibold">General Email</p>

            <a
              href="mailto:swaasthindia@gmail.com"
              className="text-blue-600 hover:underline"
            >
              swaasthindia@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-600 mt-1" />

          <div>
            <p className="font-semibold">Support Email</p>

            <a
              href="mailto:swaasthindiasupport@gmail.com"
              className="text-blue-600 hover:underline"
            >
              swaasthindiasupport@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-green-600 mt-1" />

          <div>
            <p className="font-semibold">Phone</p>

            <a
              href="tel:+916397673470"
              className="block text-blue-600 hover:underline"
            >
              +91 6397673470
            </a>

            <a
              href="tel:+918534988633"
              className="block text-blue-600 hover:underline"
            >
              +91 8534988633
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-red-500 mt-1" />

          <div>
            <p className="font-semibold">Address</p>

            <a
              href="https://maps.google.com/?q=Shanti+Colony+Etawah+Uttar+Pradesh+India"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Shanti Colony, Etawah, Uttar Pradesh, India
            </a>
          </div>
        </div>

      </div>
    </LegalPage>
  );
}