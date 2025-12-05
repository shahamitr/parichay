'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Building2, ChevronDown, Check } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  _count: {
    branches: number;
  };
  subscription?: {
    status: string;
    endDate: string;
    plan: {
      name: string;
    };
  };
}

interface BrandSelectorProps {
  selectedBrandId: string | null;
  onBrandChange: (brandId: string | null) => void;
}

export default function BrandSelector({ selectedBrandId, onBrandChange }: BrandSelectorProps) {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/brands', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }

      const data = await response.json();
      setBrands(data.brands);

      // Auto-select first brand if none selected
      if (!selectedBrandId && data.brands.length > 0) {
        onBrandChange(data.brands[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  if (loading != null) {
    return (
      <div className="animate-pulse flex items-center gap-4">
        <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="text-red-600 dark:text-red-400 text-sm">Error: {error}</div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="text-center py-6">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">No Brands Found</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          You don't have any brands yet.
        </p>
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
          Create your first brand
        </button>
      </div>
    );
  }

  const selectedBrand = brands.find(b => b.id === selectedBrandId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Brand Overview</h3>
        {user?.role === 'SUPER_ADMIN' && (
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
            Manage Brands
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Brand Selector */}
        <div>
          <label htmlFor="brand-select" className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Switch Brand
          </label>
          <div className="relative">
            <select
              id="brand-select"
              value={selectedBrandId || ''}
              onChange={(e) => onBrandChange(e.target.value || null)}
              className="block w-full appearance-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 pl-3 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a brand...</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Selected Brand Info */}
        {selectedBrand && (
          <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            {selectedBrand.logo ? (
              <img
                src={selectedBrand.logo}
                alt={selectedBrand.name}
                className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/30">
                <Building2 className="w-6 h-6" />
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{selectedBrand.name}</h4>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span>{selectedBrand._count.branches} branches</span>
                {selectedBrand.subscription && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium">
                    {selectedBrand.subscription.plan.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}