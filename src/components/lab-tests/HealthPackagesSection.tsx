import PackageCard from "./PackageCard";
import type { HealthPackage } from "@/lib/lab-tests-data";

interface HealthPackagesSectionProps {
  packages: HealthPackage[];
  onBook?: (pkgId: string) => void;
}

export default function HealthPackagesSection({ packages, onBook }: HealthPackagesSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Packages</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onBook={onBook} />
        ))}
      </div>
    </section>
  );
}
