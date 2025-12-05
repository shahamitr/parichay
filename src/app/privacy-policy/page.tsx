import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - OneTouch BizCard',
  description: 'Privacy Policy for OneTouch BizCard platform',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to OneTouch BizCard. We respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password, and business details</li>
              <li><strong>Business Information:</strong> Brand details, branch information, contact details</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe and Razorpay</li>
              <li><strong>Usage Data:</strong> Analytics data, page views, interactions with microsites</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process payments and subscriptions</li>
              <li>Send important notifications and updates</li>
              <li>Improve our platform and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal data. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Payment processors (Stripe, Razorpay) for transaction processing</li>
              <li>Service providers who assist in operating our platform</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption, secure servers,
              and regular security audits to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Your Rights (GDPR Compliance)</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
            <p>
              We use cookies to enhance your experience, analyze usage, and maintain your session.
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active or as needed to provide services.
              You may request deletion of your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact us at:
              <br />
              Email: privacy@onetouchbizcard.in
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
