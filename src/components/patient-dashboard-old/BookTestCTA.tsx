import { FlaskConical, ArrowRight } from "lucide-react";

interface BookTestCTAProps {
  onBook?: () => void;
}

export default function BookTestCTA({ onBook }: BookTestCTAProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <FlaskConical className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">Need another test?</p>
          <p className="text-xs text-gray-400">Book your next lab test from the comfort of your home.</p>
        </div>
      </div>
      <button
        onClick={onBook}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
      >
        Book New Test
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}