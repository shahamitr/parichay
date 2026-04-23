'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';
import { Globe, MapPin, MousePointer2, Sparkles, ArrowRight, Play, UserCheck, Zap } from 'lucide-react';
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
    <section className="relative min-h-[90vh] bg-[#020617] overflow-hidden flex items-center pt-20">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      
      {/* High-End Background Earth (Shifted Right) */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none overflow-hidden opacity-30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
          className="relative w-full h-full flex items-center justify-center scale-150"
        >
          <div className="w-[800px] h-[800px] rounded-full bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=1200')] bg-cover shadow-[0_0_100px_rgba(37,99,235,0.2)]"></div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-600/10 border border-primary-500/20 rounded-full mb-6 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  <span className="text-[10px] font-black text-primary-200 uppercase tracking-[0.4em]">The New Standard of Introduction</span>
                </div>
                
                <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                  {language === 'en' ? "Perfect Your" : language === 'hi' ? "बेहतरीन बनाएं" : "પરફેક્ટ બનાવો"}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 italic">
                     {language === 'en' ? "Introduction." : language === 'hi' ? "परिचय को।" : "પરિચયને."}
                  </span>
                </h1>
                
                <p className="text-lg text-neutral-400 font-medium leading-relaxed max-w-lg mb-10">
                   Parichay transforms every handshake into a lasting digital relationship. Capture leads, showcase products, and grow your local presence instantly.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link 
                    href="/register" 
                    className="group relative px-10 py-5 bg-primary-600 text-white font-black rounded-2xl text-lg shadow-xl shadow-primary-600/20 hover:bg-primary-500 hover:scale-105 transition-all overflow-hidden flex items-center justify-center gap-3"
                  >
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                  </Link>
                  
                  <button className="flex items-center justify-center gap-3 px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl text-lg transition-all">
                    <Play className="w-5 h-5 fill-white" />
                    Watch Demo
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="relative hidden lg:block">
              {/* Floating Product Mockup on Right */}
              <motion.div
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative z-20 w-full max-w-[450px] aspect-[4/3] bg-[#0F172A]/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent"></div>
                 <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg">
                          <UserCheck className="text-white w-6 h-6" />
                       </div>
                       <div>
                          <div className="h-4 w-32 bg-white/10 rounded-full mb-2"></div>
                          <div className="h-2 w-20 bg-white/5 rounded-full"></div>
                       </div>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                       <div className="h-3 w-full bg-white/5 rounded-full"></div>
                       <div className="h-3 w-full bg-white/5 rounded-full"></div>
                       <div className="h-3 w-2/3 bg-white/5 rounded-full"></div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                       <div className="flex gap-2">
                          {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10"></div>)}
                       </div>
                       <div className="px-4 py-2 bg-primary-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">Verified</div>
                    </div>
                 </div>
              </motion.div>

              {/* Floating Success Indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-10 -right-10 bg-emerald-500/20 backdrop-blur-2xl border border-emerald-500/30 p-6 rounded-3xl shadow-2xl z-30 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                  <Zap className="text-white w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm leading-none">Instant Activation</h4>
                  <p className="text-[10px] text-emerald-300 mt-1 uppercase tracking-widest font-black">Node Live: India</p>
                </div>
              </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
}
