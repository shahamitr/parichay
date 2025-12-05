import Link from "next/link";

export default function RefundPolicyPage() {
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
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Refund Policy</h1>
        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Refund Eligibility</h2>
          <p className="text-gray-600 mb-4">
            We offer refunds under the following conditions:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Request made within 7 days of purchase</li>
            <li>Service not delivered as promised</li>
            <li>Technical issues preventing service usage</li>
            <li>Duplicate charges or billing errors</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Non-Refundable Items</h2>
          <p className="text-gray-600 mb-4">
            The following are not eligible for refunds:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Services used for more than 7 days</li>
            <li>Custom design work already completed</li>
            <li>Downloaded digital products</li>
            <li>Promotional or discounted subscriptions</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Refund Process</h2>
          <p className="text-gray-600 mb-4">
            To request a refund:
          </p>
          <ol className="list-decimal pl-6 text-gray-600 space-y-2 mb-6">
            <li>Contact our support team at support@onetouchbizcard.in</li>
            <li>Provide your order number and reason for refund</li>
            <li>Our team will review your request within 2-3 business days</li>
            <li>If approved, refund will be processed within 7-10 business days</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Refund Method</h2>
          <p className="text-gray-600 mb-6">
            Refunds will be issued to the original payment method used for the purchase.
            Please allow 7-10 business days for the refund to reflect in your account.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Subscription Cancellations</h2>
          <p className="text-gray-600 mb-6">
            You can cancel your subscription at any time. Upon cancellation:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>You will retain access until the end of your billing period</li>
            <li>No refund for the current billing cycle</li>
            <li>No charges for subsequent billing cycles</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Partial Refunds</h2>
          <p className="text-gray-600 mb-6">
            In some cases, we may offer partial refunds based on:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Duration of service usage</li>
            <li>Features utilized</li>
            <li>Specific circumstances of the request</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Contact Information</h2>
          <p className="text-gray-600 mb-4">
            For refund requests or questions about our refund policy:
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-gray-700"><strong>Email:</strong> support@onetouchbizcard.in</p>
            <p className="text-gray-700"><strong>Phone:</strong> +91 90545 90987</p>
            <p className="text-gray-700"><strong>Business Hours:</strong> Monday - Saturday, 9 AM - 6 PM IST</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Changes to This Policy</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify this refund policy at any time. Changes will be
            effective immediately upon posting on our website. Your continued use of our
            services after changes constitutes acceptance of the modified policy.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <p className="text-gray-700">
              <strong>Note:</strong> This refund policy is subject to applicable laws and regulations.
              If you have any questions or concerns, please contact our support team.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
