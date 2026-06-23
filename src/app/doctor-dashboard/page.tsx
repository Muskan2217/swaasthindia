import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatsSection from "@/components/doctor-dashboard/StatsSection";
import LiveQueueSection from "@/components/doctor-dashboard/LiveQueueSection";
import PatientDetailCard from "@/components/doctor-dashboard/PatientDetailCard";
import PrescriptionSection from "@/components/doctor-dashboard/PrescriptionSection";
import WeeklyScheduleSection from "@/components/doctor-dashboard/WeeklyScheduleSection";
import UpcomingAppointmentsTable from "@/components/doctor-dashboard/UpcomingAppointmentsTable";
import RecentPatientsTable from "@/components/doctor-dashboard/RecentPatientsTable";

export default function DoctorDashboardPage() {
  return (
     <div className="min-h-screen bg-[#F7F8FC]">
          <Navbar />

       <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Stats */}
        <StatsSection />

        {/* Live Queue + Patient Detail/Prescription -- side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          <LiveQueueSection />
          <div>
            <PatientDetailCard />
            <PrescriptionSection />
          </div>
        </div>

        {/* Weekly Schedule */}
        <WeeklyScheduleSection />

        {/* Appointments + Recent Patients -- side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UpcomingAppointmentsTable />
          <RecentPatientsTable />
        </div>
          <Footer />
      </main>
      
    </div>
  );
}
