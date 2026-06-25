'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  MessageSquare,
  Activity,
  Cpu,
  Radio
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export default function OutcomeFeatureGrid() {
  const { t } = useTranslation();

  const outcomes = [
    {
      title: t.landing.outcomes.neverLose,
      description: 'Your business profile projects a professional, verified identity that builds instant trust.',
      icon: ShieldCheck,
      color: 'bg-indigo-500/10 text-indigo-400',
      tag: 'Identity'
    },
    {
      title: 'Global Reach',
      description: 'Sync your business across Google, Bing, and major local directories with one click.',
      icon: Globe,
      color: 'bg-emerald-500/10 text-emerald-400',
      tag: 'Visibility'
    },
    {
      title: t.landing.outcomes.turnConvo,
      description: 'Capture and convert customer interest instantly through high-impact CTA nodes.',
      icon: TrendingUp,
      color: 'bg-indigo-500/10 text-indigo-400',
      tag: 'Growth'
    },
    {
      title: 'Real-Time Discovery',
      description: 'Our network ensures your business appears exactly when customers search nearby.',
      icon: Target,
      color: 'bg-emerald-500/10 text-emerald-400',
      tag: 'Connectivity'
    },
  ];

  return (
    <section className="py-32 px-6 lg:px-8 bg-[#0a0a0c]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
           <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            Choose Your <span className="text-indigo-400">Impact.</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {outcomes.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 bg-[#121214] border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all text-left"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">{item.tag}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{item.description}</p>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2">
                Learn More <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <FeaturesShowcase />
    </section>
  );
}

export const FeaturesShowcase = () => {
  const features = [
    {
      title: 'Neural Sync',
      desc: 'Proprietary technology that keeps your business data unified across the global network.',
      icon: <Cpu />
    },
    {
      title: 'Local Relay',
      desc: 'Broadcast your services to active customers within a hyper-local radius.',
      icon: <Radio />
    },
    {
      title: 'Pulse Analytics',
      desc: 'Deep insights into how customers discover and interact with your business node.',
      icon: <Activity />
    }
  ];

  return (
    <div className="py-32 relative overflow-hidden">
       <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
             <div className="flex-1 space-y-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                   <Zap className="w-3.5 h-3.5 text-indigo-400" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">The Technology</span>
                </div>
                <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-white leading-none">
                   High-Fidelity <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Digital Infrastructure.</span>
                </h2>
                <div className="space-y-4">
                   {features.map((f, i) => (
                      <div key={i} className="flex gap-6 p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all">
                         <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            {React.cloneElement(f.icon as React.ReactElement, { className: 'w-6 h-6' })}
                         </div>
                         <div>
                            <div className="text-white font-bold mb-1">{f.title}</div>
                            <div className="text-slate-400 text-sm leading-relaxed">{f.desc}</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="flex-1 relative">
                <div className="absolute -inset-10 bg-indigo-500/20 blur-[120px] rounded-full"></div>
                <div className="relative z-10 p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem]">
                   <div className="bg-[#121214] rounded-[2.8rem] p-10 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-8">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      </div>
                      <div className="space-y-8">
                         <div className="h-4 bg-white/10 rounded-full w-24"></div>
                         <div className="space-y-4">
                            <div className="h-8 bg-white/5 rounded-2xl w-full"></div>
                            <div className="h-8 bg-white/5 rounded-2xl w-3/4"></div>
                            <div className="h-8 bg-white/5 rounded-2xl w-1/2"></div>
                         </div>
                         <div className="aspect-video bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] flex items-center justify-center">
                            <Activity className="w-12 h-12 text-indigo-400 opacity-50" />
                         </div>
                         <div className="h-16 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-indigo-600/20">
                            Status: Optimized
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
