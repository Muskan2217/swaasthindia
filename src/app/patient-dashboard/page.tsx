import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatCard from "@/components/patient-dashboard/StatsCards";
import QueueStatusCard from "@/components/patient-dashboard/QueueStatusCard";
import { statCardsData } from "@/lib/patient-dashboard-data";
import TestsOrderedCard from "@/components/patient-dashboard/TestsOrderedCard";
import TestProgresscard from "@/components/patient-dashboard/TestProgresscard";
import Myreportstable from "@/components/patient-dashboard/Myreportstable";
import BookTestCTA from "@/components/patient-dashboard/BookTestCTA";
import PatientInfoCard from "@/components/patient-dashboard/PatientInfoCard";

export default function PatientDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

       <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCardsData.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              label={card.label}
              value={card.value}
              accentColor={card.accentColor}
            />
          ))}
        </div>
        <PatientInfoCard />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QueueStatusCard />
          <TestProgresscard />
          <TestsOrderedCard />
        </div>
        <Myreportstable />
        <BookTestCTA />

        <Footer />
      </main>

      
    </div>
  );
}
