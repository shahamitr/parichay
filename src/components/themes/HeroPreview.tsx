'use client';

import React from 'react';
import { HeroCustomization, ThemeConfig } from '@/types/theme';
import { Card } from '@/components/ui/Card';

export interface HeroPreviewProps {
  hero: HeroCustomization;
  theme?: ThemeConfig;
  className?: string;
}

/**
 * HeroPreview Component
 *
 * Shows a live preview of the customized hero section
 */
export const HeroPreview: React.FC<HeroPreviewProps> = ({
  hero,
  theme,
  className = '',
}) => {
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (hero.backgroundType) {
      case 'image':
        return {
          backgroundImage: hero.backgroundUrl ? `url(${hero.backgroundUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'video':
        return {
          backgroundColor: '#000',
        };
      case 'gradient':
      default:
        return {
          background: theme
            ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
            : 'linear-gradient(135deg, #7b61ff, #ff7b00)',
        };
    }
  };

  return (
    <div className={className}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Hero Section Preview
        </h3>
      </div>

      <Card elevation="lg" className="overflow-hidden">
        <div
          className="relative min-h-[400px] flex items-center justify-center p-8"
          style={getBackgroundStyle()}
        >
          {/* Video background */}
          {hero.backgroundType === 'video' && hero.backgroundUrl && (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={hero.backgroundUrl}
              autoPlay
              loop
              muted
              playsInline
            />
          )}

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              style={{
                fontFamily: theme?.typography.headingFont || theme?.typography.fontFamily,
              }}
            >
              {hero.title}
            </h1>

            <p
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              style={{
                fontFamily: theme?.typography.fontFamily,
              }}
            >
              {hero.subtitle}
            </p>

            <button
              className="px-8 py-4 bg-white text-neutral-900 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
              style={{
                fontFamily: theme?.typography.fontFamily,
              }}
            >
              {hero.ctaText}
            </button>
          </div>
        </div>
      </Card>

      {/* Info */}
      <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Background Type:
            </span>
            <span className="ml-2 text-neutral-600 dark:text-neutral-400 capitalize">
              {hero.backgroundType}
            </span>
          </div>
          <div>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              CTA Link:
            </span>
            <span className="ml-2 text-neutral-600 dark:text-neutral-400">
              {hero.ctaLink}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
