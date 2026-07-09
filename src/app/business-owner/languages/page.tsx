'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Languages, Sparkles, Save, CheckCircle, AlertCircle, Eye } from 'lucide-react';

interface BusinessData {
  brand: { name: string; tagline?: string };
  branch: { micrositeConfig: any };
}

interface TranslatedContent {
  tagline?: string;
  about?: string;
  services?: string[];
}

const LANGUAGES = [
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', script: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', script: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', script: 'मराठी' },
] as const;

export default function LanguagesPage() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translations, setTranslations] = useState<Record<string, TranslatedContent>>({});
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      const res = await fetch('/api/my-business');
      const data = await res.json();
      if (data.brand) {
        setBusinessData(data);
        // Load existing translations
        const config = data.branch?.micrositeConfig || {};
        const existing: Record<string, TranslatedContent> = {};
        for (const lang of LANGUAGES) {
          const key = `sections_${lang.code}`;
          if (config[key]) {
            existing[lang.code] = config[key];
          }
        }
        setTranslations(existing);
        setShowSwitcher(config.showLanguageSwitcher || false);
      }
    } catch (err) {
      console.error('Failed to fetch business data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (langCode: string) => {
    setTranslating(true);
    setMessage(null);
    setSelectedLang(langCode);

    try {
      const res = await fetch('/api/my-business/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage: langCode,
          fields: ['about', 'services', 'tagline'],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error });
        return;
      }

      setTranslations((prev) => ({
        ...prev,
        [langCode]: data.translated,
      }));
      setMessage({ type: 'success', text: `Translated to ${data.languageName} successfully!` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Translation failed. Please try again.' });
    } finally {
      setTranslating(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/my-business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          micrositeConfig: { showLanguageSwitcher: showSwitcher },
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Language settings saved!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const currentContent = {
    tagline: businessData?.brand?.tagline || '',
    about: businessData?.branch?.micrositeConfig?.sections?.about?.content || '',
    services: (businessData?.branch?.micrositeConfig?.sections?.services?.items || []).map(
      (s: any) => s.name
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/business-owner/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Dashboard
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">Multi-Language Content</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        {/* Current Content */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Current Content (English)
          </h3>

          <div className="space-y-3 text-sm">
            {currentContent.tagline && (
              <div>
                <span className="font-medium text-gray-700">Tagline:</span>{' '}
                <span className="text-gray-600">{currentContent.tagline}</span>
              </div>
            )}
            {currentContent.about && (
              <div>
                <span className="font-medium text-gray-700">About:</span>{' '}
                <span className="text-gray-600">{currentContent.about.slice(0, 200)}...</span>
              </div>
            )}
            {currentContent.services.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Services:</span>{' '}
                <span className="text-gray-600">{currentContent.services.join(', ')}</span>
              </div>
            )}
            {!currentContent.tagline && !currentContent.about && currentContent.services.length === 0 && (
              <p className="text-gray-500 italic">
                No content found. Add a tagline, about section, or services to your profile first.
              </p>
            )}
          </div>
        </div>

        {/* Language Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {LANGUAGES.map((lang) => {
            const hasTranslation = !!translations[lang.code];
            return (
              <div
                key={lang.code}
                className={`bg-white rounded-xl shadow-sm border p-6 ${
                  selectedLang === lang.code ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <p className="font-medium text-gray-900">{lang.name}</p>
                      <p className="text-xs text-gray-500">{lang.script}</p>
                    </div>
                  </div>
                  {hasTranslation && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Translated
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleTranslate(lang.code)}
                  disabled={translating}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {translating && selectedLang === lang.code ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {hasTranslation ? 'Re-translate with AI' : 'Translate with AI'}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Translation Preview */}
        {selectedLang && translations[selectedLang] && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Translation Preview — {LANGUAGES.find((l) => l.code === selectedLang)?.name}
            </h3>

            <div className="space-y-3 text-sm">
              {translations[selectedLang].tagline && (
                <div>
                  <span className="font-medium text-gray-700">Tagline:</span>{' '}
                  <span className="text-gray-600">{translations[selectedLang].tagline}</span>
                </div>
              )}
              {translations[selectedLang].about && (
                <div>
                  <span className="font-medium text-gray-700">About:</span>{' '}
                  <span className="text-gray-600">{translations[selectedLang].about}</span>
                </div>
              )}
              {translations[selectedLang].services && (
                <div>
                  <span className="font-medium text-gray-700">Services:</span>
                  <ul className="mt-1 space-y-1 ml-4">
                    {translations[selectedLang].services!.map((s, idx) => (
                      <li key={idx} className="text-gray-600">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Language Switcher Toggle */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Show language switcher on my profile</p>
                <p className="text-sm text-gray-500">
                  Visitors can switch between available languages on your microsite
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSwitcher(!showSwitcher)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showSwitcher ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={showSwitcher}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showSwitcher ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
