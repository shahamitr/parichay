'use client';

import Link from 'next/link';
import { CheckCircle, X, ArrowRight } from 'lucide-react';
import PublicPageLayout from '@/components/layout/PublicPageLayout';

interface ComparisonRow {
  feature: string;
  parichay: boolean | string;
  blinq: boolean | string;
  dbc: boolean | string;
  justdial: boolean | string;
  googleBusiness: boolean | string;
  traditionalWebsite: boolean | string;
}

const COMPARISON_DATA: ComparisonRow[] = [
  { feature: 'What you get', parichay: 'Full microwebsite', blinq: 'Digital card', dbc: 'Digital card', justdial: 'Listing', googleBusiness: 'Listing', traditionalWebsite: 'Website' },
  { feature: 'Setup time', parichay: '5 minutes', blinq: '3 minutes', dbc: '5 minutes', justdial: '2-3 days', googleBusiness: '1-7 days', traditionalWebsite: '2-4 weeks' },
  { feature: 'Annual cost', parichay: '₹1,999/year', blinq: '₹7,200/year ($7/mo)', dbc: '₹6,000/year ($6/mo)', justdial: '₹15,000+', googleBusiness: 'Free', traditionalWebsite: '₹30,000+' },
  { feature: 'Service/menu showcase', parichay: true, blinq: false, dbc: false, justdial: 'Limited', googleBusiness: 'Limited', traditionalWebsite: true },
  { feature: 'Multiple branches/locations', parichay: true, blinq: false, dbc: false, justdial: 'Paid per listing', googleBusiness: true, traditionalWebsite: 'Extra cost' },
  { feature: 'Lead capture forms', parichay: true, blinq: false, dbc: false, justdial: 'Paid', googleBusiness: false, traditionalWebsite: 'Depends' },
  { feature: 'WhatsApp integration', parichay: true, blinq: false, dbc: false, justdial: false, googleBusiness: false, traditionalWebsite: 'Depends' },
  { feature: 'QR code sharing', parichay: true, blinq: true, dbc: true, justdial: false, googleBusiness: false, traditionalWebsite: false },
  { feature: 'Google Maps embedded', parichay: true, blinq: false, dbc: false, justdial: true, googleBusiness: true, traditionalWebsite: 'Extra cost' },
  { feature: 'Analytics dashboard', parichay: true, blinq: true, dbc: true, justdial: 'Basic', googleBusiness: 'Basic', traditionalWebsite: 'Extra cost' },
  { feature: 'Photo gallery', parichay: true, blinq: false, dbc: false, justdial: 'Limited', googleBusiness: true, traditionalWebsite: true },
  { feature: 'Custom domain', parichay: true, blinq: true, dbc: true, justdial: false, googleBusiness: false, traditionalWebsite: true },
  { feature: 'Mobile optimized', parichay: true, blinq: true, dbc: true, justdial: true, googleBusiness: true, traditionalWebsite: 'Depends' },
  { feature: 'NFC card support', parichay: false, blinq: true, dbc: true, justdial: false, googleBusiness: false, traditionalWebsite: false },
  { feature: 'CRM integrations', parichay: 'Webhooks', blinq: true, dbc: true, justdial: false, googleBusiness: false, traditionalWebsite: 'Depends' },
  { feature: 'India-focused (INR pricing)', parichay: true, blinq: false, dbc: false, justdial: true, googleBusiness: true, traditionalWebsite: true },
  { feature: 'No ads on your page', parichay: true, blinq: true, dbc: true, justdial: false, googleBusiness: true, traditionalWebsite: true },
  { feature: 'Appointment booking', parichay: true, blinq: false, dbc: false, justdial: false, googleBusiness: false, traditionalWebsite: 'Extra cost' },
  { feature: 'You own your data', parichay: true, blinq: true, dbc: true, justdial: false, googleBusiness: false, traditionalWebsite: true },
  { feature: 'No coding required', parichay: true, blinq: true, dbc: true, justdial: true, googleBusiness: true, traditionalWebsite: false },
];

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-red-400 mx-auto" />;
  return <span className="text-xs text-gray-600 text-center block">{value}</span>;
}

export default function ComparePage() {
  return (
    <PublicPageLayout>
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            How Parichay compares
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Blinq and DBC give you a digital visiting card. Justdial gives you a listing. Parichay gives you a complete microwebsite — with services, lead capture, analytics, and your own URL.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-700 min-w-[180px]">Feature</th>
                <th className="text-center px-4 py-3 min-w-[110px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-primary-600">Parichay</span>
                    <span className="text-xs text-gray-500">Microwebsite</span>
                  </div>
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 min-w-[100px]">
                  <div className="flex flex-col items-center gap-0.5">
                    <span>Blinq</span>
                    <span className="text-xs text-gray-400">Digital Card</span>
                  </div>
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 min-w-[100px]">
                  <div className="flex flex-col items-center gap-0.5">
                    <span>DBC</span>
                    <span className="text-xs text-gray-400">Digital Card</span>
                  </div>
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 min-w-[100px]">Justdial</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 min-w-[100px]">Google Business</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 min-w-[100px]">Traditional Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {COMPARISON_DATA.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">{row.feature}</td>
                  <td className="px-4 py-3 bg-primary-50/30"><CellValue value={row.parichay} /></td>
                  <td className="px-4 py-3"><CellValue value={row.blinq} /></td>
                  <td className="px-4 py-3"><CellValue value={row.dbc} /></td>
                  <td className="px-4 py-3"><CellValue value={row.justdial} /></td>
                  <td className="px-4 py-3"><CellValue value={row.googleBusiness} /></td>
                  <td className="px-4 py-3"><CellValue value={row.traditionalWebsite} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-green-50 border border-green-200 rounded-xl p-8 max-w-lg">
            <h3 className="text-xl font-bold text-gray-900">Ready to try Parichay?</h3>
            <p className="text-sm text-gray-600 mt-2">
              14-day free trial. No credit card. Setup in 5 minutes.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/roi-calculator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Calculate Your Savings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
