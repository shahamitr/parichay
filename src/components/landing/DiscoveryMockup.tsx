'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ShieldCheck, ArrowRight } from 'lucide-react';

export default function DiscoveryMockup() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-[#0a0a0c]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Content */}
          <div className="order-2 lg:order-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">The Discovery Engine</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[1.1]">
              Get Found When <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Customers Search.</span>
            </h2>

            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              When someone searches for your service nearby, your business should appear—not your competitor's. Parichay synchronizes your node with Google, Bing, and Apple Maps instantly.
            </p>

            <ul className="space-y-4 pt-4">
              {[
                'Global directory synchronization',
                'Local SEO optimized profiles',
                'Verified trust badge across networks',
                'Instant Google Maps presence'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-100 font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Search Mockup */}
          <div className="order-1 lg:order-2 relative">
             {/* Glow behind mockup */}
             <div className="absolute -inset-10 bg-indigo-600/10 blur-[120px] rounded-full"></div>

             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               whileInView={{ opacity: 1, scale: 1, y: 0 }}
               className="relative bg-[#121214] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
             >
                {/* Search Bar Header */}
                <div className="p-6 bg-white/5 border-b border-white/5 flex items-center gap-4">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                   </div>
                   <div className="flex-1 h-10 bg-white/5 rounded-xl flex items-center px-4 gap-3 text-slate-500 text-sm font-bold">
                      <Search className="w-4 h-4" />
                      Services near me...
                   </div>
                </div>

                {/* Search Results */}
                <div className="p-8 space-y-6">
                   {/* Competitor (Dimmed) */}
                   <div className="p-6 rounded-2xl bg-white/2 opacity-30 grayscale blur-[1px]">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-4 w-32 bg-white/20 rounded-lg"></div>
                        <div className="h-4 w-12 bg-white/20 rounded-lg"></div>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-lg mb-2"></div>
                      <div className="h-2 w-3/4 bg-white/10 rounded-lg"></div>
                   </div>

                   {/* Parichay Business (Highlighted) */}
                   <motion.div
                     initial={{ x: 20, opacity: 0 }}
                     whileInView={{ x: 0, opacity: 1 }}
                     transition={{ delay: 0.5 }}
                     className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/30 relative overflow-hidden"
                   >
                      <div className="absolute top-0 right-0 p-4">
                         <div className="px-2 py-1 bg-emerald-500 text-[8px] font-black text-white rounded-full uppercase tracking-widest">Active Node</div>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white">
                            <MapPin className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-white leading-none">Your Business</h4>
                            <div className="flex items-center gap-1 text-yellow-500 mt-1">
                               <Star className="w-3 h-3 fill-current" />
                               <Star className="w-3 h-3 fill-current" />
                               <Star className="w-3 h-3 fill-current" />
                               <Star className="w-3 h-3 fill-current" />
                               <Star className="w-3 h-3 fill-current" />
                               <span className="text-[10px] font-black ml-1 text-slate-400">4.9 (Verified)</span>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-2 mb-6">
                         <div className="h-2 w-full bg-white/10 rounded-lg"></div>
                         <div className="h-2 w-2/3 bg-white/10 rounded-lg"></div>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
                         Connect Now <ArrowRight className="w-3 h-3" />
                      </div>
                   </motion.div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
