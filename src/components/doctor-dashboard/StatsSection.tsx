"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { getDoctorDashboardStats } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { StatCardData } from "@/lib/doctor-dashboard-data";

export default function StatsSection() {
  const { token } = useAuth();
  const [cards, setCards] = useState<StatCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getDoctorDashboardStats(token)
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card) => (
        <StatCard key={card.id} data={card} />
      ))}
    </div>
  );
}