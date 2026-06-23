import { FlaskConical, ArrowRight } from "lucide-react";

interface SelectedTestsBarProps {
  count: number;
  totalPrice: number;
  onContinue?: () => void;
}

export default function SelectedTestsBar({ count, totalPrice, onContinue }: SelectedTestsBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:px-6">
      <div className="max-w-3xl mx-auto bg-rose-50 border border-rose-100 rounded-2xl shadow-lg px-4 md:px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
            <FlaskConical className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {count} Test{count > 1 ? "s" : ""} Selected
            </p>
            <p className="text-sm font-semibold text-rose-600">₹{totalPrice}</p>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
