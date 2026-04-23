import Link from "next/link";
import CommonHeader from "@/components/layout/CommonHeader";
import CommonFooter from "@/components/layout/CommonFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <CommonHeader />
      <nav className="bg-white dark:bg-neutral-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">Parichay</Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2">Sign In</Link>
              <Link href="/register" className="bg-primary-600 dark:bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">About Parichay</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-6">
            Parichay is a modern platform for creating and managing digital business cards.
            We help businesses, professionals, and entrepreneurs create stunning microsites that showcase
            their brand and capture leads effectively.
          </p>

          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-12 mb-4">Our Mission</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            To revolutionize the way businesses share their information by providing an easy-to-use,
            powerful platform for creating professional digital business cards that work seamlessly
            across all devices.
          </p>

          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-12 mb-4">Why Choose Us?</h2>
          <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
              <span>Easy to use - No technical knowledge required</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
              <span>Professional templates designed by experts</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
              <span>Powerful analytics to track your performance</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
              <span>Secure and reliable infrastructure</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
              <span>Excellent customer support</span>
            </li>
          </ul>

          <div className="mt-12 bg-primary-600 dark:bg-primary-700 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="mb-6">Join businesses using Parichay</p>
            <Link href="/register" className="inline-block bg-white dark:bg-neutral-100 text-primary-600 dark:text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-200">
              Create Your Free Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
