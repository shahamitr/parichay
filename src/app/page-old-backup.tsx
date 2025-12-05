import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">OneTouch BizCard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Features</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Pricing</Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Sign In</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Create Your Digital
            <span className="text-blue-600"> Business Card</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build professional microsites with custom domains, QR codes, and analytics.
            Perfect for businesses, freelancers, and professionals.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg border-2 border-blue-600"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Branding</h3>
            <p className="text-gray-600">
              Create beautiful microsites with your brand colors, logo, and custom domain.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">QR Codes</h3>
            <p className="text-gray-600">
              Generate and download QR codes for easy sharing of your digital business card.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics</h3>
            <p className="text-gray-600">
              Track views, clicks, and leads with detailed analytics and insights.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Branch</h3>
            <p className="text-gray-600">
              Manage multiple locations or divisions under one brand with ease.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Lead Capture</h3>
            <p className="text-gray-600">
              Collect leads directly from your microsite with customizable forms.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Notifications</h3>
            <p className="text-gray-600">
              Get instant alerts via email, SMS, or WhatsApp when you receive new leads.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Go Digital?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using OneTouch BizCard
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Your Free Trial
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">OneTouch BizCard</h3>
              <p className="text-gray-600 text-sm">
                Create professional digital business cards with ease.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/features" className="hover:text-blue-600">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-600">Pricing</Link></li>
                <li><Link href="/register" className="hover:text-blue-600">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-blue-600">Privacy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-blue-600">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/contact" className="hover:text-blue-600">Help Center</Link></li>
                <li><Link href="/register" className="hover:text-blue-600">Documentation</Link></li>
                <li><Link href="/register" className="hover:text-blue-600">API</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} OneTouch BizCard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
