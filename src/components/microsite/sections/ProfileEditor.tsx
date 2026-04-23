'use client';

import { useState } from 'react';
import DynamicFieldArray from '../DynamicFieldArray';
import { Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ProfileEditorProps {
  config: any;
  onChange: (data: any) => void;
  canEditBranding: boolean;
}

export default function ProfileEditor({
  config,
  onChange,
  canEditBranding,
}: ProfileEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [logo, setLogo] = useState(config.brand?.logo || '');
  const [phones, setPhones] = useState<string[]>(
    config.contact?.phones || [config.contact?.phone || '']
  );
  const [emails, setEmails] = useState<string[]>(
    config.contact?.emails || [config.contact?.email || '']
  );
  const [whatsappNumbers, setWhatsappNumbers] = useState<string[]>(
    config.contact?.whatsappNumbers || [config.contact?.whatsapp || ''].filter(Boolean)
  );

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setLogo(data.url);
      onChange({ ...config, brand: { ...config.brand, logo: data.url } });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Basic information about your business that appears on your microsite
        </p>
      </div>

      {/* Logo Upload */}
      {canEditBranding && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Business Logo
          </label>
          <div className="flex items-center gap-4">
            {logo && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <Image src={logo} alt="Logo" fill className="object-contain" />
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                className="hidden"
                id="logo-upload"
                disabled={uploading}
              />
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </>
                )}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG or JPG, max 2MB. Square format recommended.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Business Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Business Name *
        </label>
        <input
          type="text"
          value={config.brand?.name || ''}
          onChange={(e) => handleChange('brand', { ...config.brand, name: e.target.value })}
          placeholder="Enter business name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
          disabled={!canEditBranding}
        />
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tagline
        </label>
        <input
          type="text"
          value={config.brand?.tagline || ''}
          onChange={(e) => handleChange('brand', { ...config.brand, tagline: e.target.value })}
          placeholder="Your business tagline"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
          disabled={!canEditBranding}
        />
      </div>

      {/* Phone Numbers */}
      <DynamicFieldArray
        label="Phone Numbers"
        values={phones}
        onChange={(values) => {
          setPhones(values);
          handleChange('contact', { ...config.contact, phones: values });
        }}
        type="tel"
        placeholder="Enter phone number"
        maxItems={5}
        helpText="Add multiple phone numbers for your business"
      />

      {/* Email Addresses */}
      <DynamicFieldArray
        label="Email Addresses"
        values={emails}
        onChange={(values) => {
          setEmails(values);
          handleChange('contact', { ...config.contact, emails: values });
        }}
        type="email"
        placeholder="Enter email address"
        maxItems={3}
        helpText="Add multiple email addresses"
      />

      {/* WhatsApp Numbers */}
      <DynamicFieldArray
        label="WhatsApp Numbers"
        values={whatsappNumbers}
        onChange={(values) => {
          setWhatsappNumbers(values);
          handleChange('contact', { ...config.contact, whatsappNumbers: values });
        }}
        type="tel"
        placeholder="Enter WhatsApp number with country code"
        maxItems={3}
        helpText="Include country code (e.g., +91 for India)"
      />

      {/* Social Media Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Social Media</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Facebook Page URL
            </label>
            <input
              type="url"
              value={config.socialMedia?.facebook || ''}
              onChange={(e) =>
                handleChange('socialMedia', { ...config.socialMedia, facebook: e.target.value })
              }
              placeholder="https://facebook.com/yourpage"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Instagram Profile URL
            </label>
            <input
              type="url"
              value={config.socialMedia?.instagram || ''}
              onChange={(e) =>
                handleChange('socialMedia', { ...config.socialMedia, instagram: e.target.value })
              }
              placeholder="https://instagram.com/yourprofile"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              LinkedIn Page URL
            </label>
            <input
              type="url"
              value={config.socialMedia?.linkedin || ''}
              onChange={(e) =>
                handleChange('socialMedia', { ...config.socialMedia, linkedin: e.target.value })
              }
              placeholder="https://linkedin.com/company/yourcompany"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Twitter/X Profile URL
            </label>
            <input
              type="url"
              value={config.socialMedia?.twitter || ''}
              onChange={(e) =>
                handleChange('socialMedia', { ...config.socialMedia, twitter: e.target.value })
              }
              placeholder="https://twitter.com/yourprofile"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              YouTube Channel URL
            </label>
            <input
              type="url"
              value={config.socialMedia?.youtube || ''}
              onChange={(e) =>
                handleChange('socialMedia', { ...config.socialMedia, youtube: e.target.value })
              }
              placeholder="https://youtube.com/@yourchannel"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Google Reviews URL
            </label>
            <input
              type="url"
              value={config.socialMedia?.googleReviews || ''}
              onChange={(e) =>
                handleChange('socialMedia', { ...config.socialMedia, googleReviews: e.target.value })
              }
              placeholder="https://g.page/r/..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Link to your Google Business reviews page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
