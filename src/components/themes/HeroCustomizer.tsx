// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { HeroCustomization } from '@/types/theme';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImageUploadWithPreview } from '@/components/ui/ImageUploadWithPreview';

export interface HeroCustomizerProps {
  initialHero?: HeroCustomization;
  onSave: (hero: HeroCustomization) => void;
  onCancel?: () => void;
}

/**
 * HeroCustomizer Component
 *
 * Provides UI for customizing hero section including background, text, and CTA
 */
export const HeroCustomizer: React.FC<HeroCustomizerProps> = ({
  initialHero,
  onSave,
  onCancel,
}) => {
  const [hero, setHero] = useState<HeroCustomization>(
    initialHero || {
      backgroundType: 'gradient',
      title: 'Welcome to Our Business',
      subtitle: 'Crafting excellence in every detail',
      ctaText: 'Get Started',
      ctaLink: '#contact',
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof HeroCustomization, value: string) => {
    setHero(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBackgroundUpload = (url: string) => {
    setHero(prev => ({
      ...prev,
      backgroundUrl: url,
    }));
  };

  const validateHero = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!hero.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!hero.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required';
    }

    if (!hero.ctaText.trim()) {
      newErrors.ctaText = 'CTA text is required';
    }

    if (!hero.ctaLink.trim()) {
      newErrors.ctaLink = 'CTA link is required';
    }

    if ((hero.backgroundType === 'image' || hero.backgroundType === 'video') && !hero.backgroundUrl) {
      newErrors.backgroundUrl = 'Background URL is required for image/video type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateHero()) {
      return;
    }

    setIsSaving(true);

    try {
      await onSave(hero);
    } catch (error) {
      console.error('Failed to save hero customization:', error);
      setErrors({ general: 'Failed to save. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const backgroundTypeOptions = [
    { value: 'gradient', label: 'Gradient' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
  ];

  return (
    <div className="space-y-6">
      {/* Background Settings */}
      <Card elevation="md" className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
          Background
        </h3>

        <div className="space-y-4">
          <Select
            label="Background Type"
            value={hero.backgroundType}
            onChange={(e) => handleChange('backgroundType', e.target.value as HeroCustomization['backgroundType'])}
            options={backgroundTypeOptions}
            helperText="Choose how you want to display the hero background"
            fullWidth
          />

          {(hero.backgroundType === 'image' || hero.backgroundType === 'video') && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {hero.backgroundType === 'image' ? 'Background Image' : 'Background Video'}
              </label>

              {hero.backgroundType === 'image' ? (
                <ImageUploadWithPreview
                  onUpload={handleBackgroundUpload}
                  currentImage={hero.backgroundUrl}
                  aspectRatio="16:9"
                  maxSizeMB={5}
                />
              ) : (
                <Input
                  type="url"
                  value={hero.backgroundUrl || ''}
                  onChange={(e) => handleChange('backgroundUrl', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  error={errors.backgroundUrl}
                  helperText="Enter video URL (MP4 format recommended)"
                  fullWidth
                />
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Content Settings */}
      <Card elevation="md" className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
          Hero Content
        </h3>

        <div className="space-y-4">
          <Input
            label="Hero Title"
            value={hero.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Welcome to Our Business"
            error={errors.title}
            helperText="Main heading displayed in the hero section"
            fullWidth
            maxLength={100}
          />

          <Textarea
            label="Hero Subtitle"
            value={hero.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="Crafting excellence in every detail"
            error={errors.subtitle}
            helperText="Supporting text below the main heading"
            fullWidth
            rows={3}
            maxLength={200}
          />
        </div>
      </Card>

      {/* CTA Settings */}
      <Card elevation="md" className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
          Call-to-Action Button
        </h3>

        <div className="space-y-4">
          <Input
            label="Button Text"
            value={hero.ctaText}
            onChange={(e) => handleChange('ctaText', e.target.value)}
            placeholder="Get Started"
            error={errors.ctaText}
            helperText="Text displayed on the CTA button"
            fullWidth
            maxLength={30}
          />

          <Input
            label="Button Link"
            value={hero.ctaLink}
            onChange={(e) => handleChange('ctaLink', e.target.value)}
            placeholder="#contact"
            error={errors.ctaLink}
            helperText="URL or anchor link (e.g., #contact, /services, https://...)"
            fullWidth
          />
        </div>
      </Card>

      {/* General Error */}
      {errors.general && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <p className="text-sm text-error-700">{errors.general}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        )}

        <Button
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving}
        >
          Save Hero Settings
        </Button>
      </div>
    </div>
  );
};
