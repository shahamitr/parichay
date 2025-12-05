'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { getCurrentFestival, Festival } from '@/lib/festival-themes';

interface FestivalBannerProps {
  onClose?: () => void;
}

export default function FestivalBanner({ onClose }: FestivalBannerProps) {
  const [festival, setFestival] = useState<Festival | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const currentFestival = getCurrentFestival();
    if (currentFestival != null) {
      setFestival(currentFestival);

      // Check if user dismissed this festival banner
      const dismissed = localStorage.getItem(`festival-banner-${currentFestival.id}`);
      if (dismissed != null) {
        setIsDismissed(true);
        setIsVisible(false);
      }
    }
  }, []);

  const handleDismiss = () => {
    if (festival != null) {
      localStorage.setItem(`festival-banner-${festival.id}`, 'true');
      setIsVisible(false);
      setIsDismissed(true);
      onClose?.();
    }
  };

  if (!festival || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden animate-in slide-in-from-top duration-500"
      style={{
        background: festival.banner.gradient,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-3xl animate-bounce">{festival.banner.emoji}</span>
            <p className="text-white font-semibold text-sm sm:text-base">
              {festival.banner.text}
            </p>
            {festival.effects.sparkles && (
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Animated decorations */}
      {festival.effects.sparkles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
              style={{
                left: `${20 + i * 20}%`,
                top: '50%',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
