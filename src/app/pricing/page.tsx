import Link from "next/link";
import CommonHeader from "@/components/layout/CommonHeader";
import CommonFooter from "@/components/layout/CommonFooter";
import PublicPricingSection from "@/components/landing/PublicPricingSection";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <CommonHeader />

      <main>
        <PublicPricingSection />
      </main>

      <CommonFooter />
    </div>
  );
}
