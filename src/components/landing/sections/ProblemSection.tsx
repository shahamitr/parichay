'use client';

import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const without = [
  'Scattered presence across WhatsApp, Instagram, Facebook',
  'No professional first impression',
  'Missed leads — customers can\'t find your services',
  'No booking, payment, or review system',
  'Dependent on word-of-mouth alone',
];

const withParichay = [
  'One beautiful link with everything about your business',
  'Professional profile that builds instant trust',
  'Discoverable — customers find you via QR, link, or search',
  'Built-in bookings, payments, and reviews',
  'Grow organically with analytics and lead capture',
];

export default function ProblemSection() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1.5 bg-red-50 text-red-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">The Problem</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-tight text-[#0F172A]">
            Your business deserves more than<br className="hidden sm:block" /> a WhatsApp number.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Without */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl border border-red-100 bg-red-50/30"
          >
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-6">Without Parichay</h3>
            <ul className="space-y-4">
              {without.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[15px] text-red-900/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl border border-emerald-100 bg-emerald-50/30"
          >
            <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-6">With Parichay</h3>
            <ul className="space-y-4">
              {withParichay.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[15px] text-emerald-900/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
