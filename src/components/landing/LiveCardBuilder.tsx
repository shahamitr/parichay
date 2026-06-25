'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import Link from 'next/link';
import { Mail, Phone, Globe, Briefcase, User, MapPin, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const THEMES = [
  { id: 'indigo', gradient: 'from-indigo-600 to-indigo-400', hex: '#4F46E5', name: 'Arctic Indigo' },
  { id: 'emerald', gradient: 'from-emerald-600 to-emerald-400', hex: '#10B981', name: 'Forest Emerald' },
  { id: 'violet', gradient: 'from-violet-600 to-fuchsia-500', hex: '#8B5CF6', name: 'Royal Violet' },
  { id: 'slate', gradient: 'from-slate-700 to-slate-500', hex: '#334155', name: 'Midnight Slate' },
  { id: 'rose', gradient: 'from-rose-500 to-orange-400', hex: '#F43F5E', name: 'Sunset Rose' },
];

export default function LiveCardBuilder() {
  const [formData, setFormData] = useState({
    name: 'Aarav Sharma',
    role: 'Freelance Designer',
    company: 'Pixel Craft Studio',
    theme: THEMES[0],
  });

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const phoneRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const generationSteps = [
    "Analyzing Identity...",
    "Optimizing Network Node...",
    "Deploying Digital Presence...",
    "Finalizing Node Protocol..."
  ];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!phoneRef.current) return;
    const rect = phoneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (theme: typeof THEMES[0]) => {
    setFormData((prev) => ({ ...prev, theme }));
  };

  const queryParams = new URLSearchParams({
    name: formData.name,
    role: formData.role,
    company: formData.company,
  }).toString();

  const handleGenerate = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    let step = 0;
    const interval = setInterval(() => {
        step++;
        if (step >= generationSteps.length) {
            clearInterval(interval);
            setTimeout(() => {
                window.location.href = `/register?${queryParams}`;
            }, 500);
        } else {
            setGenStep(step);
        }
    }, 800);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24 py-20 px-6">
      
      {/* LEFT PANE: Builder Panel */}
      <div className="w-full lg:w-[50%] relative z-20 space-y-10">
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">Interactive Demo</span>
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-black tracking-tight text-white leading-[0.9]">
            Identity is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Everything.</span>
          </h2>

          <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
            For individuals, freelancers, and small businesses—your digital presence starts here. Type your details and watch the node build in real-time.
          </p>
        </div>

        {/* The Builder Panel */}
        <div className="bg-[#121214] border border-white/10 rounded-[3rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden group">
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-[#080809]/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center"
              >
                  <div className="w-24 h-24 mb-8 relative">
                      <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                      <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-4 border-t-indigo-500 rounded-full"
                      ></motion.div>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">{generationSteps[genStep]}</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Orchestrating Network Node...</p>
                  <div className="w-full max-w-xs h-1 bg-white/5 rounded-full mt-10 overflow-hidden">
                      <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(genStep + 1) * 25}%` }}
                          className="h-full bg-indigo-500"
                      />
                  </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Your Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/5 text-white rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder-slate-600"
                    placeholder="Enter Name"
                    maxLength={40}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Job / Passion</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/5 text-white rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder-slate-600"
                    placeholder="Freelancer, Owner, etc."
                    maxLength={40}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Business / Studio</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/5 text-white rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder-slate-600"
                  placeholder="Company Name"
                  maxLength={40}
                />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Select Aesthetic</label>
              <div className="flex gap-4">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme)}
                    className={`w-10 h-10 rounded-full transition-all duration-300 transform ring-offset-4 ring-offset-[#121214] ${
                      formData.theme.id === theme.id ? 'scale-110 ring-2 ring-indigo-500 shadow-xl' : 'hover:scale-105 opacity-50'
                    }`}
                    style={{ background: theme.hex }}
                    aria-label={`Select ${theme.name} theme`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={handleGenerate}
                className={`w-full group/btn relative py-6 px-10 rounded-3xl text-white font-black text-xl flex items-center justify-center gap-3 overflow-hidden shadow-2xl transition-all hover:-translate-y-1 bg-gradient-to-r ${formData.theme.gradient}`}
              >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                Deploy My Presence
                <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <div className="text-center mt-6">
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">No Credit Card Required • Instant Activation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Live Phone Preview */}
      <div 
        className="w-full lg:w-[50%] relative lg:h-[700px] flex items-center justify-center perspective-[2000px] z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dynamic Glow */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${formData.theme.gradient} blur-[120px] opacity-10 rounded-full transition-all duration-700`}
        />

        {/* Phone Mockup */}
        <motion.div 
          ref={phoneRef}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-[320px] h-[640px] rounded-[3.5rem] bg-[#080809] shadow-2xl border-[10px] border-[#1a1a1e] overflow-hidden transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Internal Content */}
          <div className="h-full flex flex-col bg-[#080809]">
             {/* Banner */}
             <div className={`h-[200px] w-full bg-gradient-to-br ${formData.theme.gradient} relative transition-all duration-500`}>
                <div className="absolute top-8 left-0 right-0 flex justify-center">
                   <div className="w-[100px] h-[6px] bg-black/20 rounded-full"></div>
                </div>
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                   <div className="w-[110px] h-[110px] rounded-[2.5rem] bg-[#080809] p-1.5 shadow-2xl">
                      <div className={`w-full h-full rounded-[2.2rem] bg-gradient-to-br ${formData.theme.gradient} flex items-center justify-center text-white text-4xl font-black transition-all duration-500`}>
                        {getInitials(formData.name)}
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex-1 mt-20 px-8 text-center space-y-6">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black text-white truncate">{formData.name}</h3>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{formData.role}</p>
                </div>
                
                <div className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${formData.theme.gradient} shadow-lg transition-all duration-500`}>
                   {formData.company}
                </div>

                <div className="pt-6 grid grid-cols-2 gap-4">
                   <div className={`h-12 rounded-2xl bg-gradient-to-r ${formData.theme.gradient} flex items-center justify-center text-white font-black text-[10px] uppercase tracking-widest shadow-lg`}>
                      Connect
                   </div>
                   <div className="h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400">
                      <Globe className="w-5 h-5" />
                   </div>
                </div>

                <div className="space-y-3 text-left pt-4">
                   {[Mail, Phone, MapPin].map((Icon, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                         <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                            <Icon className="w-4 h-4" />
                         </div>
                         <div className={`h-2 bg-white/5 rounded-full ${i === 0 ? 'w-32' : i === 1 ? 'w-24' : 'w-40'}`}></div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Bottom bar */}
             <div className="p-8 mt-auto flex justify-center">
                <div className="w-32 h-1 bg-white/5 rounded-full"></div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
