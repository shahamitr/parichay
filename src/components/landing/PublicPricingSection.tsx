'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export default function PublicPricingSection() {
  const { t } = useTranslation();
  const whatsappLink = "https://wa.me/919724153883?text=Hi%20Parichay%20team,%20I'd%20like%20to%20book%20a%20demo%20for%20my%20business.";

  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-neutral-900/30 border-y border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 underline decoration-primary-500/50 underline-offset-8">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t.landing.pricing.title}</h2>
          <p className="text-neutral-500">{t.landing.pricing.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Individual Plan */}
          <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between relative overflow-hidden group shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div>
              <h3 className="text-xl font-bold mb-2">Individual</h3>
              <div className="text-4xl font-black mb-6">₹99<span className="text-sm font-normal text-neutral-500">/ month</span></div>
              <ul className="space-y-4 mb-8 text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center gap-2 text-sm"><ArrowRight className="w-4 h-4 text-blue-500" /> Pro Design Templates</li>
                <li className="flex items-center gap-2 text-sm"><ArrowRight className="w-4 h-4 text-blue-500" /> Lead Capturing</li>
                <li className="flex items-center gap-2 text-sm"><ArrowRight className="w-4 h-4 text-blue-500" /> Analytics Integration</li>
              </ul>
            </div>
            <button className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-colors font-bold text-white shadow-lg shadow-blue-500/20">
              CHOOSE INDIVIDUAL
            </button>
          </div>
          {/* Business Plan */}
          <div className="p-8 rounded-3xl bg-primary-600 border border-primary-500 relative shadow-2xl shadow-primary-600/40 transform scale-105 z-10 text-white">
            <div className="absolute -top-4 right-8 bg-yellow-400 text-primary-900 px-3 py-1 rounded-full text-[10px] font-black uppercase">
              {t.landing.pricing.popular}
            </div>
            <h3 className="text-xl font-bold mb-2">Business</h3>
            <div className="text-4xl font-black mb-6">₹199<span className="text-sm font-normal opacity-60">/ month</span></div>
            <ul className="space-y-4 mb-8 text-blue-100">
              <li className="flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-yellow-300" /> Team Management</li>
              <li className="flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-yellow-300" /> CRM Export (XLS/CSV)</li>
              <li className="flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-yellow-300" /> Verified Business Badge</li>
              <li className="flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-yellow-300" /> Priority 24/7 Support</li>
            </ul>
            <button className="w-full py-4 rounded-2xl bg-white text-primary-700 font-black shadow-xl hover:scale-105 transition-transform">
              GO BUSINESS
            </button>
          </div>
          {/* Enterprise Plan */}
          <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-black mb-6">Custom</div>
              <ul className="space-y-4 mb-8 text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center gap-2 text-sm"><Zap className="w-4 h-4 text-purple-500" /> White-label Solution</li>
                <li className="flex items-center gap-2 text-sm"><Zap className="w-4 h-4 text-purple-500" /> Custom API Integrations</li>
                <li className="flex items-center gap-2 text-sm"><Zap className="w-4 h-4 text-purple-500" /> Dedicated Account Manager</li>
              </ul>
            </div>
            <a 
              href={whatsappLink}
              className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-center hover:opacity-90 transition-opacity"
            >
              REQUEST PRICING
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
