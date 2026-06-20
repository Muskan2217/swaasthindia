import { Heart, Thermometer } from "lucide-react";

interface VitalCardProps {
  type: "bp" | "temperature";
  value: string;
}

const config = {
  bp: {
    label: "BP",
    icon: Heart,
    color: "#EF4444",
    bg: "#FEF2F2",
  },
  temperature: {
    label: "Temp",
    icon: Thermometer,
    color: "#22C55E",
    bg: "#F0FDF4",
  },
};

export default function VitalCard({ type, value }: VitalCardProps) {
  const { label, icon: Icon, color, bg } = config[type];

  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center gap-3 flex-1 border border-gray-100"
      style={{ backgroundColor: bg }}
    >
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-base font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
