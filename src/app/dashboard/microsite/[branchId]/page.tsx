'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import MicrositeEditor from '@/components/dashboard/microsite/MicrositeEditor';
import { MicrositeConfig } from '@/types/microsite';

export default function MicrositeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [branchData, setBranchData] = useState<any>(null);

  const branchId = params.branchId as string;

  console.log('🎯 MicrositeEditorPage rendered:', { branchId, hasUser: !!user, authLoading, loading, hasError: !!error, hasBranchData: !!branchData });

  useEffect(() => {
    console.log('🔄 useEffect triggered:', { hasUser: !!user, branchId });
    if (!user) {
      console.log('⏳ Waiting for user to load...');
      return;
    }

    console.log('👤 User loaded, fetching branch data...');
    fetchBranchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, branchId]);

  const fetchBranchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/branches/${branchId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to fetch branch data (${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setBranchData(data.branch);
    } catch (err) {
      console.error('Error fetching branch:', err);
      setError(err instanceof Error ? err.message : 'Failed to load branch data');
    } finally {
      setLoading(false);
    }
  };

  // Wait for auth to finish loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If auth finished but no user, redirect to login
  if (!user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading microsite data...</p>
        </div>
      </div>
    );
  }

  if (error || !branchData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Microsite</h2>
          <p className="text-gray-600 mb-4">{error || 'Branch not found'}</p>
          <button
            onClick={() => router.push('/dashboard/branches')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Branches
          </button>
        </div>
      </div>
    );
  }

  // Ensure micrositeConfig exists with default values
  const initialConfig: MicrositeConfig = branchData.micrositeConfig || {
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
      title: branchData.name || '',
      description: '',
      keywords: [],
    },
  };

  console.log('✅ Rendering MicrositeEditor component:', { branchId, brandId: branchData.brandId, userRole: user.role });

  return (
    <MicrositeEditor
      branchId={branchId}
      brandId={branchData.brandId}
      initialConfig={initialConfig}
      userRole={user.role}
    />
  );
}
