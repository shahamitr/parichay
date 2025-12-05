// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToastHelpers } from '@/components/ui/Toast';
import CategoryManager from '@/components/admin/CategoryManager';

interface SystemSettings {
  // General Settings
  siteName: string;
  siteUrl: string;
  supportEmail: string;

  // Email Settings
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;

  // Storage Settings
  storageProvider: 'local' | 's3' | 'cloudinary';
  s3Bucket?: string;
  s3Region?: string;
  s3AccessKey?: string;
  s3SecretKey?: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;

  // Feature Flags
  enableRegistration: boolean;
  enableCustomDomains: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;

  // Limits
  maxBrandsPerUser: number;
  maxBranchesPerBrand: number;
  maxFileSize: number;

  // Payment Settings
  stripePublicKey: string;
  stripeSecretKey: string;
  enablePayments: boolean;
}

export default function SystemPage() {
  const { user } = useAuth();
  const { success, error, info, warning } = useToastHelpers();
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'OneTouch BizCard',
    siteUrl: 'http://localhost:3000',
    supportEmail: 'support@onetouchbizcard.in',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpFrom: 'noreply@onetouchbizcard.in',
    storageProvider: 'local',
    enableRegistration: true,
    enableCustomDomains: true,
    enableAnalytics: true,
    enableNotifications: true,
    maxBrandsPerUser: 10,
    maxBranchesPerBrand: 50,
    maxFileSize: 5,
    stripePublicKey: '',
    stripeSecretKey: '',
    enablePayments: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/system/settings', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/system/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        success('Settings saved successfully');
      } else {
        const data = await response.json();
        error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      error('An error occurred while saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading != null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'storage', name: 'Storage', icon: '💾' },
    { id: 'features', name: 'Features', icon: '🎯' },
    { id: 'limits', name: 'Limits', icon: '📊' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'categories', name: 'Industry Categories', icon: '🏢' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="mt-1 text-gray-600">
              Configure system-wide settings and preferences
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">General Settings</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://yourdomain.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="support@yourdomain.com"
                />
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Email Configuration</h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={settings.smtpUser}
                  onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email
                </label>
                <input
                  type="email"
                  value={settings.smtpFrom}
                  onChange={(e) => handleInputChange('smtpFrom', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="noreply@yourdomain.com"
                />
              </div>
            </div>
          )}

          {/* Storage Settings */}
          {activeTab === 'storage' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Storage Configuration</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Provider
                </label>
                <select
                  value={settings.storageProvider}
                  onChange={(e) => handleInputChange('storageProvider', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="local">Local Storage</option>
                  <option value="s3">Amazon S3</option>
                  <option value="cloudinary">Cloudinary</option>
                </select>
              </div>

              {settings.storageProvider === 's3' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      S3 Bucket Name
                    </label>
                    <input
                      type="text"
                      value={settings.s3Bucket || ''}
                      onChange={(e) => handleInputChange('s3Bucket', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      S3 Region
                    </label>
                    <input
                      type="text"
                      value={settings.s3Region || ''}
                      onChange={(e) => handleInputChange('s3Region', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="us-east-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      S3ey
                    </label>
                    <input
                      type="text"
                      value={settings.s3AccessKey || ''}
                      onChange={(e) => handleInputChange('s3AccessKey', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      S3 Secret Key
                    </label>
                    <input
                      type="password"
                      value={settings.s3SecretKey || ''}
                      onChange={(e) => handleInputChange('s3SecretKey', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {settings.storageProvider === 'cloudinary' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cloud Name
                    </label>
                    <input
                      type="text"
                      value={settings.cloudinaryCloudName || ''}
                      onChange={(e) => handleInputChange('cloudinaryCloudName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={settings.cloudinaryApiKey || ''}
                      onChange={(e) => handleInputChange('cloudinaryApiKey', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={settings.cloudinaryApiSecret || ''}
                      onChange={(e) => handleInputChange('cloudinaryApiSecret', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Feature Flags */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Feature Flags</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">User Registration</h4>
                    <p className="text-sm text-gray-500">Allow new users to register</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableRegistration}
                      onChange={(e) => handleInputChange('enableRegistration', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Custom Domains</h4>
                    <p className="text-sm text-gray-500">Allow brands to use custom domains</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableCustomDomains}
                      onChange={(e) => handleInputChange('enableCustomDomains', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Analytics</h4>
                    <p className="text-sm text-gray-500">Enable analytics tracking</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableAnalytics}
                      onChange={(e) => handleInputChange('enableAnalytics', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
                    <p className="text-sm text-gray-500">Enable system notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Limits */}
          {activeTab === 'limits' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">System Limits</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Brands Per User
                </label>
                <input
                  type="number"
                  value={settings.maxBrandsPerUser}
                  onChange={(e) => handleInputChange('maxBrandsPerUser', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
                <p className="mt-1 text-sm text-gray-500">Maximum number of brands a user can create</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Branches Per Brand
                </label>
                <input
                  type="number"
                  value={settings.maxBranchesPerBrand}
                  onChange={(e) => handleInputChange('maxBranchesPerBrand', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
                <p className="mt-1 text-sm text-gray-500">Maximum number of branches per brand</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="100"
                />
                <p className="mt-1 text-sm text-gray-500">Maximum file upload size in megabytes</p>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Payment Configuration</h3>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Enable Payments</h4>
                  <p className="text-sm text-gray-500">Allow subscription payments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enablePayments}
                    onChange={(e) => handleInputChange('enablePayments', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Public Key
                </label>
                <input
                  type="text"
                  value={settings.stripePublicKey}
                  onChange={(e) => handleInputChange('stripePublicKey', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="pk_test_..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Secret Key
                </label>
                <input
                  type="password"
                  value={settings.stripeSecretKey}
                  onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="sk_test_..."
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Keep your Stripe secret key secure. Never share it publicly or commit it to version control.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Industry Categories */}
          {activeTab === 'categories' && (
            <CategoryManager />
          )}
        </div>
      </div>
    </div>
  );
}
