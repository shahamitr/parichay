'use client';

import React from 'react';
import { ThemeConfig } from '@/types/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface ThemePreviewProps {
  theme: ThemeConfig;
  className?: string;
}

/**
 * ThemePreview Component
 *
 * Shows a live preview of how the theme will look
 */
export const ThemePreview: React.FC<ThemePreviewProps> = ({
  theme,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          Theme Preview
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          See how your customizations will look
        </p>
      </div>

      {/* Hero Section Preview */}
      <Card
        elevation="lg"
        className="p-8 text-center"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
        }}
      >
        <h1
          className="text-4xl font-bold text-white mb-4"
          style={{ fontFamily: theme.typography.headingFont || theme.typography.fontFamily }}
        >
          Your Business Name
        </h1>
        <p
          className="text-lg text-white/90 mb-6"
          style={{ fontFamily: theme.typography.fontFamily }}
        >
          Crafting excellence in every detail
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="px-6 py-3 bg-white text-neutral-900 rounded-xl font-medium hover:bg-white/90 transition-colors"
            style={{ fontFamily: theme.typography.fontFamily }}
          >
            Get Started
          </button>
          <button
            className="px-6 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors backdrop-blur-sm"
            style={{ fontFamily: theme.typography.fontFamily }}
          >
            Learn More
          </button>
        </div>
      </Card>

      {/* Content Section Preview */}
      <Card elevation="md" className="p-6">
        <h2
          className="text-2xl font-bold mb-3"
          style={{
            color: theme.colors.primary,
            fontFamily: theme.typography.headingFont || theme.typography.fontFamily,
          }}
        >
          About Our Services
        </h2>
        <p
          className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed"
          style={{ fontFamily: theme.typography.fontFamily }}
        >
          We provide exceptional services tailored to your needs. Our team of experts
          is dedicated to delivering quality results that exceed expectations.
        </p>
        <button
          className="px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
          style={{
            backgroundColor: theme.colors.secondary,
            color: 'white',
            fontFamily: theme.typography.fontFamily,
          }}
        >
          View Services
        </button>
      </Card>

      {/* Card Grid Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Feature 1', 'Feature 2', 'Feature 3'].map((feature, index) => (
          <Card
            key={index}
            elevation="sm"
            hover
            className="p-4 text-center"
          >
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: `${theme.colors.accent}20` }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: theme.colors.accent }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3
              className="font-semibold mb-2"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.typography.headingFont || theme.typography.fontFamily,
              }}
            >
              {feature}
            </h3>
            <p
              className="text-sm text-neutral-600 dark:text-neutral-400"
              style={{ fontFamily: theme.typography.fontFamily }}
            >
              Description of this amazing feature
            </p>
          </Card>
        ))}
      </div>

      {/* Typography Scale Preview */}
      <Card elevation="md" className="p-6">
        <div className="space-y-3">
          <h1
            className="text-4xl font-bold"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont || theme.typography.fontFamily,
            }}
          >
            Heading 1
          </h1>
          <h2
            className="text-3xl font-bold"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont || theme.typography.fontFamily,
            }}
          >
            Heading 2
          </h2>
          <h3
            className="text-2xl font-semibold"
            style={{
              color: theme.colors.secondary,
              fontFamily: theme.typography.headingFont || theme.typography.fontFamily,
            }}
          >
            Heading 3
          </h3>
          <p
            className="text-lg text-neutral-700 dark:text-neutral-300"
            style={{ fontFamily: theme.typography.fontFamily }}
          >
            Body text - This is how your regular content will appear throughout your microsite.
          </p>
          <p
            className="text-sm text-neutral-600 dark:text-neutral-400"
            style={{ fontFamily: theme.typography.fontFamily }}
          >
            Small text - Used for captions, helper text, and secondary information.
          </p>
        </div>
      </Card>
    </div>
  );
};
