interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subLabel?: string;
  accentColor?: string;
  className?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  subLabel,
  accentColor = "#2563EB",
  className = "",
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-sm border border-gray-100 ${className}`}>
      <div
        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        <span style={{ color: accentColor }}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">{value}</p>
        {subLabel && <p className="text-xs text-gray-400 mt-0.5">{subLabel}</p>}
      </div>
    </div>
  );
}