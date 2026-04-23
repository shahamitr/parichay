'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, AlertTriangle, Zap, Users, Share2, EyeOff, Search } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export default function EmotionalProblemSection() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section className="py-24 bg-white dark:bg-[#050510] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-white"
          >
            {t.landing.problem.title}
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* BEFORE: The Pain */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800"
          >
            <div className="absolute top-4 right-4 text-neutral-300 dark:text-neutral-700 font-black text-6xl opacity-20 pointer-events-none">
              BEFORE
            </div>
            
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 flex items-center gap-3">
              <AlertTriangle className="text-red-600 dark:text-red-500 w-6 h-6" />
              Impact of Being Invisible
            </h3>

            <div className="space-y-6">
              {[
                { icon: EyeOff, label: t.landing.problem.before.invisible },
                { icon: XCircle, label: t.landing.problem.before.lostCards },
                { icon: Search, label: t.landing.problem.before.noFollowups },
                { icon: Users, label: t.landing.problem.before.forgotten },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  variants={itemVariants}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-800 shadow-md border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-neutral-800 dark:text-neutral-200 font-bold">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Visual breakdown effect */}
            <div className="mt-8 flex justify-center">
              <motion.div
                animate={{ rotate: [0, -1, 1, -1, 0], scale: [1, 0.98, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-full h-1 bg-red-500/20 rounded-full"
              />
            </div>
          </motion.div>

          {/* AFTER: The Transformation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative p-8 rounded-3xl bg-primary-600 shadow-2xl shadow-primary-600/20 overflow-hidden"
          >
            {/* Animated particles background */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -100], 
                    opacity: [0, 1, 0],
                    x: Math.random() * 400 
                  }}
                  transition={{ duration: 3 + i, repeat: Infinity, delay: i }}
                  className="absolute bottom-0 w-1 h-1 bg-white rounded-full"
                />
              ))}
            </div>

            <div className="absolute top-4 right-4 text-white font-black text-6xl opacity-10 pointer-events-none">
              AFTER
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <Zap className="text-yellow-300 w-6 h-6 fill-yellow-300" />
              Connected & Discoverable
            </h3>

            <div className="space-y-6 relative z-10">
              {[
                { icon: Share2, label: t.landing.problem.after.instantShare },
                { icon: CheckCircle2, label: t.landing.problem.after.leadCapture },
                { icon: Zap, label: t.landing.problem.after.reachable },
                { icon: Users, label: t.landing.problem.after.repeatBusiness },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  variants={itemVariants}
                  whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-white shadow-inner">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-white font-black text-lg drop-shadow-md">{item.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="mt-8 p-4 bg-yellow-400 rounded-2xl text-primary-900 font-black text-center uppercase tracking-tighter text-xl shadow-xl shadow-yellow-400/30"
            >
              10x More Engagement
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
