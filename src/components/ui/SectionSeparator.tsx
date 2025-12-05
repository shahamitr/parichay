'use client';

/**
 * SectionSeparator Component
 *
 * Professional separator between microsite sections.
 * Design 2 style - clean, minimal, with subtle brand accent.
 */

interface SectionSeparatorProps {
  variant?: 'line' | 'dots' | 'gradient' | 'wave';
  className?: string;
}

export default function SectionSeparator({
  variant = 'gradient',
  className = ''
}: SectionSeparatorProps) {

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`} role="separator" aria-hidden="true">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
        </div>
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={`relative h-12 overflow-hidden ${className}`} role="separator" aria-hidden="true">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,60 350,0 600,40 C850,80 1050,20 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-gray-50"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'line') {
    return (
      <div className={`h-px bg-gray-200 ${className}`} role="separator" aria-hidden="true"></div>
    );
  }

  // Default: gradient variant
  return (
    <div className={`flex items-center justify-center py-6 ${className}`} role="separator" aria-hidden="true">
      <div className="flex items-center w-full max-w-md">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-brand-primary mx-4"></div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300"></div>
      </div>
    </div>
  );
}
