import { Check, Bell } from "lucide-react";
import {
  testProgressSteps,
  type ProgressStep,
} from "@/lib/patient-dashboard-data";


function StepIcon({ status, id }: { status: ProgressStep["status"]; id: number }) {
  if (status === "completed") {
    return (
      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0">
        <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
    );
  }
  if (status === "in-progress") {
    return (
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
        <span className="text-white text-xs font-bold">{id}</span>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 bg-white">
      <span className="text-gray-400 text-xs font-semibold">{id}</span>
    </div>
  );
}

export default function TestProgressCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Test Progress</h3>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[13px] top-3.5 bottom-16 w-0.5 bg-gray-100 z-0" />

        <div className="space-y-3 relative z-10">
          {testProgressSteps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <StepIcon status={step.status} id={step.id} />
              <div className="flex-1 flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    step.status === "pending" ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  {step.label}
                </span>
                {step.time && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      step.status === "in-progress"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.time}
                  </span>
                )}
                {!step.time && step.status === "pending" && (
                  <span className="text-xs text-gray-300">Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Banner */}
      <div className="mt-5 bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4 text-blue-500" />
        </div>
        <p className="text-xs text-blue-700 font-medium leading-snug">
          We will notify you when your report is ready.
        </p>
      </div>
    </div>
  );
}