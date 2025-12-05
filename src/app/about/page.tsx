import Link from "next/link";

export default function AboutPage() {
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">About OneTouch BizCard</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-6">
            OneTouch BizCard is a modern platform for creating and managing digital business cards.
            We help businesses, professionals, and entrepreneurs create stunning microsites that showcase
            their brand and capture leads effectively.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To revolutionize the way businesses share their information by providing an easy-to-use,
            powerful platform for creating professional digital business cards that work seamlessly
            across all devices.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Why Choose Us?</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Easy to use - No technical knowledge required</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Professional templates designed by experts</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Powerful analytics to track your performance</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Secure and reliable infrastructure</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Excellent customer support</span>
            </li>
          </ul>

          <div className="mt-12 bg-blue-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="mb-6">Join thousands of businesses using OneTouch BizCard</p>
            <Link href="/register" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Create Your Free Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
