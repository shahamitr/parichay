// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import {
  Palette,
  Upload,
  Save,
  RefreshCw,
  Eye,
  Globe,
  Mail,
  Phone,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function BrandingSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    brandName: '',
    tagline: '',
    supportEmail: '',
    supportPhone: '',
    website: '',
    logo: '',
    favicon: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#8B5CF6',
    showPoweredBy: true,
    customDomain: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agency/settings');
      const data = await response.json();

      if (response.ok) {
        setSettings(data.settings);
        setFormData({
          brandName: data.settings.brandName || '',
          tagline: data.settings.tagline || '',
          supportEmail: data.settings.supportEmail || '',
          supportPhone: data.settings.supportPhone || '',
          website: data.settings.website || '',
          logo: data.settings.logo || '',
          favicon: data.settings.favicon || '',
          primaryColor: data.settings.primaryColor || '#3B82F6',
          secondaryColor: data.settings.secondaryColor || '#10B981',
          accentColor: data.settings.accentColor || '#8B5CF6',
          showPoweredBy: data.settings.showPoweredBy ?? true,
          customDomain: data.settings.customDomain || '',
        });
      } else {
        toast.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/agency/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Settings saved successfully!');
        setSettings(data.settings);
      } else {
        toast.error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Branding Settings</h2>
          <p className="text-gray-600 mt-1">Customize your white-label platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchSettings}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => updateFormData('brandName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Agency Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => updateFormData('tagline', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your tagline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Support Email
            </label>
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => updateFormData('supportEmail', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="support@agency.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Support Phone
            </label>
            <input
              type="tel"
              value={formData.supportPhone}
              onChange={(e) => updateFormData('supportPhone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => updateFormData('website', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://agency.com"
            />
          </div>
        </div>
      </div>

      {/* Visual Branding */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Visual Branding
        </h3>

        <div className="space-y-6">
          {/* Logo & Favicon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => updateFormData('logo', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
                <button className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
                  <Upload className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              {formData.logo && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="h-12 object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.favicon}
                  onChange={(e) => updateFormData('favicon', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/favicon.ico"
                />
                <button className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
                  <Upload className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              {formData.favicon && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={formData.favicon}
                    alt="Favicon preview"
                    className="h-8 w-8 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Color Scheme</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ColorPicker
                label="Primary Color"
                value={formData.primaryColor}
                onChange={(value) => updateFormData('primaryColor', value)}
              />
              <ColorPicker
                label="Secondary Color"
                value={formData.secondaryColor}
                onChange={(value) => updateFormData('secondaryColor', value)}
              />
              <ColorPicker
                label="Accent Color"
                value={formData.accentColor}
                onChange={(value) => updateFormData('accentColor', value)}
              />
            </div>
          </div>

          {/* Color Preview */}
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">Color Preview</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <div
                  className="h-24 rounded-lg shadow-sm mb-2"
                  style={{ backgroundColor: formData.primaryColor }}
                />
                <p className="text-xs text-center text-gray-600">Primary</p>
              </div>
              <div className="flex-1">
                <div
                  className="h-24 rounded-lg shadow-sm mb-2"
                  style={{ backgroundColor: formData.secondaryColor }}
                />
                <p className="text-xs text-center text-gray-600">Secondary</p>
              </div>
              <div className="flex-1">
                <div
                  className="h-24 rounded-lg shadow-sm mb-2"
                  style={{ backgroundColor: formData.accentColor }}
                />
                <p className="text-xs text-center text-gray-600">Accent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Domain Settings
        </h3>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Current Domain:</strong> {settings?.domain}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Domain
            </label>
            <input
              type="text"
              value={formData.customDomain}
              onChange={(e) => updateFormData('customDomain', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="clients.youragency.com"
            />
            <p className="text-xs text-gray-500 mt-2">
              Add a CNAME record pointing to {settings?.domain}
            </p>
          </div>
        </div>
      </div>

      {/* White-Label Options */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">White-Label Options</h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showPoweredBy}
              onChange={(e) => updateFormData('showPoweredBy', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Show "Powered by Parichay"
              </p>
              <p className="text-xs text-gray-500">
                Display Parichay branding in footer (required for Starter plan)
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Preview Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Preview Changes</h3>
            <p className="text-sm text-gray-600 mt-1">
              See how your branding looks to clients
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}

function ColorPicker({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="#3B82F6"
        />
      </div>
    </div>
  );
}
