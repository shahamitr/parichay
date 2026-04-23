'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PreviewPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [branchData, setBranchData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/branches/${params.branchId}`);
        if (response.ok) {
          const data = await response.json();
          setBranchData(data.branch);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.branchId) {
      fetchData();
    }
  }, [params.branchId, params.brandId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!branchData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview Not Available</h1>
          <p className="text-gray-600">Branch not found or preview not ready</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            Preview: {branchData.name}
          </h1>
          <span className="text-sm text-gray-500">Preview Mode</span>
        </div>
      </div>
      <iframe
        src={`/${branchData.brand?.slug || params.brandId}/${branchData.slug || params.branchId}`}
        className="w-full h-[calc(100vh-60px)] border-0"
        title="Microsite Preview"
      />
    </div>
  );
}