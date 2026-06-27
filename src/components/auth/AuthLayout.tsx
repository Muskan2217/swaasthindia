// src/components/auth/AuthLayout.tsx

interface AuthLayoutProps {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthClass = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};



export default function AuthLayout({
  children,
  leftPanel,
  maxWidth = "lg",
}: AuthLayoutProps) {
  return (
    <section className="py-10 md:py-14">
      <div
        className={`w-full mx-auto ${maxWidthClass[maxWidth]} px-4`}
      >
        {leftPanel ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            
            {/* Left Side */}
            <div className="hidden lg:flex bg-gradient-to-br from-[#3864D5] to-[#1A3FA4] text-white p-10">
              {leftPanel}
            </div>

            {/* Right Side */}
            <div className="p-8 md:p-10 flex items-center">
              <div className="w-full">
                {children}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}