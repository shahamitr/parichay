'use client';

import React, { useState } from 'react';
import { 
  Check, 
  ExternalLink, 
  Search, 
  MapPin, 
  Globe, 
  Shield, 
  Zap, 
  Activity, 
  Radio, 
  Cpu, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DirectoryValidationSection() {
  const [activeTab, setActiveTab] = useState('google');

  const directories = [
    {
      id: 'google',
      name: 'Google Places',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      description: 'Your business synchronized with Google Search and Maps instantly.',
      features: [
        'Proprietary GMB Sync',
        'Review Aggregation',
        'Local SEO Injection'
      ]
    },
    {
      id: 'apple',
      name: 'Apple Maps',
      icon: <MapPin className="w-6 h-6" />,
      color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      description: 'Establish your presence for millions of iPhone users worldwide.',
      features: [
        'Maps Connect Sync',
        'Siri Discovery',
        'Location Intelligence'
      ]
    },
    {
      id: 'meta',
      name: 'Meta Network',
      icon: <Radio className="w-6 h-6" />,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      description: 'Unified presence across Facebook and Instagram local networks.',
      features: [
        'Cross-Platform Sync',
        'Direct Messaging',
        'Social Authority'
      ]
    }
  ];

  const activeDir = directories.find(d => d.id === activeTab) || directories[0];

  return (
    <section className="py-32 relative bg-[#0a0a0c] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8"
          >
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-200">Network Orchestration</span>
          </motion.div>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tight text-white mb-8">
            The Discovery <span className="text-indigo-400 italic">Network.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 font-medium">
            We don't just create a profile. We deploy your business across the world's most powerful discovery platforms.
          </p>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-[3rem] p-8 lg:p-12">
          <div className="grid lg:grid-cols-12 gap-12">
             {/* Tab Sidebar */}
             <div className="lg:col-span-4 space-y-4">
                {directories.map((dir) => (
                   <button
                     key={dir.id}
                     onClick={() => setActiveTab(dir.id)}
                     className={`w-full flex items-center gap-4 p-6 rounded-2xl transition-all text-left border ${
                       activeTab === dir.id 
                         ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20' 
                         : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                     }`}
                   >
                      <div className={activeTab === dir.id ? 'text-white' : 'text-indigo-400'}>
                         {dir.icon}
                      </div>
                      <div className="font-bold uppercase tracking-widest text-sm">{dir.name}</div>
                   </button>
                ))}
             </div>

             {/* Content Area */}
             <div className="lg:col-span-8">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-10 flex flex-col justify-between"
                >
                   <div>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${activeDir.color} border`}>
                         {activeDir.icon}
                      </div>
                      <h3 className="text-4xl font-black text-white mb-6 tracking-tighter">{activeDir.name} Synchronization.</h3>
                      <p className="text-slate-400 text-lg leading-relaxed mb-10">{activeDir.description}</p>
                      
                      <div className="grid sm:grid-cols-3 gap-6 mb-12">
                         {activeDir.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                               <Check className="w-5 h-5 text-emerald-400" />
                               <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{f}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-3">
                         <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Synchronization Ready</span>
                      </div>
                      <button className="flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20">
                         Initiate Sync Protocol
                         <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                </motion.div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}