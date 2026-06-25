import { Metadata } from 'next';
import PublicPageLayout from '@/components/layout/PublicPageLayout';

export const metadata: Metadata = {
  title: 'Refund Policy — Parichay',
  description: 'Refund and cancellation policy for Parichay subscriptions.',
};

export default function RefundPolicyPage() {
  return (
    <PublicPageLayout>
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Refund Policy</h1>
          <p className="text-[13px] text-gray-400 mt-2">Last Updated: January 2026</p>

          <div className="mt-10 space-y-8 text-[14px] text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Free Trial</h2>
              <p>All plans include a 14-day free trial. No payment is taken during the trial period. If you cancel before the trial ends, you will not be charged.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Monthly Plans</h2>
              <p>Monthly subscriptions can be cancelled at any time. Upon cancellation, your profile remains active until the end of the current billing period. No partial refunds are issued for monthly plans.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Annual Plans</h2>
              <p>If you cancel an annual plan within 30 days of purchase, you are eligible for a full refund. After 30 days, a prorated refund for unused months will be processed upon request.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">How to Request a Refund</h2>
              <p>Email us at <a href="mailto:hello@parichay.com" className="text-indigo-600 hover:underline">hello@parichay.com</a> with your account email and reason for refund. Refunds are processed within 5-7 business days to the original payment method.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Non-Refundable</h2>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Custom domain registration fees (if applicable)</li>
                <li>Accounts terminated for terms of service violations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
              <p>For refund requests or billing questions: <a href="mailto:hello@parichay.com" className="text-indigo-600 hover:underline">hello@parichay.com</a></p>
            </section>
          </div>
        </div>
      </article>
    </PublicPageLayout>
  );
}
