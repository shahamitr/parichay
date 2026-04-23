'use client';

import { useState, useEffect } from 'react';
import { Brand, Branch } from '@/generated/prisma';
import { HeroSection as HeroConfig } from '@/types/microsite';
import { getImageWithFallback } from '@/lib/placeholder-utils';
import { Upload, Image as ImageIcon, Video, Sparkles } from 'lucide-react';

// ============================================================================
// UNIFIED HERO SECTION - Supports both view and edit modes
// ============================================================================

interface HeroSectionProps {
  mode?: 'view' | 'edit';
  config: HeroConfig;
  // View mode props
  brand?: Brand;
  branch?: Branch;
  // Edit mode props
  onChange?: (data: HeroConfig) => void;
}

export default function HeroSection({
  mode = 'view',
  config,
  brand,
  branch,
  onChange,
}: HeroSectionProps) {
  // ============================================================================
  // EDIT MODE
  // ============================================================================
  if (mode === 'edit') {
    return <HeroEditor config={config} onChange={onChange!} />;
  }

  // ============================================================================
  // VIEW MODE
  // ============================================================================
  return <HeroView config={config} brand={brand!} branch={branch!} />;
}

// ============================================================================
// VIEW COMPONENT
// ============================================================================
function HeroView({
  config,
  brand,
  branch,
}: {
  config: HeroConfig;
  brand: Brand;
  branch: Branch;
}) {
  const contact = branch.contact as any;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (config.animationEnabled) {
      setIsVisible(true);
    }
  }, [config.animationEnabled]);

  const handleContactClick = async (action: string, value: string) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'CLICK',
          branchId: branch.id,
          brandId: brand.id,
          metadata: { action, value, section: 'hero' },
        }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }

    switch (action) {
      case 'call':
        window.open(`tel:${value}`, '_self');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/\D/g, '')}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${value}`, '_self');
        break;
      case 'directions':
        const address = branch.address as any;
        if (address) {
          const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
          window.open(`https://maps.google.com/maps?q=${encodeURIComponent(addressString)}`, '_blank');
        }
        break;
    }
  };

  const backgroundType = config.backgroundType || 'image';
  const hasBackground = config.backgroundImage || config.backgroundVideo;
  const backgroundImageUrl = backgroundType === 'image'
    ? getImageWithFallback(config.backgroundImage, 'banner', brand.name)
    : undefined;

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Image */}
      {backgroundType === 'image' && backgroundImageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          />
          <div className="absolute inset-0 bg-white/80" />
        </>
      )}

      {/* Background Video */}
      {backgroundType === 'video' && config.backgroundVideo && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={config.backgroundVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/80" />
        </>
      )}

      {/* Default Gradient */}
      {!hasBackground && backgroundType !== 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 dark:from-neutral-900 to-white dark:to-neutral-950" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6 py-20">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-neutral-900 dark:text-neutral-100">
            {config.title}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            {config.subtitle}
          </p>

          {/* Contact Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mt-10">
            {contact?.phone && (
              <button
                onClick={() => handleContactClick('call', contact.phone)}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors shadow-sm hover:shadow-md font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>Call Now</span>
              </button>
            )}

            {contact?.whatsapp && (
              <button
                onClick={() => handleContactClick('whatsapp', contact.whatsapp)}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm hover:shadow-md font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            )}

            {contact?.email && (
              <button
                onClick={() => handleContactClick('email', contact.email)}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl hover:border-neutral-400 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Email Us</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// EDIT COMPONENT
// ============================================================================
function HeroEditor({
  config,
  onChange,
}: {
  config: HeroConfig;
  onChange: (data: HeroConfig) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'gallery');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      handleChange('backgroundImage', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Hero Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          The first thing visitors see - make it count!
        </p>
      </div>

      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Hero Section</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Show or hide this section</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
        </label>
      </div>

      {config.enabled && (
        <>
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hero Title *
            </label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Welcome to Our Business"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hero Subtitle
            </label>
            <textarea
              value={config.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Your trusted partner for..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Background Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Background Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'gradient', icon: Sparkles, label: 'Gradient' },
                { type: 'image', icon: ImageIcon, label: 'Image' },
                { type: 'video', icon: Video, label: 'Video' },
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange('backgroundType', type)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    config.backgroundType === type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Image Upload */}
          {config.backgroundType === 'image' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Background Image
              </label>
              {config.backgroundImage && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 mb-2">
                  <img
                    src={config.backgroundImage}
                    alt="Hero background"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleChange('backgroundImage', '')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          )}

          {/* Animation Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Animations</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Animate content on load</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.animationEnabled ?? true}
                onChange={(e) => handleChange('animationEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Keep title short and impactful (5-10 words)</li>
              <li>Use high-quality images (1920px+ wide)</li>
              <li>Ensure text is readable over background</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

// Re-export types
export type { HeroSectionProps };
