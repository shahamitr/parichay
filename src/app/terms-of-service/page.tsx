import { Metadata } from 'next';
import PublicPageLayout from '@/components/layout/PublicPageLayout';

export const metadata: Metadata = {
  title: 'Terms of Service — Parichay',
  description: 'Terms and conditions for using the Parichay platform.',
};

export default function TermsOfServicePage() {
  return (
    <PublicPageLayout>
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
          <p className="text-[13px] text-gray-400 mt-2">Last Updated: January 2026</p>

          <div className="mt-10 space-y-8 text-[14px] text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>By creating an account or using Parichay, you agree to these Terms of Service. If you do not agree, please do not use our platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p>Parichay is a business growth platform that provides tools for creating professional digital profiles, capturing leads, sharing via QR codes and links, and tracking analytics. Profiles are hosted at parichay.com/your-business or on your custom domain.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Account Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>You must provide accurate information when creating your account</li>
                <li>You are responsible for maintaining the security of your password</li>
                <li>You must not use the platform for illegal or harmful activities</li>
                <li>You must not impersonate another business or individual</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Content</h2>
              <p>You retain ownership of all content you upload (photos, text, logos). By uploading content, you grant Parichay a license to display it on your profile. You must not upload content that infringes on others' rights or violates any law.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Subscriptions & Payment</h2>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Free trial: 14 days with full access, no credit card required</li>
                <li>Paid plans are billed monthly. Prices exclude applicable taxes (GST)</li>
                <li>You can cancel anytime. Your profile remains active until the end of the billing period</li>
                <li>Refunds are processed within 7 days for unused portions of annual plans</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Termination</h2>
              <p>We may suspend or terminate accounts that violate these terms. You may delete your account at any time from your settings. Deleted accounts enter a 30-day grace period before permanent removal.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p>Parichay is provided "as is." We do our best to ensure uptime and reliability but cannot guarantee uninterrupted service. We are not liable for indirect damages arising from use of the platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Changes to Terms</h2>
              <p>We may update these terms from time to time. We will notify you of significant changes via email. Continued use of the platform after changes constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Contact</h2>
              <p>Questions about these terms? Contact us at <a href="mailto:hello@parichay.com" className="text-indigo-600 hover:underline">hello@parichay.com</a></p>
            </section>
          </div>
        </div>
      </article>
    </PublicPageLayout>
  );
}
