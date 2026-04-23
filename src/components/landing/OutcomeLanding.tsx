'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import GlobalMapHero from './GlobalMapHero';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';
import LanguageToggle from '../layout/LanguageToggle';
import { Smartphone, QrCode, UserCheck, Search, ArrowRight, CheckCircle2, Phone, Mail, Sparkles, Zap } from 'lucide-react';

import Link from 'next/link';
import ParichayLogo from '@/components/ui/ParichayLogo';

// Dynamic imports for heavy sections
const EmotionalProblemSection = dynamic(() => import('./EmotionalProblemSection'), { ssr: false });
const OutcomeFeatureGrid = dynamic(() => import('./OutcomeFeatureGrid'), { ssr: false });
const ROICalculator = dynamic(() => import('./ROICalculator'), { ssr: false });
const LiveCardBuilder = dynamic(() => import('./LiveCardBuilder'), { ssr: false });
const FeaturesShowcase = dynamic(() => import('./FeaturesShowcase'), { ssr: false });
const DirectoryValidationSection = dynamic(() => import('./DirectoryValidationSection'), { ssr: false });
const PublicPricingSection = dynamic(() => import('./PublicPricingSection'), { ssr: false });

const CommonFooter = dynamic(() => import('../layout/CommonFooter'), { ssr: false });

