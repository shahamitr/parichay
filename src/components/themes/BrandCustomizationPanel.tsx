// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { BrandCustomization } from '@/types/theme';
import { ThemeEditor } from './ThemeEditor';
import { ThemePreview } from './ThemePreview';
import { HeroCustomizer } from './HeroCustomizer';
import { HeroPreview } from './HeroPreview';
import { BrandAssetsCustomizer } from './BrandAssetsCustomizer';
import { Card } from '@/components/ui/Card';
import {
  saveBrandCustomization,
  loadBrandCustomization,
  getDefaultThemeConfig,
} from '@/lib/theme-storage';

export interface BrandCustomizationPanelProps {
  brandId: string;
  onSave?: (customization: BrandCustomization) => void;
}

type TabType = 'theme' | 'hero' | 'assets';

/**
 * BrandCustomizationPanel Component
 *
 * Main panel for managing all brand customization settings
 */
export const BrandCustomizationPanel: React.FC<BrandCustomizationPanelProps> = ({
  brandId,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('theme');
  const [customization, setCustomization] = useState<BrandCustomization>({
    theme: getDefaultThemeConfig(),
    hero: {
      backgroundType: 'gradient',
      title: 'Welcome to Our Business',
      subtitle: 'Crafting excellence in every detail',
      ctaText: 'Get Started',
      ctaLink: '#contact',
    },
    assets: {},
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Load customization on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from localStorage first
        const stored = loadBrandCustomization(brandId);

        if (stored != null) {
          setCustomization(stored);
        } else {
          // Try to load from API
          const response = await fetch(`/api/customization?brandId=${brandId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.customization) {
              setCustomization(data.customization);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load customization:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [brandId]);

  const handleSaveCustomization = async (updatedCustomization: BrandCustomization) => {
    setSaveStatus('saving');

    try {
      // Save to localStorage
      saveBrandCustomization(brandIustomization);

      // Save to API
      const response = await fetch('/api/customization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandId,
          customization: updatedCustomization,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to server');
      }

      setCustomization(updatedCustomization);
      setSaveStatus('success');

      if (onSave != null) {
        onSave(updatedCustomization);
      }

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to save customization:', error);
      setSaveStatus('error');

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const handleThemeSave = async (theme: typeof customization.theme) => {
    await handleSaveCustomization({
      ...customization,
      theme,
    });
  };

  const handleHeroSave = async (hero: typeof customization.hero) => {
    await handleSaveCustomization({
      ...customization,
      hero,
    });
  };

  const handleAssetsSave = async (assets: typeof customization.assets) => {
    await handleSaveCustomization({
      ...customization,
      assets,
    });
  };

  const tabs = [
    { id: 'theme' as TabType, label: 'Theme & Colors', icon: '🎨' },
    { id: 'hero' as TabType, label: 'Hero Section', icon: '🖼️' },
    { id: 'assets' as TabType, label: 'Brand Assets', icon: '📁' },
  ];

  if (loading != null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg
            className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-neutral-600 dark:text-neutral-400">Loading customization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Brand Customization
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Customize your microsite appearance and branding
          </p>
        </div>

        {/* Save Status */}
        {saveStatus !== 'idle' && (
          <div
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              ${saveStatus === 'saving' ? 'bg-primary-50 text-primary-700' : ''}
              ${saveStatus === 'success' ? 'bg-success-50 text-success-700' : ''}
              ${saveStatus === 'error' ? 'bg-error-50 text-error-700' : ''}
            `}
          >
            {saveStatus === 'saving' && '💾 Saving...'}
            {saveStatus === 'success' && '✅ Saved successfully!'}
            {saveStatus === 'error' && '❌ Failed to save'}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div>
          {activeTab === 'theme' && (
            <ThemeEditor
              initialTheme={customization.theme}
              onSave={handleThemeSave}
              showPreview={false}
            />
          )}

          {activeTab === 'hero' && (
            <HeroCustomizer
              initialHero={customization.hero}
              onSave={handleHeroSave}
            />
          )}

          {activeTab === 'assets' && (
            <BrandAssetsCustomizer
              initialAssets={customization.assets}
              onSave={handleAssetsSave}
            />
          )}
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card elevation="lg" className="p-6">
            {activeTab === 'theme' && (
              <ThemePreview theme={customization.theme} />
            )}

            {activeTab === 'hero' && (
              <HeroPreview
                hero={customization.hero}
                theme={customization.theme}
              />
            )}

            {activeTab === 'assets' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                    Brand Assets Preview
                  </h3>
                </div>

                {customization.assets.favicon && (
                  <div className="text-center">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Favicon
                    </p>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      <img
                        src={customization.assets.favicon}
                        alt="Favicon"
                        className="w-8 h-8"
                      />
                    </div>
                  </div>
                )}

                {customization.assets.logo && (
                  <div className="text-center">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Logo
                    </p>
                    <div className="inline-flex items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      <img
                        src={customization.assets.logo}
                        alt="Logo"
                        className="max-w-[200px] max-h-[100px]"
                      />
                    </div>
                  </div>
                )}

                {!customization.assets.favicon && !customization.assets.logo && (
                  <div className="text-center py-12">
                    <p className="text-neutral-500 dark:text-neutral-400">
                      No assets uploaded yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
