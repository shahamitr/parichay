import Link from "next/link";
import Image from "next/image";

export default function DigitalBusinessCardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">OneTouch BizCard</Link>
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
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Digital Business Card - The Future of Networking
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Say goodbye to paper business cards. Create stunning digital business cards
                that are eco-friendly, always up-to-date, and easy to share with anyone, anywhere.
              </p>
              <div className="flex gap-4">
                <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg">
                  Create Your Card Free
                </Link>
                <Link href="#demo" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 shadow-lg border-2 border-blue-600">
                  See Demo
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  JD
                </div>
                <h3 className="text-2xl font-bold text-gray-900">John Doe</h3>
                <p className="text-gray-600 mb-4">CEO & Founder</p>
                <div className="space-y-2 text-left">
                  <p className="text-gray-700">📧 john@example.com</p>
                  <p className="text-gray-700">📱 +91 98765 43210</p>
                  <p className="text-gray-700">🌐 www.example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Digital Business Card */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What is a Digital Business Card?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A digital business card is an electronic version of your traditional paper card that can be
              shared instantly via QR code, email, text, or social media. It's interactive, trackable,
              and always accessible on any device.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Save trees and reduce waste. Go paperless with digital cards.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Sharing</h3>
              <p className="text-gray-600">Share your card in seconds via QR code or link.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Always Updated</h3>
              <p className="text-gray-600">Update your info anytime. Everyone gets the latest version.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Digital Business Cards?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">{benefit.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Digital vs Traditional Business Cards</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">❌ Traditional Cards</h3>
              <ul className="space-y-3">
                <li>• Limited information</li>
                <li>• Easy to lose or damage</li>
                <li>• Expensive to print</li>
                <li>• Outdated quickly</li>
                <li>• Not eco-friendly</li>
                <li>• No analytics</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">✅ Digital Cards</h3>
              <ul className="space-y-3">
                <li>• Unlimited information</li>
                <li>• Always accessible</li>
                <li>• Cost-effective</li>
                <li>• Update anytime</li>
                <li>• Eco-friendly</li>
                <li>• Track engagement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Perfect For</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Go Digital?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have already made the switch
          </p>
          <Link href="/register" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 shadow-lg">
            Create Your Free Digital Business Card
          </Link>
          <p className="mt-4 text-sm opacity-75">No credit card required • Free forever plan available</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const benefits = [
  { icon: "💰", title: "Cost-Effective", description: "No printing costs. Create unlimited cards for a fraction of the price." },
  { icon: "📊", title: "Track Performance", description: "See who viewed your card, when, and from where with detailed analytics." },
  { icon: "🔗", title: "Easy Integration", description: "Add links to your website, social media, portfolio, and more." },
  { icon: "📱", title: "Mobile Optimized", description: "Perfect display on all devices - phones, tablets, and desktops." },
  { icon: "🎨", title: "Customizable Design", description: "Match your brand with custom colors, logos, and layouts." },
  { icon: "⚡", title: "Instant Updates", description: "Change your information anytime without reprinting." },
];

const steps = [
  { title: "Sign Up", description: "Create your free account in seconds" },
  { title: "Design", description: "Customize your digital card" },
  { title: "Share", description: "Share via QR code or link" },
  { title: "Track", description: "Monitor views and engagement" },
];

const useCases = [
  { icon: "👔", title: "Business Professionals", description: "Sales teams, executives, and consultants" },
  { icon: "🎨", title: "Freelancers & Creatives", description: "Designers, photographers, and artists" },
  { icon: "🏢", title: "Companies & Brands", description: "Businesses of all sizes and industries" },
  { icon: "🎓", title: "Students & Job Seekers", description: "Build your professional network" },
  { icon: "🏪", title: "Retail & Services", description: "Shops, restaurants, and service providers" },
  { icon: "🏥", title: "Healthcare Professionals", description: "Doctors, therapists, and clinics" },
];

const faqs = [
  { question: "What is a digital business card?", answer: "A digital business card is an electronic version of a traditional paper card that can be shared instantly via QR code, link, email, or text message. It's interactive, always up-to-date, and accessible on any device." },
  { question: "How do I share my digital business card?", answer: "You can share your card in multiple ways: via QR code (print or display), direct link, email, text message, or social media. Recipients can view it instantly without downloading any app." },
  { question: "Can I update my card after creating it?", answer: "Yes! That's one of the biggest advantages. You can update your information anytime, and everyone who has your card will automatically see the latest version." },
  { question: "Is it compatible with all devices?", answer: "Absolutely! Digital business cards work on all smartphones, tablets, and computers. No app installation required - they work directly in web browsers." },
  { question: "How much does it cost?", answer: "We offer a free plan with basic features. Premium plans start at ₹499/month with advanced features like custom domains, analytics, and unlimited cards." },
  { question: "Can I add my company logo and branding?", answer: "Yes! You can fully customize your card with your logo, brand colors, fonts, and images to match your company's identity." },
];