export default function OutcomeLanding() {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const [previewName, setPreviewName] = useState('');
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewName.trim()) return;
    setIsPreviewActive(true);
    setTimeout(() => {
        // Reset after some time to allow re-trigger
        // setIsPreviewActive(false);
    }, 5000);
  };

  const whatsappLink = "https://wa.me/919724153883?text=Hi%20Parichay%20team,%20I'd%20like%20to%20book%20a%20demo%20for%20my%20business.";

  return (
    <div className="bg-white dark:bg-[#050510] text-[#0f172a] dark:text-white selection:bg-primary-500/30">
      {/* Floating Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-8">
          <Link href="/" className="hover:scale-105 transition-transform inline-block group">
            <ParichayLogo size="md" variant="full" animated />
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-3 rounded-full shadow-2xl">
                {['Features', 'Pricing', 'ROI', 'Demo'].map((link) => (
                    <Link 
                        key={link} 
                        href={link === 'Demo' ? '/demo' : `/#${link.toLowerCase()}`}
                        className="text-[11px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-300 hover:text-primary-500 transition-colors"
                    >
                        {link}
                    </Link>
                ))}
          </div>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <LanguageToggle />
          <Link 
            href="/login" 
            className="hidden sm:block px-6 py-2 rounded-full bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 border border-primary-400/50"
          >
            LOGIN
          </Link>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <GlobalMapHero />

      {/* 2. Live Node Preview (MAHAKALI SWEETS Interactive Demo) */}
      <section className="py-24 bg-slate-50 dark:bg-neutral-900/50 border-y border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1]">
                        Claim Your Spot on India's <span className="text-primary-600 italic">Smart Business Map</span>
                    </h2>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed">
                        Don't just be a dot. Be a destination. Type your business name below to see your professional digital identity come to life instantly.
                    </p>
                    
                    <form onSubmit={handlePreview} className="relative max-w-md group">
                        <input 
                            type="text" 
                            value={previewName}
                            onChange={(e) => setPreviewName(e.target.value)}
                            placeholder="e.g. Mahakali Sweets"
                            className="w-full pl-6 pr-32 py-5 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl text-lg focus:border-primary-500 outline-none transition-all shadow-lg shadow-neutral-500/5"
                        />
                        <button 
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 px-6 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 transition-all flex items-center gap-2"
                        >
                            Preview
                        </button>
                    </form>
                </div>

                <div className="relative w-full max-w-sm mx-auto aspect-[9/19.5] pointer-events-auto">
                    {/* Perspective Phone Mockup */}
                    <motion.div 
                        initial={{ opacity: 0, rotateY: 20, y: 50 }}
                        whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative w-full h-full bg-[#0F172A] rounded-[3rem] border-[8px] border-[#1E293B] shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
                    >
                        {/* Status Bar */}
                        <div className="h-8 w-full flex items-center justify-between px-8 pt-4">
                            <span className="text-[10px] font-bold text-white/50">9:41</span>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full border border-white/20"></div>
                                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                            </div>
                        </div>

                        {/* Scrollable Microsite Content */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide bg-white dark:bg-[#050510] custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {!isPreviewActive ? (
                                    <motion.div 
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full flex flex-col items-center justify-center p-12 text-center"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center mb-4">
                                            <Search className="w-8 h-8 text-neutral-400 opacity-30" />
                                        </div>
                                        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Awaiting Name</p>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col"
                                    >
                                        {/* Banner & Profile */}
                                        <div className="h-40 w-full bg-gradient-to-br from-primary-600 to-indigo-600 relative">
                                            <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl bg-[#050510] border-4 border-white dark:border-[#050510] shadow-xl flex items-center justify-center text-white text-2xl font-black">
                                                {previewName.charAt(0)}
                                            </div>
                                        </div>

                                        <div className="mt-12 px-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white">{previewName}</h3>
                                                <div className="bg-primary-600 px-2 py-0.5 rounded-full text-[8px] font-black text-white tracking-widest flex items-center gap-1">
                                                    <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                                                </div>
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-1">Confectionery & Sweets • Since 1998</p>
                                            
                                            <div className="flex gap-2 mt-6">
                                                {[Phone, Smartphone, Mail].map((Icon, i) => (
                                                    <div key={i} className="flex-1 h-10 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/10">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Products Grid Mockup */}
                                            <div className="mt-8">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Our Specials</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {[1,2,3,4].map(i => (
                                                        <div key={i} className="space-y-2">
                                                            <div className="aspect-square bg-neutral-100 dark:bg-white/5 rounded-2xl border border-neutral-200 dark:border-white/10 overflow-hidden">
                                                                <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                                                            </div>
                                                            <div className="h-2 w-full bg-neutral-100 dark:bg-white/5 rounded-full"></div>
                                                            <div className="h-2 w-2/3 bg-primary-600/20 rounded-full"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="py-8 text-center">
                                                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-500 animate-bounce">
                                                    Scroll to explore <ArrowRight className="w-3 h-3 rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Decorative Elements around phone */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. Interactive Product Demo */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LiveCardBuilder />
        </div>
      </section>

      {/* 4. Problem Section */}
      <EmotionalProblemSection />

      {/* 5. Product Features Showcase */}
      <div id="features">
        <FeaturesShowcase />
      </div>

      {/* 6. Transformation Steps */}
      <section className="py-24 bg-white dark:bg-[#050510]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 text-gray-900 dark:text-white">
            <h2 className="text-4xl sm:text-6xl font-black mb-6">
              {t.landing.transformation.title}
            </h2>
            <p className="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Setting up your digital presence takes less time than drinking a cup of chai.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {[
              { icon: Smartphone, label: t.landing.transformation.step1, desc: 'Enter your business details & brand colors' },
              { icon: QrCode, label: t.landing.transformation.step2, desc: 'Generate your instant QR & dynamic link' },
              { icon: UserCheck, label: t.landing.transformation.step3, desc: 'Start meeting customers & saving leads' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-3xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-xl shadow-primary-500/5 rotate-3 transition-transform hover:rotate-0 border border-primary-100 dark:border-primary-800">
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{step.label}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 font-medium">{step.desc}</p>
                <div className="text-6xl font-black text-primary-500 opacity-5">0{i+1}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ROI Calculator */}
      <div id="roi">
        <ROICalculator />
      </div>

      {/* 8. Pricing Plans */}
      <PublicPricingSection />


      {/* 9. Directory Validation */}
      <DirectoryValidationSection />

      {/* 10. Outcome Grid */}
      <OutcomeFeatureGrid />

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden bg-[#050510]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-purple-900/40 to-blue-900/40"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <h2 className="text-5xl sm:text-7xl font-black text-white leading-tight mb-8">
                Ready to Join the <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent italic">Digital Map?</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  href="/register" 
                  className="px-12 py-6 bg-primary-600 text-white font-bold rounded-2xl text-xl shadow-2xl shadow-primary-600/30 hover:bg-primary-500 hover:scale-110 transition-all flex items-center justify-center gap-3"
                >
                  {t.landing.finalCta.startFree}
                  <ArrowRight className="w-6 h-6" />
                </Link>
                <a 
                    href={whatsappLink}
                    className="px-12 py-6 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold rounded-2xl text-xl transition-all"
                >
                  {t.landing.finalCta.bookDemo}
                </a>
              </div>
            </motion.div>
        </div>
      </section>

      <CommonFooter />

      {/* Scroll Progress */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-primary-500 origin-left z-[200]"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
