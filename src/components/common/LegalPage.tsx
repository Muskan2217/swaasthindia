import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface LegalPageProps {
  title: string;
  children?: React.ReactNode;
}

export default function LegalPage({
  title,
  children,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#0D1B3E] to-[#3864D5] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="mt-3 text-white/80">
            Please read this page carefully before using Swaasth India services.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
            <div className="prose prose-slate max-w-none prose-headings:text-[#0D1B3E] prose-p:text-gray-700 prose-li:text-gray-700">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}