export default function HealthRecordsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-red-100 p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Decorative top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 to-blue-600" />

        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-inner">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Health Records
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3 leading-relaxed">
          Coming Soon! Secure digital health records management will be available shortly.
        </p>

        <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs sm:text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Coming Soon
        </div>
      </div>
    </div>
  );
}