'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, MessageCircle } from 'lucide-react';

interface FloatingActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left';
  showLabel?: boolean;
  showAfterScroll?: number;
}

export default function FloatingActionButton({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  showLabel = false,
  showAfterScroll = 400,
}: FloatingActionButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > showAfterScroll);
      setShowScrollTop(scrollY > 800);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  const handleClick = () => {
    if (onClick != null) {
      onClick();
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection != null) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const positionClasses = {
    'bottom-right': 'right-4 sm:right-6',
    'bottom-left': 'left-4 sm:left-6',
  };

  // Default icon
  const defaultIcon = (
    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
  );

  return (
    <>
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`
          fixed ${positionClasses[position]} bottom-28 sm:bottom-24 z-40
          w-10 h-10 sm:w-11 sm:h-11 rounded-full
          bg-white shadow-lg border border-gray-200
          flex items-center justify-center
          text-gray-600 hover:text-gray-900 hover:shadow-xl
          transform transition-all duration-300
          ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
          hover:scale-110 active:scale-95
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        `}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Main FAB - Contact */}
      <button
        onClick={handleClick}
        className={`
          fixed ${positionClasses[position]} bottom-28 sm:bottom-24 z-40
          ${showLabel ? 'px-5 py-3' : 'w-12 h-12 sm:w-14 sm:h-14'}
          rounded-full
          bg-gradient-to-r from-blue-600 to-indigo-600
          text-white shadow-xl shadow-blue-500/30
          flex items-center justify-center gap-2
          transform transition-all duration-300
          ${isVisible && !showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
          hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40
          active:scale-95
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
        `}
        aria-label={label}
        title={label}
      >
        <span className="flex-shrink-0">
          {icon || defaultIcon}
        </span>
        {showLabel && (
          <span className="font-semibold text-sm whitespace-nowrap">
            {label}
          </span>
        )}
      </button>
    </>
  );
}
