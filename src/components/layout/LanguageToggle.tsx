'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/context';

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'hi', name: 'हिं' },
    { code: 'gu', name: 'ગુજ' },
  ];

  return (
    <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-full shadow-lg">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as any)}
          className={`
            px-3 py-1 rounded-full text-xs font-bold transition-all duration-300
            ${language === lang.code 
              ? 'bg-white text-primary-600 shadow-sm' 
              : 'text-white/70 hover:text-white'
            }
          `}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
