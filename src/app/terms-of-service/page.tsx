import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - OneTouch BizCard',
  description: 'Terms of Service for OneTouch BizCard platform',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using OneTouch BizCard, you accept and agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
            <p>
              OneTouch BizCard provides a platform for creating and managing digital business card microsites.
              We offer subscription-based services with various features and limitations based on your chosen plan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
            <p className="mb-2">When creating an account, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Subscription and Payments</h2>
            <p className="mb-2">Subscription terms:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions are billed in advance on a monthly or yearly basis</li>
              <li>Payments are processed through Stripe or Razorpay</li>
              <li>Auto-renewal can be disabled in your account settings</li>
              <li>Refunds are subject to our refund policy</li>
              <li>We reserve the right to change pricing with 30 days notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Acceptable Use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any illegal purposes</li>
              <li>Upload malicious code or viruses</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate intellectual property rights</li>
              <li>Scrape or copy content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Content Ownership</h2>
            <p>
              You retain ownership of all content you upload to the platform. By uploading content,
              you grant us a license to display and distribute it as necessary to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Service Availability</h2>
            <p>
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted service.
              We reserve the right to modify or discontinue services with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Termination</h2>
            <p>
              We may suspend or terminate your account for violations of these terms.
              You may cancel your subscription at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>
              OneTouch BizCard is provided "as is" without warranties. We are not liable for any
              indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the service after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Contact Information</h2>
            <p>
              For questions about these terms, contact us at:
              <br />
              Email: legal@onetouchbizcard.in
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
