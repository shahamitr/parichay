'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';
import { Globe, MapPin, MousePointer2, Sparkles, ArrowRight, Play, UserCheck, Zap, Shield, Activity } from 'lucide-react';
import Link from 'next/link';

export default function GlobalMapHero() {
  const { t, language } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);

  const dynamicTexts = useMemo(() => {
    if (language === 'hi') {
      return ["डिजिटल नक्शे पर", "ऑनलाइन दुनिया में", "विश्व स्तर पर"];
    }
    if (language === 'gu') {
      return ["ડિજિટલ નકશા પર", "ઓનલાઇન વિશ્વમાં", "વૈશ્વિક સ્તરે"];
    }
    return ["the Digital Map", "the Online World", "the Global Stage"];
  }, [language]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [dynamicTexts.length]);

  if (!mounted) return null;

  return (
    <section className="relative min-h-[100vh] bg-[#020617] overflow-hidden flex items-center pt-20">
      {/* Cinematic Embers from cinematic.css */}
      <div className="ember-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="ember" />
        ))}
      </div>

      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* High-End Background Earth (Shifted Right) */}
      <div className="absolute top-0 right-0 bottom-0 w-full lg:w-1/2 pointer-events-none overflow-hidden opacity-40">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
          className="relative w-full h-full flex items-center justify-center scale-150 lg:scale-[2]"
        >
          <div className="w-[800px] h-[800px] rounded-full bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=1200')] bg-cover shadow-[0_0_120px_rgba(37,99,235,0.3)] border border-white/5"></div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-xl group">
                  <Activity className="w-4 h-4 text-primary-400 group-hover:animate-pulse" />
                  <span className="text-[10px] font-black text-primary-200 uppercase tracking-[0.5em]">Network Status: Global Dominion</span>
                </div>

                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter">
                  {language === 'en' ? "Claim Your" : language === 'hi' ? "दावा करें" : "દાવો કરો"}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-blue-500 to-indigo-500 italic">
                     {language === 'en' ? "Dominion." : language === 'hi' ? "अधिराज्य का।" : "અધિરાજ્યનો."}
                  </span>
                </h1>

                <p className="text-xl text-neutral-400 font-medium leading-relaxed max-w-xl mb-12">
                   Stop being a ghost in your own city. Parichay orchestrates your business data across the entire digital ecosystem, transforming you from invisible to inevitable in minutes.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    href="/register"
                    className="group relative px-12 py-6 bg-primary-600 text-white font-black rounded-2xl text-xl shadow-2xl shadow-primary-600/40 hover:bg-primary-500 hover:scale-105 transition-all overflow-hidden flex items-center justify-center gap-4"
                  >
                    <span className="relative z-10 uppercase tracking-widest text-sm">Deploy Now</span>
                    <Zap className="w-5 h-5 group-hover:scale-125 transition-transform relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                  </Link>

                  <Link
                    href="/demo/industries"
                    className="flex items-center justify-center gap-4 px-12 py-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl text-xl transition-all group"
                  >
                    <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                    <span className="uppercase tracking-widest text-sm">Live Demos</span>
                  </Link>
                </div>

                <div className="mt-16 flex items-center gap-8 border-t border-white/5 pt-10">
                   <div className="space-y-1">
                      <p className="text-3xl font-black text-white">11</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Industries Live</p>
                   </div>
                   <div className="w-px h-10 bg-white/10"></div>
                   <div className="space-y-1">
                      <p className="text-3xl font-black text-white">5 min</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Setup Time</p>
                   </div>
                   <div className="w-px h-10 bg-white/10"></div>
                   <div className="space-y-1">
                      <p className="text-3xl font-black text-white">₹0</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">To Start</p>
                   </div>
                </div>
              </motion.div>
            </div>

            <div className="relative hidden lg:block">
              {/* Floating Product Mockup on Right - Enhanced 3D feel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: -10 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                whileHover={{ rotateY: 0, scale: 1.02 }}
                className="relative z-20 w-full max-w-[500px] aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/20 shadow-[0_80px_160px_rgba(0,0,0,0.7)] overflow-hidden"
              >
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                 <div className="p-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-600/50">
                             <UserCheck className="text-white w-7 h-7" />
                          </div>
                          <div>
                             <div className="h-5 w-40 bg-white/20 rounded-full mb-3"></div>
                             <div className="h-3 w-24 bg-white/10 rounded-full"></div>
                          </div>
                       </div>
                       <Shield className="w-8 h-8 text-primary-400 opacity-50" />
                    </div>

                    <div className="space-y-6 flex-1">
                       <div className="h-4 w-full bg-white/10 rounded-full"></div>
                       <div className="h-4 w-full bg-white/10 rounded-full"></div>
                       <div className="h-4 w-3/4 bg-white/10 rounded-full"></div>
                       <div className="grid grid-cols-3 gap-4 pt-4">
                          {[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 border border-white/10"></div>)}
                       </div>
                    </div>

                    <div className="mt-10 flex justify-between items-center border-t border-white/10 pt-8">
                       <div className="flex gap-3">
                          {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 text-[10px] font-bold">L{i}</div>)}
                       </div>
                       <div className="px-6 py-3 bg-primary-600/20 border border-primary-500/50 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-primary-400">Node Synchronized</div>
                    </div>
                 </div>
              </motion.div>

              {/* Floating Pulse Indicators */}
              <div className="absolute top-20 -left-10 w-4 h-4 bg-primary-500 rounded-full animate-ping"></div>
              <div className="absolute bottom-20 -right-4 w-3 h-3 bg-indigo-500 rounded-full animate-ping delay-700"></div>
            </div>
        </div>
      </div>
    </section>
  );
}

