'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { CONFIG } from '@/lib/config';
import { useRouter } from 'next/navigation';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'MONTHLY' | 'YEARLY';
  features: {
    maxBranches?: number;
    customDomain?: boolean;
    analytics?: boolean;
    qrCodes?: boolean;
    leadCapture?: boolean;
    prioritySupport?: boolean;
  };
}

export default function PublicPricingSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = null; // Public page — no auth context available

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const whatsappLink = `https://wa.me/${CONFIG.whatsappNumber}?text=Hi%20Parichay%20team,%20I'd%20like%20to%20book%20a%20demo%20for%2520my%2520business.`;

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch('/api/subscription-plans');
        if (res.ok) {
          const data = await res.json();
          setPlans(data.plans || []);
        }
      } catch (error) {
        console.error('Failed to load dynamic pricing plans:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handlePlanSelection = (planId: string) => {
    if (user) {
      router.push(`/admin/subscription/checkout?planId=${planId}`);
    } else {
      router.push(`/login?redirect=/admin/subscription/checkout?planId=${planId}`);
    }
  };

  return (
    <section id="pricing" className="py-32 bg-[#080809] border-y border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            Choose Your <span className="text-indigo-400">Impact.</span>
          </h2>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            {t.landing.pricing.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : plans.length > 0 ? (
          /* Render database plans dynamically */
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {plans.slice(0, 3).map((plan, index) => {
              const isPopular = plan.name.toLowerCase().includes('business') || index === 1;
              return (
                <div
                  key={plan.id}
                  className={`p-10 rounded-[3rem] flex flex-col justify-between relative overflow-hidden transition-all hover:scale-[1.02] ${
                    isPopular
                      ? 'bg-indigo-600 border border-indigo-400 text-white shadow-2xl shadow-indigo-600/30'
                      : 'bg-[#121214] border border-white/5 text-slate-300'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 right-10 bg-yellow-400 text-indigo-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {t.landing.pricing.popular}
                    </div>
                  )}

                  <div>
                    <h3 className={`text-xl font-black mb-2 ${isPopular ? 'text-white' : 'text-white'}`}>{plan.name}</h3>
                    <div className={`text-5xl font-black mb-8 ${isPopular ? 'text-white' : 'text-white'}`}>
                      ₹{plan.price}
                      <span className={`text-sm font-bold ${isPopular ? 'opacity-70' : 'text-slate-500'}`}>
                        {plan.duration === 'YEARLY' ? ' / year' : ' / month'}
                      </span>
                    </div>

                    <ul className="space-y-5 mb-10">
                      <li className="flex items-center gap-3 font-bold text-sm">
                        {isPopular ? (
                          <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0" />
                        )}
                        <span>{plan.features.maxBranches} Digital Microsites</span>
                      </li>
                      {plan.features.customDomain && (
                        <li className="flex items-center gap-3 font-bold text-sm">
                          {isPopular ? (
                            <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0" />
                          )}
                          <span>Dynamic Custom Domains</span>
                        </li>
                      )}
                      {plan.features.analytics && (
                        <li className="flex items-center gap-3 font-bold text-sm">
                          {isPopular ? (
                            <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0" />
                          )}
                          <span>Advanced Real-time Analytics</span>
                        </li>
                      )}
                      {plan.features.leadCapture && (
                        <li className="flex items-center gap-3 font-bold text-sm">
                          {isPopular ? (
                            <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0" />
                          )}
                          <span>Integrated Leads Capture CRM</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePlanSelection(plan.id)}
                    className={`w-full py-5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all ${
                      isPopular
                        ? 'bg-white text-indigo-700 hover:bg-slate-100 shadow-xl'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    Select Plan
                  </button>
                </div>
              );
            })}

            {/* Custom/Enterprise Plan */}
            <div className="p-10 rounded-[3rem] bg-[#121214] border border-white/5 flex flex-col justify-between text-slate-300">
              <div>
                <h3 className="text-xl font-black text-white mb-2">Custom</h3>
                <div className="text-5xl font-black text-white mb-8">Enterprise</div>
                <ul className="space-y-5 mb-10">
                  {['White-label Branding Matrix', 'Custom Gateway Peering', 'Dedicated Node Manager'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                      <Zap className="w-4 h-4 text-violet-500" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={whatsappLink}
                className="w-full py-5 rounded-2xl bg-white text-black font-black text-center hover:opacity-90 transition-opacity text-xs tracking-widest uppercase"
              >
                REQUEST PRICING
              </a>
            </div>
          </div>
        ) : (
          /* Fallback static layout if no plans have been seeded to database yet */
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Individual Plan */}
            <div className="p-10 rounded-[3rem] bg-[#121214] border border-white/5 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">Individual</h3>
                <div className="text-5xl font-black text-white mb-8">₹99<span className="text-sm font-bold text-slate-500"> / month</span></div>
                <ul className="space-y-5 mb-10">
                  {['Pro Design Templates', 'Lead Capturing', 'Analytics Integration'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                      <ArrowRight className="w-4 h-4 text-indigo-500" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all text-xs tracking-widest uppercase"
              >
                CHOOSE INDIVIDUAL
              </button>
            </div>

            {/* Business Plan */}
            <div className="p-10 rounded-[3rem] bg-indigo-600 border border-indigo-400 relative shadow-2xl shadow-indigo-600/30 transform scale-105 z-10 text-white flex flex-col justify-between">
              <div>
                <div className="absolute -top-4 right-10 bg-yellow-400 text-indigo-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {t.landing.pricing.popular}
                </div>
                <h3 className="text-xl font-black mb-2">Business</h3>
                <div className="text-5xl font-black mb-8">₹199<span className="text-sm font-bold opacity-70"> / month</span></div>
                <ul className="space-y-5 mb-10">
                  {['Team Management', 'CRM Export (XLS/CSV)', 'Verified Business Badge', 'Priority 24/7 Support'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-yellow-300" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-5 rounded-2xl bg-white text-indigo-700 font-black shadow-xl hover:scale-105 transition-transform text-xs tracking-widest uppercase"
              >
                GO BUSINESS
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-10 rounded-[3rem] bg-[#121214] border border-white/5 flex flex-col justify-between text-slate-300">
              <div>
                <h3 className="text-xl font-black text-white mb-2">Enterprise</h3>
                <div className="text-5xl font-black text-white mb-8">Custom</div>
                <ul className="space-y-5 mb-10">
                  {['White-label Solution', 'Custom API Integrations', 'Dedicated Account Manager'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                      <Zap className="w-4 h-4 text-violet-500" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={whatsappLink}
                className="w-full py-5 rounded-2xl bg-white text-black font-black text-center hover:opacity-90 transition-opacity text-xs tracking-widest uppercase"
              >
                REQUEST PRICING
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
