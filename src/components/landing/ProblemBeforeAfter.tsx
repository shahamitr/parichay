'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, AlertCircle, TrendingUp, Users, EyeOff } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export default function ProblemBeforeAfter() {
  const { t } = useTranslation();

  return (
    <section className="py-32 px-6 lg:px-8 bg-[#050507]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-200">The Hidden Cost of Staying Offline</span>
          </motion.div>
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            Before vs <span className="text-indigo-500">After</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* LEFT: Offline Reality */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative p-12 rounded-[3rem] bg-white/5 border border-white/5 overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <EyeOff className="w-32 h-32 text-red-500" />
            </div>
            
            <h3 className="text-3xl font-black text-white mb-8 tracking-tight">Offline Reality</h3>
            <div className="space-y-6">
              {[
                { text: t.landing.problem.before.lostCards, icon: <XCircle className="text-red-500" /> },
                { text: t.landing.problem.before.noFollowups, icon: <XCircle className="text-red-500" /> },
                { text: t.landing.problem.before.forgotten, icon: <XCircle className="text-red-500" /> },
                { text: t.landing.problem.before.invisible, icon: <XCircle className="text-red-500" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-400 font-medium text-lg">
                  <div className="shrink-0">{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm font-bold italic">
              "Most businesses are forgotten within 24 hours of a meeting."
            </div>
          </motion.div>

          {/* RIGHT: Digital Presence */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative p-12 rounded-[3rem] bg-indigo-500/10 border border-indigo-500/20 shadow-2xl shadow-indigo-500/5 overflow-hidden"
          >
            <div className="absolute -inset-24 bg-indigo-500/10 blur-[100px] rounded-full"></div>
            
            <h3 className="relative text-3xl font-black text-white mb-8 tracking-tight">With Parichay</h3>
            <div className="relative space-y-6">
              {[
                { text: t.landing.problem.after.instantShare, icon: <CheckCircle2 className="text-emerald-500" /> },
                { text: t.landing.problem.after.leadCapture, icon: <CheckCircle2 className="text-emerald-500" /> },
                { text: t.landing.problem.after.reachable, icon: <CheckCircle2 className="text-emerald-500" /> },
                { text: t.landing.problem.after.repeatBusiness, icon: <CheckCircle2 className="text-emerald-500" /> },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 text-slate-100 font-bold text-xl"
                >
                  <div className="shrink-0">{item.icon}</div>
                  {item.text}
                </motion.div>
              ))}
            </div>

            <div className="relative mt-12 grid grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <TrendingUp className="w-6 h-6 text-indigo-400 mb-2" />
                  <div className="text-2xl font-black text-white">4x</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black">Retention</div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <Users className="w-6 h-6 text-emerald-400 mb-2" />
                  <div className="text-2xl font-black text-white">100%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black">Discovery</div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
