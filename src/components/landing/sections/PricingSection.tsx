'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 99,
    yearlyPrice: 999,
    description: 'Perfect for individuals and solo professionals.',
    features: ['1 Business Profile', 'QR Code', 'WhatsApp Button', 'Basic Analytics', 'Lead Form', 'Social Links'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Professional',
    monthlyPrice: 199,
    yearlyPrice: 1999,
    description: 'For growing businesses that need more.',
    features: ['3 Branches', 'Custom Domain', 'Advanced Analytics', 'Appointment Booking', 'Payment Collection', 'Priority Support', 'Remove Branding'],
    cta: 'Choose Plan',
    highlight: true,
  },
  {
    name: 'Agency',
    monthlyPrice: 999,
    yearlyPrice: 9999,
    description: 'Manage multiple brands under one account.',
    features: ['Unlimited Branches', 'White-label', 'Client Management', 'Bulk QR Codes', 'API Access', 'Dedicated Support', 'Custom Integrations'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 lg:py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0F172A]">
            Simple, transparent pricing.
          </h2>
          <p className="mt-4 text-gray-500 text-lg">14-day free trial on all plans. No credit card required.</p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setYearly(false)} className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${!yearly ? 'bg-white text-[#0F172A] shadow-sm' : 'text-gray-500'}`}>
              Monthly
            </button>
            <button onClick={() => setYearly(true)} className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${yearly ? 'bg-white text-[#0F172A] shadow-sm' : 'text-gray-500'}`}>
              Yearly <span className="text-emerald-600 text-[11px]">Save 15%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 flex flex-col ${
                plan.highlight
                  ? 'bg-[#0F172A] text-white border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Recommended
                </div>
              )}

              <h3 className={`text-lg font-bold ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>{plan.name}</h3>
              <p className={`text-[13px] mt-1 ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>

              <div className="mt-5 mb-6">
                <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>
                  ₹{yearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className={`text-sm ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>/{yearly ? 'year' : 'month'}</span>
              </div>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-indigo-400' : 'text-emerald-500'}`} />
                    <span className={`text-[13px] ${plan.highlight ? 'text-gray-300' : 'text-gray-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === 'Agency' ? '/contact' : '/register'}
                className={`mt-7 h-11 flex items-center justify-center rounded-xl text-[14px] font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-white text-[#0F172A] hover:bg-gray-100'
                    : 'bg-[#0F172A] text-white hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
