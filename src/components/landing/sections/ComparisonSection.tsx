'use client';

import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';

const comparisons = [
  { feature: 'Setup time', traditional: '2-6 weeks', builder: '2-5 days', social: 'Instant', parichay: '5 minutes' },
  { feature: 'Cost per year', traditional: '₹30,000+', builder: '₹10,000+', social: 'Free', parichay: 'From ₹1,188' },
  { feature: 'Lead capture forms', traditional: 'Extra plugin', builder: 'Limited', social: 'No', parichay: 'Built-in' },
  { feature: 'WhatsApp integration', traditional: 'Manual', builder: 'Plugin', social: 'No', parichay: 'One-tap' },
  { feature: 'QR code', traditional: 'No', builder: 'No', social: 'No', parichay: 'Included' },
  { feature: 'Mobile optimized', traditional: 'Extra cost', builder: 'Usually', social: 'Yes', parichay: 'Always' },
  { feature: 'Analytics', traditional: 'Separate tool', builder: 'Basic', social: 'Limited', parichay: 'Real-time' },
  { feature: 'SEO', traditional: 'Complex setup', builder: 'Basic', social: 'Minimal', parichay: 'Automatic' },
  { feature: 'Updates', traditional: 'Developer needed', builder: 'Self-serve', social: 'Post only', parichay: 'Instant' },
];

export default function ComparisonSection() {
  return (
    <section className="py-24 lg:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">Why Parichay</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0F172A]">
            Compare approaches.
          </h2>
          <p className="mt-4 text-gray-500 text-lg">Factual comparison of different ways to establish your online presence.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm overflow-x-auto"
        >
          <table className="w-full min-w-[600px] text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-5 py-4 font-semibold text-gray-500">Feature</th>
                <th className="px-4 py-4 font-semibold text-gray-400">Traditional Website</th>
                <th className="px-4 py-4 font-semibold text-gray-400">Website Builder</th>
                <th className="px-4 py-4 font-semibold text-gray-400">Social Profile</th>
                <th className="px-4 py-4 font-bold text-indigo-700 bg-indigo-50/50">Parichay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {comparisons.map((row) => (
                <tr key={row.feature} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-700">{row.feature}</td>
                  <td className="px-4 py-3.5 text-center text-gray-400">{row.traditional}</td>
                  <td className="px-4 py-3.5 text-center text-gray-400">{row.builder}</td>
                  <td className="px-4 py-3.5 text-center text-gray-400">{row.social}</td>
                  <td className="px-4 py-3.5 text-center font-semibold text-[#0F172A] bg-indigo-50/30">{row.parichay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
