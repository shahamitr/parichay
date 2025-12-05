'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import BrandList from '@/components/brands/BrandList';
import BrandForm from '@/components/brands/BrandForm';

export default function BrandsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBrandSaved = () => {
    setShowForm(false);
    setEditingBrand(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleEditBrand = (brand: any) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brand Management</h1>
            <p className="mt-1 text-gray-600">
              Manage your brands and their settings
            </p>
          </div>
          {(user.role === 'SUPER_ADMIN' || user.role === 'BRAND_MANAGER') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Brand
            </button>
          )}
        </div>
      </div>

      {/* Brand Form Modal */}
      {showForm && (
        <BrandForm
          brand={editingBrand}
          onSave={handleBrandSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingBrand(null);
          }}
        />
      )}

      {/* Brand List */}
      <BrandList
        key={refreshKey}
        onEditBrand={handleEditBrand}
      />
    </div>
  );
}