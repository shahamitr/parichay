'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

/**
 * Social Proof / Testimonials Section
 * Shows real testimonials when available, or professional "coming soon" placeholders.
 */

const testimonials = [
  {
    name: 'Customer Story',
    role: 'Coming Soon',
    content: 'We\'re collecting real stories from businesses using Parichay. This space will feature genuine experiences from verified users.',
    avatar: null,
    rating: 5,
    placeholder: true,
  },
  {
    name: 'Customer Story',
    role: 'Coming Soon',
    content: 'Early adopters are building their digital presence right now. Their success stories will appear here as they grow.',
    avatar: null,
    rating: 5,
    placeholder: true,
  },
  {
    name: 'Customer Story',
    role: 'Coming Soon',
    content: 'Real businesses. Real results. Real testimonials — coming soon as our first customers share their journey.',
    avatar: null,
    rating: 5,
    placeholder: true,
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 bg-amber-50 text-amber-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Built for businesses like yours.
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-lg mx-auto">
            Designed for every industry, every size. Hear from businesses building their digital presence with Parichay.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${t.placeholder ? 'border-dashed border-gray-200 bg-gray-50/50' : 'border-gray-100 bg-white shadow-sm'}`}
            >
              <Quote className="w-8 h-8 text-gray-200 mb-4" />

              <p className={`text-[14px] leading-relaxed mb-5 ${t.placeholder ? 'text-gray-400 italic' : 'text-gray-600'}`}>
                "{t.content}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.placeholder ? 'bg-gray-200' : 'bg-indigo-100'}`}>
                  <span className="text-[12px] font-bold text-gray-400">?</span>
                </div>
                <div>
                  <p className={`text-[13px] font-medium ${t.placeholder ? 'text-gray-400' : 'text-gray-900'}`}>{t.name}</p>
                  <p className="text-[11px] text-gray-400">{t.role}</p>
                </div>
              </div>

              {!t.placeholder && (
                <div className="flex gap-0.5 mt-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[13px] text-gray-400 mt-8"
        >
          Real customer testimonials will replace these placeholders as businesses share their stories.
        </motion.p>
      </div>
    </section>
  );
}
