
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import PharmacyCategories from "@/components/home/PharmacyCategories";
import QuickActionsSection from "@/components/home/QuickActionsSection";
import DoctorPatientSection from "@/components/home/DoctorPatientSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />
 
      <main className="pb-6">
        <HeroSection />
        <PharmacyCategories />
        <QuickActionsSection />
        <DoctorPatientSection />
        <Footer />
      </main>
    </div>
  );
}
 