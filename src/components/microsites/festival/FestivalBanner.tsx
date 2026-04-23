'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Festival, FestivalSettings, getFestivalById, isBrandFestivalActive } from '@/lib/festival-themes';

interface FestivalBannerProps {
  settings: FestivalSettings | null;
  brandPrimaryColor?: string;
}

export default function FestivalBanner({ settings, brandPrimaryColor }: FestivalBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [festival, setFestival] = useState<Festival | null>(null);

  useEffect(() => {
    if (settings?.festivalId) {
      const f = getFestivalById(settings.festivalId);
      setFestival(f);
    }
  }, [settings?.festivalId]);

  // Check if festival should be displayed
  if (!settings || !isBrandFestivalActive(settings) || !festival || !isVisible) {
    return null;
  }

  const message = settings.customMessage || festival.banner.text;
  const bannerImage = settings.customBannerUrl;

  // Header position banner
  if (settings.position === 'header') {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: bannerImage
            ? `url(${bannerImage}) center/cover no-repeat`
            : festival.banner.gradient,
        }}
      >
        <div className="relative z-10 px-4 py-3 text-center">
          <p className="text-sm sm:text-base font-medium text-white drop-shadow-md">
            {message}
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-4 -top-4 w-16 h-16 opacity-20 text-4xl">
            {festival.banner.emoji}
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 opacity-20 text-4xl">
            {festival.banner.emoji}
          </div>
        </div>
      </div>
    );
  }

  // Floating position banner
  if (settings.position === 'floating') {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-in slide-in-from-bottom duration-500">
        <div
          className="relative rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: bannerImage
              ? `url(${bannerImage}) center/cover no-repeat`
              : festival.banner.gradient,
          }}
        >
          <div className="relative z-10 p-4 text-center">
            <div className="text-3xl mb-2">{festival.banner.emoji}</div>
            <p className="text-sm font-medium text-white drop-shadow-md">
              {message}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-2 top-2 p-1 text-white/80 hover:text-white transition-colors bg-black/20 rounded-full"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Border position - decorative border around the page
  if (settings.position === 'border') {
    return (
      <>
        {/* Top border */}
        <div
          className="fixed top-0 left-0 right-0 h-2 z-50"
          style={{ background: festival.banner.gradient }}
        />
        {/* Bottom border */}
        <div
          className="fixed bottom-0 left-0 right-0 h-2 z-50"
          style={{ background: festival.banner.gradient }}
        />
        {/* Left border */}
        <div
          className="fixed top-0 bottom-0 left-0 w-2 z-50"
          style={{ background: festival.banner.gradient }}
        />
        {/* Right border */}
        <div
          className="fixed top-0 bottom-0 right-0 w-2 z-50"
          style={{ background: festival.banner.gradient }}
        />

        {/* Corner decorations */}
        <div className="fixed top-2 left-2 z-50 text-2xl opacity-80 drop-shadow-lg">
          {festival.banner.emoji}
        </div>
        <div className="fixed top-2 right-2 z-50 text-2xl opacity-80 drop-shadow-lg">
          {festival.banner.emoji}
        </div>
        <div className="fixed bottom-2 left-2 z-50 text-2xl opacity-80 drop-shadow-lg">
          {festival.banner.emoji}
        </div>
        <div className="fixed bottom-2 right-2 z-50 text-2xl opacity-80 drop-shadow-lg">
          {festival.banner.emoji}
        </div>
      </>
    );
  }

  // Overlay position - full screen overlay
  if (settings.position === 'overlay') {
    return (
      <div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${festival.colors.primary}15 0%, transparent 20%, transparent 80%, ${festival.colors.primary}15 100%)`,
        }}
      >
        {/* Top decorative band */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: festival.banner.gradient }}
        />

        {/* Floating emoji decorations */}
        <div className="absolute top-4 left-4 text-3xl opacity-30 animate-bounce">
          {festival.banner.emoji}
        </div>
        <div className="absolute top-4 right-4 text-3xl opacity-30 animate-bounce delay-100">
          {festival.banner.emoji}
        </div>
      </div>
    );
  }

  return null;
}
