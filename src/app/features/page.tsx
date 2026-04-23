import Link from "next/link";
import CommonHeader from "@/components/layout/CommonHeader";
import CommonFooter from "@/components/layout/CommonFooter";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <CommonHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Powerful Features for Your Digital Business Card
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Everything you need to create, manage, and share professional digital business cards
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">{feature.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/register"
            className="inline-block bg-primary-600 dark:bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 dark:hover:bg-primary-600"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}

const features = [
  { icon: "🎨", title: "Custom Branding", description: "Personalize with your brand colors, logo, and style" },
  { icon: "📱", title: "QR Code Generation", description: "Create scannable QR codes for instant sharing" },
  { icon: "📊", title: "Analytics Dashboard", description: "Track views, clicks, and engagement metrics" },
  { icon: "🏢", title: "Multi-Branch Support", description: "Manage multiple locations under one account" },
  { icon: "📧", title: "Lead Capture", description: "Collect customer information with custom forms" },
  { icon: "🔔", title: "Real-time Notifications", description: "Get instant alerts via email, SMS, or WhatsApp" },
  { icon: "🌐", title: "Custom Domains", description: "Use your own domain for professional branding" },
  { icon: "🔒", title: "SSL Security", description: "Secure HTTPS encryption for all microsites" },
  { icon: "📱", title: "Mobile Responsive", description: "Perfect display on all devices and screen sizes" },
  { icon: "🎯", title: "SEO Optimized", description: "Built-in SEO features for better visibility" },
  { icon: "💳", title: "Payment Integration", description: "Accept payments with Stripe and Razorpay" },
  { icon: "📈", title: "Growth Tools", description: "Marketing tools to grow your business" },
];
