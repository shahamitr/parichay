'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Globe, ShieldCheck, ArrowRight, Zap, Bell, MessageSquare } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export default function OutcomeFeatureGrid() {
  const { t } = useTranslation();

  const outcomes = [
    {
      title: t.landing.outcomes.neverLose,
      description: 'Your contacts are saved directly to their phone and your dashboard. No more lost paper.',
      icon: Target,
      color: 'from-blue-500 to-indigo-600',
      tag: 'Connectivity'
    },
    {
      title: t.landing.outcomes.turnConvo,
      description: 'Automatically follow up with leads and keep your business top-of-mind.',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      tag: 'Growth'
    },
    {
      title: t.landing.outcomes.reachable,
      description: 'Your digital presence works for you 24/7, across WhatsApp, Instagram, and Web.',
      icon: Globe,
      color: 'from-emerald-500 to-teal-600',
      tag: 'Availability'
    },
    {
      title: t.landing.outcomes.identity,
      description: 'Look professional from day one with a verified digital brand profile.',
      icon: ShieldCheck,
      color: 'from-orange-500 to-yellow-600',
      tag: 'Identity'
    },
  ];

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {outcomes.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-700 shadow-xl flex flex-col h-full transition-all"
            >
              <div className="flex-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                    {item.tag}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 leading-snug">
                  {item.title}
                </h3>
                
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-xs group-hover:gap-4 transition-all mt-auto pt-4 border-t border-neutral-50 dark:border-neutral-700/50">
                LEARN MORE
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <item.icon className="w-16 h-16 text-neutral-900 dark:text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
