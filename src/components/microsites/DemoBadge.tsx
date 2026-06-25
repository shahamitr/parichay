'use client';

import Link from 'next/link';

interface DemoBadgeProps {
  brandName: string;
  categoryName: string;
}

export default function DemoBadge({ brandName, categoryName }: DemoBadgeProps) {
  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg"
        role="banner"
        aria-label={`Demo preview for ${categoryName}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm sm:text-base">
          <span className="font-medium">
            🎯 Demo Preview — {categoryName}
          </span>
          <span className="hidden sm:inline text-gray-400">|</span>
          <Link
            href="/register"
            className="inline-flex items-center gap-1 font-semibold text-blue-300 hover:text-blue-200 transition-colors"
          >
            Create Your Own <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      {/* Spacer to prevent content from being hidden behind the fixed banner */}
      <div className="h-10 sm:h-11" aria-hidden="true" />
    </>
  );
}
