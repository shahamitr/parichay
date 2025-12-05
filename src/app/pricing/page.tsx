import Link from "next/link";
import PricingPlans from "@/components/payments/PricingPlans";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">OneTouch BizCard</Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2">Sign In</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <PricingPlans />
      </main>
    </div>
  );
}

const plans = [
  { name: "Starter", price: "499", period: "month", popular: false, features: ["1 Brand", "3 Branches", "Basic Analytics", "QR Codes", "Email Support"] },
  { name: "Professional", price: "999", period: "month", popular: true, features: ["3 Brands", "10 Branches", "Advanced Analytics", "Custom Domain", "Priority Support", "SMS Notifications"] },
  { name: "Enterprise", price: "2499", period: "month", popular: false, features: ["Unlimited Brands", "Unlimited Branches", "Full Analytics Suite", "Multiple Custom Domains", "24/7 Support", "API Access", "White Label"] },
];
