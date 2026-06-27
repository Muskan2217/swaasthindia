// src/components/auth/RoleCard.tsx
import Link from "next/link";
import { User, Stethoscope, CheckCircle2, ArrowRight } from "lucide-react";
import type { RoleOption } from "@/lib/auth-dummy-data";

interface RoleCardProps {
  role: RoleOption;
}

const icons: Record<string, React.ReactNode> = {
  patient: <User size={32} strokeWidth={1.5} />,
  doctor:  <Stethoscope size={32} strokeWidth={1.5} />,
};

const gradients: Record<string, string> = {
  patient: "from-[#3864D5] to-[#6B8DD6]",
  doctor:  "from-[#E8192C] to-[#F87171]",
};

const btnColors: Record<string, string> = {
  patient: "bg-[#3864D5] hover:bg-[#2450B0] shadow-blue-200",
  doctor:  "bg-[#E8192C] hover:bg-red-700 shadow-red-200",
};

export default function RoleCard({ role }: RoleCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Coloured header band */}
      <div className={`bg-gradient-to-r ${gradients[role.id]} p-7 flex flex-col items-center text-white`}>
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
          {icons[role.id]}
        </div>
        <h2 className="text-xl font-extrabold">{role.title} Registration</h2>
        <p className="text-sm text-white/85 text-center mt-1.5 leading-relaxed max-w-[220px]">
          {role.description}
        </p>
      </div>

      {/* Feature list */}
      <div className="px-7 py-5 flex-1">
        <ul className="space-y-2.5">
          {role.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-[#3864D5] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 font-medium">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-7 pb-7">
        <Link
          href={role.href}
          className={`flex items-center justify-center gap-2 ${btnColors[role.id]} text-white font-bold text-sm py-3.5 rounded-[14px] transition-all shadow-md w-full`}
        >
          Continue as {role.title}
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}