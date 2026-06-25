'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, WifiOff, Users, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export default function UrgencyLossSection() {
  const { t } = useTranslation();

  return (
    <section className="py-40 px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background Warning Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full"
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-200">Survival of the Digital</span>
            </motion.div>

            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9]">
              What You're <span className="text-red-500">Losing</span> <br />
              Right Now.
            </h2>

            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
              Every day you remain invisible on the digital map, you are handing your customers over to competitors who are already there.
            </p>

            <div className="space-y-6">
              {[
                { title: '80% Connection Decay', desc: 'Most business contacts are lost forever within hours of meeting.', icon: <Clock /> },
                { title: 'Invisible to Local Search', desc: 'Customers looking for you nearby find someone else instead.', icon: <WifiOff /> },
                { title: 'Zero Data Continuity', desc: 'Without digital capture, you have no way to re-engage past customers.', icon: <Users /> },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    {React.cloneElement(item.icon as React.ReactElement, { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Loss Representation */}
          <div className="relative aspect-square flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent blur-[100px] rounded-full"></div>
             
             {/* Animated Broken Nodes */}
             <div className="relative w-full h-full flex items-center justify-center">
                <motion.div
                  animate={{ 
                    opacity: [0.2, 0.5, 0.2],
                    scale: [0.95, 1.05, 0.95]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-64 h-64 border-2 border-dashed border-red-500/20 rounded-full flex items-center justify-center"
                >
                   <div className="text-center">
                      <div className="text-7xl font-black text-red-500 mb-2">-64%</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-red-300">Revenue Leakage</div>
                   </div>
                </motion.div>

                {/* Floating "Forgotten" nodes */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -50, 0],
                      opacity: [0.3, 0, 0.3],
                      x: [0, (i % 2 === 0 ? 30 : -30), 0]
                    }}
                    transition={{ 
                      duration: 3 + i, 
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                    className="absolute w-4 h-4 bg-red-500/30 rounded-full blur-sm"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`
                    }}
                  />
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
