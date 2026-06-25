import { Metadata } from 'next';
import PublicPageLayout from '@/components/layout/PublicPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy — Parichay',
  description: 'How Parichay collects, uses, and protects your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <PublicPageLayout>
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
          <p className="text-[13px] text-gray-400 mt-2">Last Updated: January 2026</p>

          <div className="mt-10 space-y-8 text-[14px] text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Introduction</h2>
              <p>Welcome to Parichay. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Account Information:</strong> Name, email address, password, and business details</li>
                <li><strong>Business Information:</strong> Brand details, branch information, contact details</li>
                <li><strong>Payment Information:</strong> Billing details processed securely through Stripe and Razorpay</li>
                <li><strong>Usage Data:</strong> Analytics data, page views, interactions with profiles</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Provide and maintain our services</li>
                <li>Process payments and subscriptions</li>
                <li>Send important notifications and updates</li>
                <li>Improve our platform and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Data Sharing</h2>
              <p>We do not sell your personal data. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Payment processors (Stripe, Razorpay) for transaction processing</li>
                <li>Service providers who assist in operating our platform</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Data Security</h2>
              <p>We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your data.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Cookies</h2>
              <p>We use essential cookies for authentication and functionality. Analytics cookies are only enabled with your explicit consent. You can manage preferences via the cookie banner.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Data Retention</h2>
              <p>We retain your data for as long as your account is active. Deleted accounts enter a 30-day grace period before permanent removal. You may request immediate deletion by contacting us.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Contact</h2>
              <p>For privacy-related questions: <a href="mailto:hello@parichay.com" className="text-indigo-600 hover:underline">hello@parichay.com</a></p>
            </section>
          </div>
        </div>
      </article>
    </PublicPageLayout>
  );
}
