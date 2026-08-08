import LegalPage from "@/components/common/LegalPage";
import { FileText, Mail, Phone, MapPin } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <FileText className="h-4 w-4 text-blue-600" />
        <span>
          <strong>Effective Date:</strong> 1 August 2026
        </span>
      </div>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        1. Acceptance of Terms
      </h2>

      <p className="text-gray-700 leading-7">
        By accessing or using the Swaasth India website, mobile
        application, or any related services, you agree to comply with
        these Terms & Conditions. If you do not agree, please do not use
        our services.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        2. Services Provided
      </h2>

      <p className="text-gray-700 leading-7">
        Swaasth India provides an online healthcare platform that may
        include:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Doctor appointment booking.</li>
        <li>Online consultation scheduling.</li>
        <li>Diagnostic test booking.</li>
        <li>Medicine ordering services.</li>
        <li>Access to health-related information.</li>
      </ul>

      <p className="text-gray-700 leading-7 mt-4">
        We act only as a technology platform connecting users with
        healthcare providers and service partners.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        3. User Responsibilities
      </h2>

      <p className="text-gray-700 leading-7">
        Users agree to:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Provide accurate and complete information.</li>
        <li>Maintain the confidentiality of their account credentials.</li>
        <li>Use the platform only for lawful purposes.</li>
        <li>Not misuse, hack, or interfere with platform operations.</li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        4. Doctor & Healthcare Services
      </h2>

      <p className="text-gray-700 leading-7">
        Doctors and healthcare providers available through Swaasth India
        are independent professionals. Medical advice, diagnosis, and
        treatment remain the sole responsibility of the respective
        healthcare provider.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        5. Payments
      </h2>

      <p className="text-gray-700 leading-7">
        Certain services require payment. Users agree to pay all
        applicable consultation, diagnostic, medicine, or service fees
        before confirmation of the requested service.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        6. Appointment Cancellation & Refund
      </h2>

      <p className="text-gray-700 leading-7">
        Appointment cancellations, rescheduling, and refunds are subject
        to the cancellation policies of the respective doctor,
        laboratory, or healthcare provider.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        7. Limitation of Liability
      </h2>

      <p className="text-gray-700 leading-7">
        Swaasth India shall not be liable for:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Medical decisions taken by healthcare professionals.</li>
        <li>Delays or cancellation of appointments.</li>
        <li>Errors caused by incorrect information provided by users.</li>
        <li>Service interruptions beyond our reasonable control.</li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        8. Intellectual Property
      </h2>

      <p className="text-gray-700 leading-7">
        All content, logos, graphics, software, and materials available
        on Swaasth India are the intellectual property of Swaasth India
        and may not be copied, modified, or redistributed without prior
        written permission.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        9. Changes to Terms
      </h2>

      <p className="text-gray-700 leading-7">
        We reserve the right to modify these Terms & Conditions at any
        time. Updated versions will be published on our platform and
        become effective immediately upon publication.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        10. Governing Law
      </h2>

      <p className="text-gray-700 leading-7">
        These Terms & Conditions shall be governed by and interpreted in
        accordance with the laws of India. Any disputes shall be subject
        to the jurisdiction of the competent courts in Uttar Pradesh,
        India.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-[#0D1B3E]">
        11. Contact Us
      </h2>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#0D1B3E]">
            Swaasth India
          </h3>

          <p className="text-gray-600 mt-2">
            For any questions regarding these Terms & Conditions, please
            contact us.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <a
              href="mailto:swaasthindia@gmail.com"
              className="text-blue-600 hover:underline"
            >
              swaasthindia@gmail.com
            </a>
            <br />
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