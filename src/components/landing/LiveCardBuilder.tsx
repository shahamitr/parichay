'use client';

import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import Link from 'next/link';
import { Mail, Phone, Globe, Briefcase, User, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const THEMES = [
  { id: 'blue', gradient: 'from-blue-600 to-indigo-600', hex: '#4F46E5', name: 'Ocean' },
  { id: 'purple', gradient: 'from-purple-600 to-pink-600', hex: '#9333EA', name: 'Amethyst' },
  { id: 'emerald', gradient: 'from-emerald-500 to-teal-600', hex: '#10B981', name: 'Forest' },
  { id: 'rose', gradient: 'from-rose-500 to-orange-500', hex: '#F43F5E', name: 'Sunset' },
  { id: 'dark', gradient: 'from-neutral-800 to-black', hex: '#171717', name: 'Midnight' },
];

export default function LiveCardBuilder() {
  const [formData, setFormData] = useState({
    name: 'Aarav Sharma',
    role: 'Founding Partner',
    company: 'NextGen Innovations',
    theme: THEMES[0],
  });

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const phoneRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const generationSteps = [
    "Analyzing Brand Identity...",
    "Optimizing for SEO & Search...",
    "Configuring Global Map Node...",
    "Deploying Live Microsite..."
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
    <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
      
      {/* LEFT PANE: Hero Text & Form Builder */}
      <div className="w-full lg:w-[55%] relative z-20 space-y-8">
        
        {/* Launch Badge */}
        <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-blue-200/50 shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700 dark:text-gray-300">🚀 Experience Live Introduction Technology</span>
        </div>

        {/* Hero Title with Dynamic Aura */}
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]"></div>
          <h1 className="relative text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
            <span className="text-gray-900 dark:text-white">Turn Every Meeting</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              into a Lead
            </span>
          </h1>
          <div className="mt-4 flex items-center gap-2 text-primary-500 font-black text-xs uppercase tracking-widest animate-pulse">
            <Zap className="w-4 h-4 fill-current" />
            Active Microsite Generator Engine
          </div>
        </div>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl font-medium">
          Type your business details below. Watch our AI engine build your professional digital gateway in real-time.
        </p>

        {/* The Form Builder */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden">
          {isGenerating && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center"
            >
                <div className="w-20 h-20 mb-6 relative">
                    <div className="absolute inset-0 border-4 border-primary-500/30 rounded-full"></div>
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-t-primary-500 rounded-full"
                    ></motion.div>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{generationSteps[genStep]}</h3>
                <p className="text-neutral-400 font-medium">Sit tight, we are crafting your digital parichay...</p>
                <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(genStep + 1) * 25}%` }}
                        className="h-full bg-primary-500"
                    />
                </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="Your Name"
                  maxLength={40}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Job Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="e.g. Real Estate Agent"
                  maxLength={40}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Company Name
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="Your Company"
                  maxLength={40}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 mt-4">
              Choose Theme
            </label>
            <div className="flex gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  className={`w-8 h-8 rounded-full shadow-sm transition-all duration-300 transform outline-none focus:outline-none ${
                    formData.theme.id === theme.id ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-gray-900' : 'hover:scale-110'
                  }`}
                  style={{ background: theme.hex }}
                  aria-label={`Select ${theme.name} theme`}
                  title={theme.name}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleGenerate}
              className={`flex-[2] py-4 px-2 rounded-xl text-white font-black text-xl text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r ${formData.theme.gradient}`}
            >
              Generate My Microsite
              <span className="block text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Free Introduction Gateway</span>
            </button>
            <Link 
              href="/demo"
              className={`flex-[1] flex items-center justify-center py-4 px-2 rounded-xl text-gray-900 dark:text-white font-black text-xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 backdrop-blur-md hover:bg-gray-50 dark:hover:bg-gray-700 uppercase`}
            >
              Demo
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Live Phone Preview */}
      <div 
        className="w-full lg:w-[45%] relative lg:h-[650px] flex items-center justify-center perspective-[1000px] z-10 mt-12 lg:mt-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow behind phone */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${formData.theme.gradient} blur-[80px] opacity-20 rounded-full transition-all duration-700`}
        />

        {/* 3D Phone Mockup Container */}
        <div 
          ref={phoneRef}
          className="relative w-[300px] h-[600px] rounded-[40px] bg-black shadow-2xl border-[8px] border-neutral-900 transition-transform duration-200 ease-out preserve-3d"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Phone Screen */}
          <div className="absolute inset-0 rounded-[32px] overflow-hidden bg-white dark:bg-neutral-900 flex flex-col">
            {/* Top Notch */}
            <div className="absolute top-0 inset-x-0 h-[24px] flex justify-center z-50">
              <div className="w-[120px] h-[24px] bg-black rounded-b-2xl"></div>
            </div>

            {/* Live Profile Header */}
            <div className={`h-[180px] w-full bg-gradient-to-br ${formData.theme.gradient} relative transition-all duration-500`}>
              {/* Profile Picture overlapping banner */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-[100px] h-[100px] rounded-full bg-white dark:bg-neutral-800 p-1 shadow-lg">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${formData.theme.gradient} flex items-center justify-center text-white text-3xl font-bold transition-all duration-500`}>
                    {getInitials(formData.name)}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="flex-1 mt-14 px-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {formData.name || 'Your Name'}
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 truncate">
                {formData.role || 'Your Job Title'}
              </p>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${formData.theme.gradient} transition-all duration-500 truncate max-w-full`}>
                {formData.company || 'Company Name'}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <div className={`flex-1 py-3 rounded-xl text-white font-medium text-sm shadow-md bg-gradient-to-r ${formData.theme.gradient} transition-all duration-500`}>
                  Save Contact
                </div>
                <div className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <Globe className="w-5 h-5" />
                </div>
              </div>

              {/* Contact Items Mockup */}
              <div className="mt-6 space-y-3 text-left">
                {[Mail, Phone, MapPin].map((Icon, idx) => (
                    <div key={idx} className="w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl flex items-center gap-3 border border-gray-100 dark:border-neutral-700">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-neutral-500" />
                        </div>
                        <div className={`h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full ${idx === 0 ? 'w-32' : idx === 1 ? 'w-24' : 'w-40'}`}></div>
                    </div>
                ))}
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
