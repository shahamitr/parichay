import Link from "next/link";
import IndustryCategoriesSection from "@/components/landing/IndustryCategoriesSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingPreview from "@/components/landing/PricingPreview";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Parichay
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Features</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Pricing</Link>
              <Link href="/clients" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Success Stories</Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Sign In</Link>
              <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                🚀 Trusted by 10,000+ Professionals
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Your Business,
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  One Touch Away
                </span>
              </h1>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Create stunning digital business cards, microsites, and professional content in minutes.
                No coding required. Stand out, connect instantly, and grow your brand.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-2 group"
                >
                  Start Free Trial
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="https://wa.me/919054590987"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-600 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>💬</span> Talk to Sales
                </a>
              </div>
              <p className="mt-6 text-sm opacity-75">✨ No credit card required • 14-day free trial • Cancel anytime</p>
            </div>

            {/* Right Content - Interactive Preview */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      JD
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">John Doe</h3>
                    <p className="text-blue-600 font-semibold mb-4">CEO & Founder</p>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <span className="text-xl">📧</span>
                        <span className="text-sm">john@company.com</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <span className="text-xl">📱</span>
                        <span className="text-sm">+91 98765 43210</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <span className="text-xl">🌐</span>
                        <span className="text-sm">www.johndoe.com</span>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Save Contact
                      </button>
                      <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                ⚡ Instant Setup
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce delay-500">
                📱 Mobile Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Showcase */}
      <FeaturesShowcase />

      {/* How It Works */}
      <HowItWorks />

      {/* Industry Categories Section */}
      <IndustryCategoriesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing Preview */}
      <PricingPreview />

      {/* CTA Section - Enhanced */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of professionals who trust Parichay</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 shadow-lg inline-block">
              Start Your Free Trial
            </Link>
            <a href="tel:+919054590987" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 inline-flex items-center justify-center gap-2">
              📞 +91 90545 90987
            </a>
          </div>
          <p className="mt-6 text-sm opacity-75">💼 Franchise opportunities available • Contact us to learn more</p>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-xl font-bold">Parichay</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-sm">
                Empowering professionals and businesses with cutting-edge digital business card solutions.
                Create, share, and grow your brand effortlessly.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-xl">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-xl">💼</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-xl">📷</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/clients" className="hover:text-white transition-colors">Success Stories</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/franchise" className="hover:text-white transition-colors">Franchise</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Parichay. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>📧 support@onetouchbizcard.in</span>
              <span>📱 +91 90545 90987</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
