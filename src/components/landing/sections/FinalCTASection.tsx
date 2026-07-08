'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Gradient orb */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 opacity-80 blur-sm" />

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            Ready to build your<br /> digital identity?
          </h2>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">
            Professional online presence in minutes. Built to grow with you.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group h-[52px] px-8 flex items-center justify-center gap-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[15px] font-semibold rounded-xl transition-all shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30"
            >
              Start Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="h-[52px] px-8 flex items-center justify-center text-[14px] font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
