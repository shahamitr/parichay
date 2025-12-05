// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import Drawer from '@/components/ui/Drawer';

interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password?: string;
  brandId?: string;
}

interface UserFormProps {
  user?: User | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const { success, error, info, warning } = useToastHelpers();
  const [formData, setFormData] = useState<User>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    password: '',
    brandId: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    if (user != null) {
      setFormData({
        ...user,
        password: '', // Don't populate password for edit
      });
    }
    fetchBrands();
  }, [user]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands || []);
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
      // Validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error('Please fill in all required fields');
      }

      if (!user && !formData.password) {
        throw new Error('Password is required for new users');
      }

      const url = user ? `/api/users/${user.id}` : '/api/users';
      const method = user ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save user');
      }

      success(user ? 'User updated successfully' : 'User created successfully');
      onSave();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to save user';
      setErrors({ general: errorMsg });
      error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Drawer
      isOpen={true}
      onClose={onCancel}
      title={user ? 'Edit User' : 'Add New User'}
      size="2xl"
    >
      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="user@example.com"
            required
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Password */}
        {!user && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={8}
            />
            <p className="mt-1 text-sm text-gray-500">Minimum 8 characters</p>
          </div>
        )}

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USER">User</option>
            <option value="BRAND_ADMIN">Brand Admin</option>
            <option value="BRAND_MANAGER">Brand Manager</option>
            <option value="EXECUTIVE">Executive</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand (Optional)
          </label>
          <select
            value={formData.brandId || ''}
            onChange={(e) => handleInputChange('brandId', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
