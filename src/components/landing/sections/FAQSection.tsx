'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What is Parichay?', a: 'Parichay is an AI-powered platform that creates professional business profiles and microsites. Think of it as your complete digital identity — a single link where customers can learn about your business, contact you, book services, make payments, and leave reviews.' },
  { q: 'Do I need technical skills?', a: 'No. If you can fill a form, you can create your profile. No coding, no design skills, no hosting knowledge required. Our AI handles the heavy lifting.' },
  { q: 'How is this different from a website?', a: 'A traditional website requires a developer, hosting, domain setup, and ongoing maintenance. Parichay gives you the same professional presence with built-in lead capture, payments, analytics, and sharing tools — ready in minutes, not weeks.' },
  { q: 'Can I try it for free?', a: 'Yes. Every plan includes a 14-day free trial with full features. No credit card required to start.' },
  { q: 'What happens after the trial?', a: 'You can continue on the Starter plan at ₹99/month, upgrade to Professional at ₹199/month, or contact us for Agency pricing. Your profile stays live during the trial.' },
  { q: 'Can I use my own domain?', a: 'Yes. On the Professional plan and above, you can connect your own custom domain (like yourbusiness.com) to your Parichay profile.' },
  { q: 'How do customers find my profile?', a: 'You share your unique Parichay link via WhatsApp, social media, email signatures, or printed QR codes. Your profile is also SEO-optimized so customers can find you via Google search.' },
  { q: 'Can I accept payments through Parichay?', a: 'Yes. We integrate with Razorpay and UPI to allow customers to pay you directly from your profile — for bookings, services, or products.' },
  { q: 'Is my data secure?', a: 'Yes. We use AES-256 encryption for sensitive data, HTTPS everywhere, HTTP-only secure cookies, and follow industry-standard security practices. Your data is never sold to third parties.' },
  { q: 'Can I manage multiple branches or locations?', a: 'Yes. The Professional plan supports 3 branches, and the Agency plan supports unlimited branches — all managed from one dashboard.' },
  { q: 'Do you support multiple languages?', a: 'Yes. Parichay supports English, Hindi, Gujarati, and Marathi with more languages coming soon.' },
  { q: 'What kind of analytics do I get?', a: 'You can see profile views, QR code scans, lead submissions, popular services, visitor sources, and conversion rates — all in real-time from your dashboard.' },
  { q: 'Can I collect customer reviews?', a: 'Yes. Customers can leave star ratings and written reviews directly on your profile. Reviews are moderated before publication to prevent spam.' },
  { q: 'Is there a mobile app?', a: 'Parichay works as a Progressive Web App (PWA). You can add it to your phone\'s home screen for an app-like experience without downloading anything from app stores.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No lock-in contracts. Cancel anytime from your dashboard. Your profile remains accessible until the end of your billing period.' },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 lg:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Common questions.
          </h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.02 }}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4.5 text-left"
              >
                <span className="text-[14px] font-semibold text-[#0F172A] pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-[14px] text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
