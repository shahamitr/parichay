'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useRecentlyViewed, RecentlyViewedBusiness } from '@/hooks/useRecentlyViewed';

export default function RecentlyViewed() {
  const { items, clearRecent } = useRecentlyViewed();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Recently Viewed</h3>
        <button
          onClick={clearRecent}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
          aria-label="Clear recently viewed"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
        {items.map((business: RecentlyViewedBusiness) => (
          <Link
            key={business.id}
            href={`/business/${business.slug}/${business.branchSlug}`}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all duration-200 w-28"
          >
            {/* Logo or Initial */}
            {business.logo ? (
              <img
                src={business.logo}
                alt={business.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {business.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Name */}
            <span className="text-xs font-medium text-gray-800 text-center line-clamp-2 leading-tight">
              {business.name}
            </span>

            {/* Category */}
            {business.category && (
              <span className="text-[10px] text-gray-400 text-center truncate w-full">
                {business.category}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
