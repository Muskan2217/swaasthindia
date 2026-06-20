import StatCard from "./StatCard";
import { statCards } from "@/lib/doctor-dashboard-data";

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {statCards.map((card) => (
        <StatCard key={card.id} data={card} />
      ))}
    </div>
  );
}
