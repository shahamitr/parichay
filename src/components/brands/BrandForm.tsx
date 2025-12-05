// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { brandCreateSchema, brandUpdateSchema } from '@/lib/validations';
import { useToastHelpers } from '@/components/ui/Toast';
import { useAuth } from '@/lib/auth-context';
import Drawer from '@/components/ui/Drawer';
import FileUpload from '@/components/ui/FileUpload';
import ColorThemePicker from '@/components/ui/ColorThemePicker';

interface Brand {
  id?: string;
  name: string;
  tagline?: string;
  logo?: string;
  customDomain?: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  initialBranch?: {
    name: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
}

interface BrandFormProps {
  brand?: Brand | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function BrandForm({ brand, onSave, onCancel }: BrandFormProps) {
  const { success, error } = useToastHelpers();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState<Brand>({
    name: '',
    tagline: '',
    logo: '',
    customDomain: '',
    colorTheme: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B',
    },
    initialBranch: {
      name: 'Head Office',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      },
    },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (brand != null) {
      setFormData({
        ...brand,
        tagline: brand.tagline || '',
        logo: brand.logo || '',
        customDomain: brand.customDomain || '',
      });
    }
  }, [brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate form data
      const schema = brand ? brandUpdateSchema : brandCreateSchema;
      const validatedData = schema.parse(formData);

      const url = brand ? `/api/brands/${brand.id}` : '/api/brands';
      const method = brand ? 'PUT' : 'POST';

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save brand');
      }

      success(brand ? 'Brand updated successfully' : 'Brand created successfully');

      // Refresh user data to get updated brandId
      if (!brand) {
        await refreshUser();
      }

      onSave();
    } catch (err: any) {
      if (err.errors) {
        // Zod validation errors
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          const path = error.path.join('.');
          fieldErrors[path] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        const errorMsg = err.message || 'Failed to save brand';
        setErrors({ general: errorMsg });
        error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const keys = field.split('.');

    setFormData(prev => {
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        // Handle initialBranch.name, initialBranch.phone, etc.
        return {
          ...prev,
          [keys[0]]: {
            ...(prev[keys[0] as keyof Brand] as any),
            [keys[1]]: value
          }
        };
      } else if (keys.length === 3) {
        // Handle initialBranch.address.street, etc.
        return {
          ...prev,
          [keys[0]]: {
            ...(prev[keys[0] as keyof Brand] as any),
            [keys[1]]: {
              ...(prev[keys[0] as keyof Brand] as any)[keys[1]],
              [keys[2]]: value
            }
          }
        };
      }
      return prev;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const getPreviewUrl = () => {
    if (formData.customDomain) {
      return formData.customDomain;
    }
    const slug = brand?.slug || generateSlug(formData.name);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return slug ? `${baseUrl}/${slug}` : '';
  };

  return (
    <Drawer
      isOpen={true}
      onClose={onCancel}
      title={brand ? 'Edit Brand' : 'Create New Brand'}
      size="2xl"
    >
      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Brand Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.name ? 'border-red-300 dark:border-red-700' : ''
              }`}
            placeholder="Enter brand name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Tagline */}
        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tagline
          </label>
          <input
            type="text"
            id="tagline"
            value={formData.tagline || ''}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter brand tagline"
          />
          {errors.tagline && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tagline}</p>
          )}
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brand Logo
          </label>
          <FileUpload
            onUpload={(url) => handleInputChange('logo', url)}
            currentUrl={formData.logo}
            accept="image/*"
            maxSize={5}
          />
          {errors.logo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.logo}</p>
          )}
        </div>

        {/* Custom Domain */}
        <div>
          <label htmlFor="customDomain" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Custom Domain (Optional)
          </label>
          <input
            type="url"
            id="customDomain"
            value={formData.customDomain || ''}
            onChange={(e) => handleInputChange('customDomain', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://yourdomain.com"
          />
          {errors.customDomain && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customDomain}</p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Leave empty to use default subdomain
          </p>
        </div>

        {/* URL Preview */}
        {formData.name && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">Brand URL Preview</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Your brand will be accessible at:
                </p>
                <code className="block mt-2 text-sm text-blue-800 dark:text-blue-300 bg-white dark:bg-gray-800 px-3 py-2 rounded border border-blue-300 dark:border-blue-700 break-all">
                  {getPreviewUrl()}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Color Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Brand Colors
          </label>
          <ColorThemePicker
            theme={formData.colorTheme}
            onChange={(theme) => setFormData(prev => ({ ...prev, colorTheme: theme }))}
          />
        </div>

        {/* Head Office Details - Only for new brands */}
        {!brand && (
          <div className="border-t dark:border-gray-700 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Head Office / Main Branch Details</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch Name *</label>
                <input
                  type="text"
                  value={formData.initialBranch?.name || 'Head Office'}
                  onChange={(e) => handleInputChange('initialBranch.name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors['initialBranch.name'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['initialBranch.name']}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label>
                  <input
                    type="tel"
                    value={formData.initialBranch?.phone || ''}
                    onChange={(e) => handleInputChange('initialBranch.phone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="+91..."
                  />
                  {errors['initialBranch.phone'] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['initialBranch.phone']}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                  <input
                    type="email"
                    value={formData.initialBranch?.email || ''}
                    onChange={(e) => handleInputChange('initialBranch.email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="office@example.com"
                  />
                  {errors['initialBranch.email'] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['initialBranch.email']}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address *</label>
                <div className="grid grid-cols-1 gap-3 mt-1">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={formData.initialBranch?.address?.street || ''}
                    onChange={(e) => handleInputChange('initialBranch.address.street', e.target.value)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors['initialBranch.address.street'] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['initialBranch.address.street']}</p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.initialBranch?.address?.city || ''}
                      onChange={(e) => handleInputChange('initialBranch.address.city', e.target.value)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.initialBranch?.address?.state || ''}
                      onChange={(e) => handleInputChange('initialBranch.address.state', e.target.value)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={formData.initialBranch?.address?.zipCode || ''}
                      onChange={(e) => handleInputChange('initialBranch.address.zipCode', e.target.value)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={formData.initialBranch?.address?.country || 'India'}
                      onChange={(e) => handleInputChange('initialBranch.address.country', e.target.value)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (brand ? 'Update Brand' : 'Create Brand')}
          </button>
        </div>
      </form>
    </Drawer>
  );
}