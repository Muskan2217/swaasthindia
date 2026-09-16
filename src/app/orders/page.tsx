export default function OrdersPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Decorative top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-red-600" />
        
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">
          Orders
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3 leading-relaxed">
          Coming Soon! We are crafting an amazing experience for your orders. Stay tuned.
        </p>

        <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs sm:text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          Under Development
        </div>
      </div>
    </div>
  );
}