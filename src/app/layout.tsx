import type { Metadata } from "next";
import "./globals.css";
 
export const metadata: Metadata = {
  title: "Swaasth India – Quality Care is Just a Click Away",
  description:
    "Get expert medical advice from the comfort of your home. Consult with verified specialists across India starting at just ₹50.",
  keywords: ["healthcare", "telemedicine", "doctors", "India", "online consultation"],
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F8FC] antialiased">
        {children}
      </body>
    </html>
  );
}
 