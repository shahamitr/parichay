'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Smartphone, Sparkles, Building2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HeroSection() {
  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 h-16 z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-100/60">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-gray-900">Parichay</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-500">
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-[13px] font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">
              Sign in
            </Link>
            <Link href="/register" className="h-9 px-5 flex items-center text-[13px] font-semibold text-white bg-[#0F172A] hover:bg-gray-800 rounded-lg transition-all shadow-sm">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 px-6">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[5%] w-[500px] h-[500px] bg-violet-200/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-xs mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">AI-Powered Business Profiles</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[clamp(32px,5.5vw,64px)] font-extrabold leading-[1.08] tracking-[-0.04em] text-[#0F172A]"
          >
            Build Your Digital Identity
            <br />
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
              in Minutes.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="mt-6 text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            No coding. No designer. No complicated setup.
            <br className="hidden sm:block" />
            Just tell Parichay about your business and go live instantly.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3} initial="hidden" animate="visible" variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/register"
              className="group h-[52px] px-8 flex items-center gap-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[15px] font-semibold rounded-xl transition-all shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Start Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#live-demo"
              className="h-[52px] px-7 flex items-center gap-2 text-[14px] font-medium text-gray-600 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-white transition-all"
            >
              See Live Demo
            </a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            custom={4} initial="hidden" animate="visible" variants={fadeUp}
            className="mt-12 flex flex-wrap justify-center gap-5 text-[12px] text-gray-400 font-medium"
          >
            <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-indigo-500" />Works on Mobile</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-violet-500" />AI-Powered</span>
            <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-cyan-500" />Made for Small Businesses</span>
          </motion.div>

          {/* Product Mockup — Browser Frame */}
          <motion.div
            custom={5} initial="hidden" animate="visible" variants={fadeUp}
            className="mt-16 max-w-3xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-b from-indigo-100/40 to-transparent rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-200/80 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-white border border-gray-200 rounded-lg text-[11px] text-gray-400 font-mono">
                      parichay.io/your-business
                    </div>
                  </div>
                </div>
                {/* Mockup content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Profile card */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold">G</div>
                      <div>
                        <div className="h-4 w-36 bg-gray-200 rounded" />
                        <div className="h-3 w-24 bg-gray-100 rounded mt-1.5" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 w-24 bg-indigo-100 rounded-lg" />
                      <div className="h-9 w-24 bg-green-100 rounded-lg" />
                      <div className="h-9 w-24 bg-blue-100 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-4/5 bg-gray-100 rounded" />
                      <div className="h-3 w-3/5 bg-gray-100 rounded" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-20 bg-gray-100 rounded-xl" />
                      <div className="h-20 bg-gray-100 rounded-xl" />
                      <div className="h-20 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                  {/* Side stats */}
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                      <div className="text-lg font-bold text-indigo-700">248</div>
                      <div className="text-[10px] text-indigo-500">Views today</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <div className="text-lg font-bold text-emerald-700">12</div>
                      <div className="text-[10px] text-emerald-500">New leads</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <div className="text-lg font-bold text-amber-700">4.9</div>
                      <div className="text-[10px] text-amber-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
