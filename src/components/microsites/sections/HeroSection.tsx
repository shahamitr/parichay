'use client';

import { Brand, Branch } from '@/generated/prisma';
import { HeroSection as HeroConfig } from '@/types/microsite';
import { useEffect, useState } from 'react';
import Arc from '@/components/ui/Arc';
import { getImageWithFallback } from '@/lib/placeholder-utils';

interface HeroSectionProps {
  config: HeroConfig;
  brand: Brand;
  branch: Branch;
}

export default function HeroSection({ config, brand, branch }: HeroSectionProps) {
  const contact = branch.contact as any;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (config.animationEnabled) {
      setIsVisible(true);
    }
  }, [config.animationEnabled]);

  const handleContactClick = async (action: string, value: string) => {
    // Track click analytics
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'CLICK',
          branchId: branch.id,
          brandId: brand.id,
          metadata: {
            action,
            value,
            section: 'hero',
          },
        }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }

    // Perform the action
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
        if (address != null) {
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
    <section
      className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Clean background - Design 2 style */}
      {backgroundType === 'image' && backgroundImageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          />
          <div className="absolute inset-0 bg-white/80"></div>
        </>
      )}

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
            <source src={config.backgroundVideo.replace('.mp4', '.webm')} type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-white/80"></div>
        </>
      )}

      {/* Subtle gradient background for no-image case */}
      {!hasBackground && backgroundType !== 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto text-center px-6 py-20">
        <div className="space-y-6">
          {/* Main Title - Clean, professional */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            {config.title}
          </h1>

          {/* Subtitle - Clean typography */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {config.subtitle}
          </p>

          {/* Contact Action Buttons - Clean, professional */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mt-10">
            {contact.phone && (
              <button
                onClick={() => handleContactClick('call', contact.phone)}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md font-medium"
                aria-label="Call us now"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>Call Now</span>
              </button>
            )}

            {contact.whatsapp && (
              <button
                onClick={() => handleContactClick('whatsapp', contact.whatsapp)}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-sm hover:shadow-md font-medium"
                aria-label="Contact us on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            )}

            {contact.email && (
              <button
                onClick={() => handleContactClick('email', contact.email)}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 font-medium"
                aria-label="Send us an email"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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