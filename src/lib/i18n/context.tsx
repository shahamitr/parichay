'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKeys } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  isHindi: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage = 'en' }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('parichay-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLanguageState(savedLang);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('hi')) {
        setLanguageState('hi');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('parichay-language', lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
    isHindi: language === 'hi',
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Helper hook for getting translations
export function useTranslation() {
  const { t, language, setLanguage, isHindi } = useI18n();
  return { t, language, setLanguage, isHindi };
}
