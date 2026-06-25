'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const langs = [
    { id: 'en', label: 'EN' },
    { id: 'hi', label: 'हिंदी' },
    { id: 'gu', label: 'ગુજરાતી' },
  ];

  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md">
      <div className="p-2 text-slate-500">
        <Globe className="w-4 h-4" />
      </div>
      {langs.map((lang) => (
        <button
          key={lang.id}
          onClick={() => setLanguage(lang.id as any)}
          className={`relative px-4 py-1.5 rounded-full text-xs font-black transition-all duration-300 ${
            language === lang.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {language === lang.id && (
            <motion.div
              layoutId="langBg"
              className="absolute inset-0 bg-indigo-600 rounded-full z-0"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
