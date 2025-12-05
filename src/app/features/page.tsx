import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              OneTouch BizCard
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Sign In
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Your Digital Business Card
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create, manage, and share professional digital business cards
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Start Free Trial
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
