// @ts-nocheck
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MicrositeRenderer from '@/components/microsites/MicrositeRenderer';

export default function MicrositePreviewPage() {
  const searchParams = useSearchParams();
  const [micrositeData, setMicrositeData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const dataParam = searchParams.get('data');

      if (!dataParam) {
        setError('No preview data provided');
        return;
      }

      const decodedData = JSON.parse(decodeURIComponent(dataParam));

      // Transform temp data into microsite format
      const transformedData = {
        brand: {
          id: 'preview',
          name: decodedData.brandName,
          slug: 'preview',
          logo: decodedData.logo || null,
          tagline: decodedData.tagline || null,
          colorTheme: decodedData.colorTheme || {
            primary: '#3B82F6',
            secondary: '#1E40AF',
            accent: '#F59E0B',
          },
        },
        branch: {
          id: 'preview',
          name: decodedData.branchName,
          slug: 'preview',
          address: decodedData.address,
          contact: decodedData.contact,
          socialMedia: decodedData.socialMedia || null,
          businessHours: decodedData.businessHours || null,
          micrositeConfig: decodedData.micrositeConfig || {
            templateId: 'modern-business',
            sections: {
              hero: {
                enabled: true,
                title: `Welcome to ${decodedData.branchName}`,
                subtitle: 'Your trusted partner',
                backgroundType: 'gradient',
                animationEnabled: true,
              },
              about: {
                enabled: true,
                content: decodedData.description || '',
              },
              services: {
                enabled: true,
                items: decodedData.services || [],
              },
              gallery: {
                enabled: decodedData.photos && decodedData.photos.length > 0,
                images: decodedData.photos || [],
              },
              contact: {
                enabled: true,
                showMap: true,
                leadForm: {
                  enabled: true,
                  fields: ['name', 'email', 'phone', 'message'],
                },
              },
            },
            seoSettings: {
              title: decodedData.branchName,
              description: decodedData.description || `Contact ${decodedData.branchName}`,
              keywords: [],
            },
          },
        },
      };

      setMicrositeData(transformedData);
    } catch (err) {
      console.error('Error parsing preview data:', err);
      setError('Failed to load preview data');
    }
  }, [searchParams]);

  if (error != null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!micrositeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Preview Banner */}
      <div className="bg-yellow-500 text-white py-2 px-4 text-center text-sm font-medium sticky top-0 z-50">
        ⚠️ PREVIEW MODE - This is a temporary preview. Changes are not saved.
      </div>

      {/* Render Microsite */}
      <MicrositeRenderer micrositeData={micrositeData} />
    </div>
  );
}
