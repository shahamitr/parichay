// @ts-nocheck

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import { BrandAvatar } from '@/components/ui/Avatar';
import { getImageWithFallback } from '@/lib/placeholder-utils';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  tagline?: string;
  customDomain?: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  createdAt: string;
  _count: {
    branches: number;
  };
  branches?: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  subscription?: {
    status: string;
    endDate: string;
    plan: {
      name: string;
    };
  };
}

interface BrandListProps {
  onEditBrand: (brand: Brand) => void;
}

export default function BrandList({ onEditBrand }: BrandListProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/brands', {
        headers: {
          'Authorization': `Bearer ${token} `,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }

      const data = await response.json();
      setBrands(data.brands);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brands';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (!confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete brand');
      }

      toast.success('Brand deleted successfully');
      fetchBrands();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete brand');
    }
  };

  const getBrandUrl = (brand: Brand) => {
    if (brand.customDomain) {
      return brand.customDomain;
    }
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

    // Get the first branch slug if available
    const firstBranch = brand.branches && brand.branches.length > 0 ? brand.branches[0] : null;

    if (firstBranch) {
      // Format: /brand-slug/branch-slug
      return `${baseUrl}/${brand.slug}/${firstBranch.slug}`;
    }

    // Fallback: just brand slug (will show 404 until branch is added)
    return `${baseUrl}/${brand.slug}`;
  };

  const handleCopyLink = (brand: Brand) => {
    const url = getBrandUrl(brand);
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handlePreview = (brand: Brand) => {
    const url = getBrandUrl(brand);
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">Error: {error}</div>
          <button
            onClick={fetchBrands}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-12 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No brands</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating your first brand.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Brands ({brands.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {brands.map((brand) => (
          <div key={brand.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Brand Logo/Avatar */}
                <BrandAvatar brand={brand} size="lg" />

                {/* Brand Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {brand.name}
                  </h4>
                  {brand.tagline && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{brand.tagline}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {brand._count.branches} branches
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Created {formatDate(brand.createdAt)}
                    </span>
                    {brand.customDomain && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        Custom Domain
                      </span>
                    )}
                  </div>
                  {/* Brand URL */}
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">URL:</span>
                    <code className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                      {getBrandUrl(brand)}
                    </code>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {brand.subscription && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${brand.subscription.status === 'ACTIVE'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                    {brand.subscription.plan.name}
                  </span>
                )}

                {/* Manage Content Button */}
                <button
                  onClick={() => router.push(`/dashboard/brands/${brand.id}`)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500"
                  title="Manage Microsite Content"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Manage Content
                </button>

                <button
                  onClick={() => handlePreview(brand)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                  title="Preview Brand"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>

                <button
                  onClick={() => handleCopyLink(brand)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                  title="Copy Link"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>

                <button
                  onClick={() => onEditBrand(brand)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium px-3 py-1.5"
                >
                  Edit
                </button>

                {user?.role === 'SUPER_ADMIN' && (
                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium px-3 py-1.5"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Color Theme Preview */}
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Theme:</span>
              <div className="flex space-x-1">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: brand.colorTheme.primary }}
                  title="Primary Color"
                />
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: brand.colorTheme.secondary }}
                  title="Secondary Color"
                />
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: brand.colorTheme.accent }}
                  title="Accent Color"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
