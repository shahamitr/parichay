'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'parichay-recently-viewed';
const MAX_ITEMS = 10;

export interface RecentlyViewedBusiness {
  id: string;
  name: string;
  slug: string;
  branchSlug: string;
  logo?: string;
  category?: string;
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedBusiness[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentlyViewedBusiness[];
        setItems(parsed);
      }
    } catch {
      // Silently ignore parse errors
    }
  }, []);

  const persistItems = useCallback((newItems: RecentlyViewedBusiness[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // Silently ignore storage errors (e.g., quota exceeded)
    }
  }, []);

  const addViewed = useCallback(
    (business: RecentlyViewedBusiness) => {
      setItems((current) => {
        // Remove existing entry if present (to move it to the front)
        const filtered = current.filter((item) => item.id !== business.id);
        // Add to the front, cap at MAX_ITEMS
        const updated = [business, ...filtered].slice(0, MAX_ITEMS);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Silently ignore
        }
        return updated;
      });
    },
    []
  );

  const getRecent = useCallback((): RecentlyViewedBusiness[] => {
    return items;
  }, [items]);

  const clearRecent = useCallback(() => {
    persistItems([]);
  }, [persistItems]);

  return {
    items,
    addViewed,
    getRecent,
    clearRecent,
  };
}
