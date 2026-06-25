'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  Target, 
  TrendingUp,
  XCircle,
  CheckCircle2
} from 'lucide-react';

export default function EmotionalProblemSection() {
  const painPoints = [
    {
      title: 'Digital Invisibility',
      desc: 'Customers searching for your services find your competitors because you don’t have a verified digital presence.',
      icon: <XCircle className="w-6 h-6 text-red-400" />
    },
    {
      title: 'Broken Connections',
      desc: 'Paper cards are lost or forgotten. 80% of business leads are lost within the first 48 hours of a meeting.',
      icon: <AlertCircle className="w-6 h-6 text-orange-400" />
    }
  ];

  const solutions = [
    {
      title: 'Instant Authority',
      desc: 'A professional profile that syncs across global networks, giving you immediate trust and visibility.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />
    },
    {
      title: 'Seamless Leads',
      desc: 'Capture and convert interest instantly through your digital identity. Never lose a customer again.',
      icon: <Target className="w-6 h-6 text-indigo-400" />
    }
  ];

  return (
    <section className="py-32 relative bg-[#080809] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full mb-8"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-200">The Growth Barrier</span>
          </motion.div>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tight text-white mb-8">
            Stop Being <span className="text-red-400">Invisible</span>. <br />
            Start Being <span className="text-emerald-400">Found</span>.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pain Points */}
          <div className="space-y-6">
            <div className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 pl-4 border-l-2 border-red-500/30">The Current Reality</div>
            {painPoints.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white/5 border border-white/5 rounded-[2rem] group hover:bg-red-500/5 hover:border-red-500/20 transition-all"
              >
                <div className="flex gap-6">
                   <div className="shrink-0">{item.icon}</div>
                   <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solutions */}
          <div className="space-y-6">
            <div className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 pl-4 border-l-2 border-emerald-500/30">The Parichay Impact</div>
            {solutions.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white/5 border border-white/5 rounded-[2rem] group hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all"
              >
                <div className="flex gap-6">
                   <div className="shrink-0">{item.icon}</div>
                   <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ROI Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 p-12 bg-indigo-600 rounded-[3rem] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
               <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 italic">"Businesses with a digital presence grow 4x faster."</h3>
            <p className="text-indigo-100 font-bold uppercase tracking-widest text-sm">Empower your grassroots economy now.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
