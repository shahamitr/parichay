'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ParichayLogo from '@/components/ui/ParichayLogo';
import { Globe, ShieldCheck, Zap, TrendingUp, MapPin, MousePointer2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const highlights = [
  {
    title: "India's Local Business Map",
    desc: "Join thousands of merchants getting discovered every day.",
    icon: MapPin
  },
  {
    title: "Professional Digital Card",
    desc: "Share your business identity via WhatsApp in one tap.",
    icon: Zap
  },
  {
    title: "Secure & Verified",
    desc: "Build massive trust with our verified business badge.",
    icon: ShieldCheck
  }
];

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % highlights.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAFB] dark:bg-[#050510]">
      {/* Left Panel: Real-Feel Animated Visuals */}
      <div className="hidden md:flex md:w-1/2 lg:w-[48%] relative overflow-hidden bg-[#0A0A1B] flex-col justify-between p-12 lg:p-20">
        {/* Real Network Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
            alt="Network"
            className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A1B] via-[#0A0A1B]/80 to-primary-900/40"></div>
        </div>

        {/* Live SVG Connection Animation - Looking "Real" */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-40">
           <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
             <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
           </pattern>
           <rect width="100%" height="100%" fill="url(#grid)" />
           
           {/* Animated connection lines */}
           <motion.path
             d="M100,200 Q300,100 500,400"
             stroke="rgba(59, 130, 246, 0.5)"
             strokeWidth="2"
             fill="none"
             strokeDasharray="10 10"
             animate={{ strokeDashoffset: [-20, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           />
           <motion.path
             d="M200,600 Q400,500 600,700"
             stroke="rgba(139, 92, 246, 0.5)"
             strokeWidth="2"
             fill="none"
             strokeDasharray="10 10"
             animate={{ strokeDashoffset: [20, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
           />
        </svg>

        {/* Logo and Content */}
        <div className="relative z-20">
          <Link href="/">
             <ParichayLogo variant="icon" size="xl" animated />
          </Link>
        </div>

        {/* Hollywood Armageddon Cinematic Background */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {/* Scan Lines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
          
          {/* Noise Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-40"></div>

          {/* Intense Background Glow */}
          <div className="absolute -bottom-20 -left-20 w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[160px]"></div>
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[140px]"></div>
          
          {/* Fiery Dust / Embers - CSS Optimized */}
          <div className="ember-container">
            <div className="ember"></div>
            <div className="ember"></div>
            <div className="ember"></div>
            <div className="ember"></div>
            <div className="ember"></div>
            <div className="ember"></div>
            <div className="ember"></div>
            <div className="ember"></div>
            <div className="ember"></div>
            <div className="ember"></div>
            <div className="ember"></div>
            <div className="ember"></div>
          </div>


          {/* Dramatic Planetary / Asteroid Element (Armageddon Feel) */}
          <motion.div
            className="absolute -right-40 top-[10%] w-[800px] h-[800px] opacity-40 mix-blend-screen"
            animate={{ 
              rotate: -5,
              scale: [1, 1.05, 1],
              x: [0, -20, 0]
            }}
            transition={{ 
              duration: 20, repeat: Infinity, ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-black/80 rounded-full z-20 shadow-[inset_-20px_20px_100px_rgba(249,115,22,0.3)]"></div>
            <img 
              src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover rounded-full grayscale brightness-50 contrast-150"
              alt="Planet Surface"
            />
            {/* Atmospheric Fire Glow */}
            <div className="absolute inset-0 rounded-full border-[10px] border-orange-500/20 blur-md"></div>
          </motion.div>
        </div>

        <div className="relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {(() => {
                const HighlightIcon = highlights[activeStep].icon;
                return (
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-orange-600/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                    <HighlightIcon className="w-4 h-4" />
                    {highlights[activeStep].title}
                  </div>
                );
              })()}
              <h2 className="text-4xl lg:text-7xl font-black text-white leading-[1] tracking-tighter">
                IMPACT EVERY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-red-600">LOCAL NODE.</span>
              </h2>
              <p className="text-xl text-neutral-400 max-w-sm leading-relaxed font-medium">
                {highlights[activeStep].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4 mt-12">
            {highlights.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-700 ${i === activeStep ? 'w-16 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)]' : 'w-4 bg-white/10'}`} 
              />
            ))}
          </div>
        </div>

        {/* Cinematic Status Widget */}
        <div className="relative z-20">
            <div className="flex items-center gap-8 p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[40px] w-fit shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-transparent"></div>
                <div className="relative">
                    <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-700 opacity-80"></div>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                          transition={{ duration: 15, repeat: Infinity }}
                          className="absolute inset-0 border-4 border-white/10 rounded-full m-2"
                        ></motion.div>
                        <Zap className="text-white w-10 h-10 relative z-10 drop-shadow-lg" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 border-4 border-[#050510] rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
                </div>
                <div className="relative">
                   <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-black text-lg tracking-tight uppercase">Terminal Activated</span>
                      <span className="text-[10px] bg-green-500/20 text-green-400 font-black px-3 py-1 rounded-full border border-green-500/30">SYSTEM LIVE</span>
                   </div>
                   <p className="text-neutral-400 font-bold">New deployment detected in Ahmedabad Node</p>
                </div>
            </div>
        </div>
      </div>

      {/* Right Panel: Clean Form Content */}
      <div className="flex-1 min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 py-12 lg:px-20">
        <div className="w-full max-w-md relative z-10">
          <div className="mb-12 md:hidden">
            <Link href="/">
              <ParichayLogo variant="full" size="lg" animated />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-3">
              {title}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-10">
              {subtitle}
            </p>

            <div className="w-full">
              {children}
            </div>
          </motion.div>
        </div>

        {/* Dynamic Background elements for right side */}
        <div className="absolute top-[10%] right-[5%] w-64 h-64 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[5%] w-72 h-72 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Subtle SVG Grid for Right Side */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
           <pattern id="grid-light" width="30" height="30" patternUnits="userSpaceOnUse">
             <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
           </pattern>
           <rect width="100%" height="100%" fill="url(#grid-light)" />
        </svg>
      </div>
    </div>
  );
}
