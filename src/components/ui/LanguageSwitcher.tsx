'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation, Language } from '@/lib/i18n';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
];

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'toggle' | 'minimal';
  showFlag?: boolean;
  showNativeName?: boolean;
}

export default function LanguageSwitcher({
  variant = 'dropdown',
  showFlag = true,
  showNativeName = true,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle variant - simple switch between languages
  if (variant === 'toggle') {
    return (
      <button
        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium text-gray-700">
          {showNativeName ? currentLang.nativeName : currentLang.name}
        </span>
      </button>
    );
  }

  // Minimal variant - just icon
  if (variant === 'minimal') {
    return (
      <button
        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
      >
        <Globe className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  // Dropdown variant (default)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
      >
        {showFlag && <span className="text-lg">{currentLang.flag}</span>}
        <span className="text-sm font-medium text-gray-700">
          {showNativeName ? currentLang.nativeName : currentLang.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                language === lang.code ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-900">{lang.name}</div>
                <div className="text-xs text-gray-500">{lang.nativeName}</div>
              </div>
              {language === lang.code && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
