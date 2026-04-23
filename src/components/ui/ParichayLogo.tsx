'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ParichayLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  animated?: boolean;
}

export default function ParichayLogo({
  size = 'md',
  variant = 'full',
  className = '',
  animated = false
}: ParichayLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const LogoIcon = () => (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center group ${animated ? 'transition-all duration-300 hover:scale-105' : ''}`}>
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative w-full h-full bg-[#0F172A] rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 shadow-xl">
        <svg
          viewBox="0 0 40 40"
          className="w-4/5 h-4/5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vertical Bar */}
          <rect x="12" y="8" width="5" height="24" rx="2.5" fill="url(#pGrad)" />
          
          {/* Circular Loop (The Portal) */}
          <circle cx="22" cy="16" r="8" stroke="url(#pGrad)" strokeWidth="5" />
          
          {/* Inner Portal Dot */}
          <circle cx="22" cy="16" r="2" fill="white" className="animate-pulse" />

          <defs>
            <linearGradient id="pGrad" x1="12" y1="8" x2="30" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );

  const LogoText = () => (
    <span className={`${textSizeClasses[size]} font-black tracking-[-0.05em] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent ${animated ? 'transition-all duration-300 hover:tracking-normal' : ''}`}>
      Parichay
    </span>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
}

// Alternative logo variations for different contexts
export const ParichayLogoMinimal = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>

        {/* Modern P with network connections */}
        <rect x="4" y="4" width="24" height="24" rx="6" fill="url(#logoGradient)" />

        {/* Letter P */}
        <path d="M10 8h6c2.21 0 4 1.79 4 4s-1.79 4-4 4h-4v6h-2V8zm2 2v6h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4z" fill="white" />

        {/* Network dots */}
        <circle cx="22" cy="22" r="1" fill="white" opacity="0.8" />
        <circle cx="24" cy="20" r="0.8" fill="white" opacity="0.6" />
        <circle cx="20" cy="24" r="0.8" fill="white" opacity="0.6" />
      </svg>
    </div>
  );
};

// Logo for dark backgrounds
export const ParichayLogoDark = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-3/5 h-3/5 text-white" fill="currentColor">
        <path d="M6 2h6c3.314 0 6 2.686 6 6s-2.686 6-6 6H8v6H6V2zm2 2v8h4c2.21 0 4-1.79 4-4s-1.79-4-4-4H8z"/>
        <circle cx="18" cy="18" r="1.5" className="animate-pulse"/>
        <circle cx="20" cy="15" r="1" className="animate-pulse delay-300"/>
        <circle cx="16" cy="20" r="1" className="animate-pulse delay-500"/>
      </svg>
    </div>
  );
};