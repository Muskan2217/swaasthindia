export default function ScanQrPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Decorative top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-red-600" />
        
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">
          Scan QR to Book
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3 leading-relaxed">
          Coming Soon! Instant QR scanning and quick booking feature is under development.
        </p>

        <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs sm:text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          Coming Soon
        </div>
      </div>
    </div>
  );
}