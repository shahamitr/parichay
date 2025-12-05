'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import MicrositeEditor from '@/components/dashboard/microsite/MicrositeEditor';
import { MicrositeConfig } from '@/types/microsite';

export default function BrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brandData, setBrandData] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  const brandId = params.id as string;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchBrandData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, brandId]);

  const fetchBrandData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/brands/${brandId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch brand');
      }

      const data = await response.json();
      setBrandData(data.brand);

      // Select first branch if available
      if (data.brand.branches && data.brand.branches.length > 0) {
        setSelectedBranch(data.brand.branches[0]);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load brand');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 text-xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => router.push('/dashboard/brands')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Brands
        </button>
      </div>
    );
  }

  if (!brandData) {
    return (
      <div className="p-8 text-center">
        <p>Brand not found</p>
        <button
          onClick={() => router.push('/dashboard/brands')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Brands
        </button>
      </div>
    );
  }

  if (!selectedBranch) {
    return (
      <div className="p-8 text-center">
        <div className="text-yellow-600 text-xl mb-4">📋</div>
        <h2 className="text-xl font-semibold mb-2">No Branches</h2>
        <p className="text-gray-600 mb-4">Create a branch first to manage content.</p>
        <button
          onClick={() => router.push('/dashboard/branches')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Branch
        </button>
      </div>
    );
  }

  const initialConfig: MicrositeConfig = selectedBranch.micrositeConfig || {
    templateId: 'modern-business',
    sections: {
      hero: { enabled: true, title: '', subtitle: '', backgroundType: 'gradient' },
      about: { enabled: true, content: '' },
      services: { enabled: true, items: [] },
      gallery: { enabled: true, images: [] },
      videos: { enabled: true, videos: [] },
      contact: {
        enabled: true,
        showMap: false,
        leadForm: { enabled: true, fields: ['name', 'email', 'phone', 'message'] },
      },
      payment: { enabled: true },
      feedback: { enabled: true },
    },
    seoSettings: {
      title: selectedBranch.name || brandData.name || '',
      description: '',
      keywords: [],
    },
  };

  return (
    <div className="space-y-4">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{brandData.name}</h1>
            <p className="text-sm text-gray-600">Manage microsite content</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/brands')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>
      </div>

      <MicrositeEditor
        branchId={selectedBranch.id}
        brandId={brandData.id}
        initialConfig={initialConfig}
        userRole={user?.role || 'ADMIN'}
      />
    </div>
  );
}
