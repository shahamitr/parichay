'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { formatDate, generateMicrositeUrl } from '@/lib/utils';
import Link from 'next/link';

interface Branch {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    whatsapp?: string;
    email: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
    colorTheme: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  _count: {
    leads: number;
  };
}

interface BranchListProps {
  brandId: string | null;
  onEditBranch: (branch: Branch) => void;
}

export default function BranchList({ brandId, onEditBranch }: BranchListProps) {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (brandId || user?.role === 'BRANCH_ADMIN') {
      fetchBranches();
    } else {
      setBranches([]);
      setLoading(false);
    }
  }, [brandId, user]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = brandId ? `/api/branches?brandId=${brandId}` : '/api/branches';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }

      const data = await response.json();
      // API returns the array directly or inside a branches property
      const branchesData = Array.isArray(data) ? data : (data.branches || []);
      setBranches(branchesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/branches/${branchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete branch');
      }

      // Refresh the list
      fetchBranches();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete branch');
    }
  };

  const toggleBranchStatus = async (branchId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/branches/${branchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update branch status');
      }

      // Refresh the list
      fetchBranches();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update branch status');
    }
  };

  if (loading != null) {
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

  if (error != null) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">Error: {error}</div>
          <button
            onClick={fetchBranches}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!brandId && user?.role !== 'BRANCH_ADMIN') {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-12 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Select a brand</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose a brand to view and manage its branches
        </p>
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-12 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No branches</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating your first branch location.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Branches ({branches.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {branches.map((branch) => (
          <div key={branch.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Branch Avatar */}
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: branch.brand?.colorTheme?.primary || '#3B82F6' }}
                >
                  {branch.name.charAt(0).toUpperCase()}
                </div>

                {/* Branch Info */}
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {branch.name}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${branch.isActive
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {branch.address.city}, {branch.address.state}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {branch._count.leads} leads
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Created {formatDate(branch.createdAt)}
                    </span>
                    <a
                      href={generateMicrositeUrl(branch.brand.slug, branch.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      View Microsite ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Link
                  href={`/dashboard/microsite/${branch.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Manage Microsite
                </Link>

                <button
                  onClick={() => toggleBranchStatus(branch.id, branch.isActive)}
                  className={`text-sm font-medium ${branch.isActive
                    ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
                    : 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                    }`}
                >
                  {branch.isActive ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => onEditBranch(branch)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Edit
                </button>

                {(user?.role === 'SUPER_ADMIN' || user?.role === 'BRAND_MANAGER') && (
                  <button
                    onClick={() => handleDeleteBranch(branch.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                <span className="ml-1 text-gray-900 dark:text-gray-200">{branch.contact.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="ml-1 text-gray-900 dark:text-gray-200">{branch.contact.email}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Brand:</span>
                <span className="ml-1 text-gray-900 dark:text-gray-200">{branch.brand.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}