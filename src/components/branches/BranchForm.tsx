'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { branchCreateSchema, branchUpdateSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import Drawer from '@/components/ui/Drawer';

interface Branch {
  id?: string;
  name: string;
  slug?: string;
  brandId: string;
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
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  businessHours?: Record<string, {
    open: string;
    close: string;
    closed: boolean;
  }>;
}

interface Brand {
  id: string;
  name: string;
}

interface BranchFormProps {
  branch?: Branch | null;
  defaultBrandId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

const defaultBusinessHours = {
  monday: { open: '09:00', close: '18:00', closed: false },
  tuesday: { open: '09:00', close: '18:00', closed: false },
  wednesday: { open: '09:00', close: '18:00', closed: false },
  thursday: { open: '09:00', close: '18:00', closed: false },
  friday: { open: '09:00', close: '18:00', closed: false },
  saturday: { open: '09:00', close: '18:00', closed: false },
  sunday: { open: '09:00', close: '18:00', closed: true },
};

export default function BranchForm({ branch, defaultBrandId, onSave, onCancel }: BranchFormProps) {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState<Branch>({
    name: '',
    slug: '',
    brandId: defaultBrandId || '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    },
    contact: {
      phone: '',
      whatsapp: '',
      email: '',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
    },
    businessHours: defaultBusinessHours,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBrands();
    if (branch != null) {
      setFormData({
        ...branch,
        socialMedia: branch.socialMedia || {},
        businessHours: branch.businessHours || defaultBusinessHours,
      });
    }
  }, [branch]);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/brands', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Generate slug if not present
      const slug = formData.slug || generateSlug(formData.name);

      // Clean up empty social media fields
      const cleanedData = {
        ...formData,
        slug,
        socialMedia: Object.fromEntries(
          Object.entries(formData.socialMedia || {}).filter(([_, value]) => value)
        ),
      };

      // Validate form data
      const schema = branch ? branchUpdateSchema : branchCreateSchema;
      const validatedData = schema.parse(cleanedData);

      const token = localStorage.getItem('token');
      const url = branch ? `/api/branches/${branch.id}` : '/api/branches';
      const method = branch ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save branch');
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
        setErrors({ general: err.message || 'Failed to save branch' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: { ...(prev[keys[0] as keyof Branch] as any), [keys[1]]: value },
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBusinessHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...(prev.businessHours?.[day] as any),
          [field]: value,
        },
      },
    } as any));
  };

  return (
    <Drawer
      isOpen={true}
      onClose={onCancel}
      title={branch ? 'Edit Branch' : 'Create New Branch'}
      size="2xl"
    >
      <div className="pb-20"> {/* Add padding for bottom actions */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <section className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Selection */}
              <div>
                <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Brand *
                </label>
                <select
                  id="brandId"
                  value={formData.brandId}
                  onChange={(e) => handleInputChange('brandId', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={user?.role === 'BRAND_MANAGER'}
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brandId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.brandId}</p>
                )}
              </div>

              {/* Branch Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Branch Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter branch name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="contact.phone"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="+91 9876543210"
                />
                {errors['contact.phone'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['contact.phone']}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact.whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="contact.whatsapp"
                  value={formData.contact.whatsapp}
                  onChange={(e) => handleInputChange('contact.whatsapp', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="contact.email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="branch@example.com"
                />
                {errors['contact.email'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['contact.email']}</p>
                )}
              </div>
            </div>
          </section>

          {/* Address Information */}
          <section className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Address Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address.street"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="123 Main Street"
                />
                {errors['address.street'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['address.street']}</p>
                )}
              </div>

              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City *
                </label>
                <input
                  type="text"
                  id="address.city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Mumbai"
                />
                {errors['address.city'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['address.city']}</p>
                )}
              </div>

              <div>
                <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  State *
                </label>
                <input
                  type="text"
                  id="address.state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Maharashtra"
                />
                {errors['address.state'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['address.state']}</p>
                )}
              </div>

              <div>
                <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  id="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="400001"
                />
                {errors['address.zipCode'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['address.zipCode']}</p>
                )}
              </div>

              <div>
                <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country *
                </label>
                <input
                  type="text"
                  id="address.country"
                  value={formData.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="India"
                />
                {errors['address.country'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['address.country']}</p>
                )}
              </div>
            </div>
          </section>

          {/* Social Media Links */}
          <section className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Social Media Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="socialMedia.facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Facebook
                </label>
                <input
                  type="url"
                  id="socialMedia.facebook"
                  value={formData.socialMedia?.facebook || ''}
                  onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instagram
                </label>
                <input
                  type="url"
                  id="socialMedia.instagram"
                  value={formData.socialMedia?.instagram || ''}
                  onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              <div>
                <label htmlFor="socialMedia.linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="socialMedia.linkedin"
                  value={formData.socialMedia?.linkedin || ''}
                  onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div>
                <label htmlFor="socialMedia.twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Twitter
                </label>
                <input
                  type="url"
                  id="socialMedia.twitter"
                  value={formData.socialMedia?.twitter || ''}
                  onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
            </div>
          </section>

          {/* Business Hours */}
          <section className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Business Hours</h4>
            <div className="space-y-3">
              {Object.entries(formData.businessHours || {}).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {day}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => handleBusinessHoursChange(day, 'closed', !e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{!hours.closed ? 'Open' : 'Closed'}</span>
                  </div>
                  {!hours.closed && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Form Actions - Fixed at bottom */}
          <div className="fixed bottom-0 right-0 w-full max-w-6xl bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 flex justify-end space-x-3 shadow-lg z-10">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (branch ? 'Update Branch' : 'Create Branch')}
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
}