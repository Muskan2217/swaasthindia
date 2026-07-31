export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#F8FAFC]">
      <h1 className="text-6xl font-bold text-[#2563EB]">404</h1>
      <h2 className="mt-3 text-2xl font-semibold text-[#0F172A]">
        Page Not Found
      </h2>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist.
      </p>

      <a
        href="/admin/dashboard"
        className="mt-6 rounded-lg bg-[#2563EB] px-6 py-3 text-white hover:bg-[#1D4ED8] transition"
      >
        Back to Dashboard
      </a>
    </div>
  );
}