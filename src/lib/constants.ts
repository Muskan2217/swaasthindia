import { PharmacyCategory, FooterLink, CompanyInfo } from "@/types";

export const PHARMACY_CATEGORIES: PharmacyCategory[] = [
  { id: "medicine", name: "Medicine", icon: "💊", href: "/pharmacy/medicine" },
  { id: "personal-care", name: "Personal Care", icon: "🧴", href: "/pharmacy/personal-care" },
  { id: "surgical", name: "Surgical", icon: "✂️", href: "/pharmacy/surgical" },
  { id: "ayurvedic", name: "Ayurvedic", icon: "🌿", href: "/pharmacy/ayurvedic" },
  { id: "hair-care", name: "Hair Care", icon: "✨", href: "/pharmacy/hair-care" },
];


export const HEALTH_MENU_ITEMS = [
  {
    id: "orders",
    label: "My Orders",
    href: "/orders",
    icon: "/icons/QuickActions/icon-1.png",
  },
  {
    id: "records",
    label: "Health Record",
    href: "/health-records",
    icon: "/icons/QuickActions/icon-2.png",
  },
];

export const HELP_LINKS: FooterLink[] = [
  { id: "secure", label: "Secure Checkout", href: "/secure-checkout", icon: "🔒" },
  { id: "terms", label: "Terms and Condition", href: "/terms", icon: "📃" },
  { id: "privacy", label: "Privacy policy", href: "/privacy", icon: "🛡️" },
];

export const COMPANY_LINKS: CompanyInfo[] = [
  { id: "founder", label: "About Founder", href: "/about" },
  { id: "doctor", label: "Verified Doctor", href: "/doctors" },
  { id: "careers", label: "Careers", href: "/careers" },
  { id: "certificate", label: "Certificate", href: "/certificate" },
];