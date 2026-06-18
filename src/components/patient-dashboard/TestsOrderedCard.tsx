import { Droplets, Beaker, Pill, Clock, User } from "lucide-react";
import {
  testsOrdered,
  collectionInfo,
  type TestOrdered,
} from "@/lib/patient-dashboard-data";

function TestIcon({ iconType, color }: { iconType: TestOrdered["iconType"]; color: string }) {
  const cls = "w-4 h-4";
  const icons = {
    blood: <Droplets className={cls} />,
    drop: <Beaker className={cls} />,
    pill: <Pill className={cls} />,
    clock: <Clock className={cls} />,
  };
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {icons[iconType]}
    </div>
  );
}

export default function TestsOrderedCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Tests Ordered</h3>

      <div className="space-y-3 mb-5">
        {testsOrdered.map((test) => (
          <div key={test.id} className="flex items-center gap-3">
            <TestIcon iconType={test.iconType} color={test.iconColor} />
            <div>
              <p className="text-sm font-semibold text-gray-800">{test.name}</p>
              <p className="text-xs text-gray-400">{test.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Collection Time</p>
            <p className="text-sm font-semibold text-gray-700">{collectionInfo.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Lab Technician</p>
            <p className="text-sm font-semibold text-gray-700">{collectionInfo.technician}</p>
          </div>
        </div>
      </div>
    </div>
  );
}