// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { BrandAssets } from '@/types/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  validateImageFile,
  compressImage,
  imageToDataURL,
  validateFavicon,
} from '@/lib/image-utils';

export interface BrandAssetsCustomizerProps {
  initialAssets?: BrandAssets;
  onSave: (assets: BrandAssets) => void;
  onCancel?: () => void;
}

/**
 * BrandAssetsCustomizer Component
 *
 * Provides UI for uploading and managing brand assets (favicon and logo)
 */
export const BrandAssetsCustomizer: React.FC<BrandAssetsCustomizerProps> = ({
  initialAssets,
  onSave,
  onCancel,
}) => {
  const [assets, setAssets] = useState<BrandAssets>(initialAssets || {});
  const [uploading, setUploading] = useState<'favicon' | 'logo' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading('favicon');
    setErrors(prev => ({ ...prev, favicon: '' }));

    try {
      // Validate favicon
      const faviconValidation = await validateFavicon(file);
      if (!faviconValidation.valid) {
        setErrors(prev => ({ ...prev, favicon: faviconValidation.error || 'Invalid favicon' }));
        setUploading(null);
        return;
      }

      // Validate file
      const validation = await validateImageFile(file, {
        maxSizeMB: 1,
        allowedTypes: ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon'],
      });

      if (!validation.valid) {
        setErrors(prev => ({ ...prev, favicon: validation.error || 'Invalid file' }));
        setUploading(null);
        return;
      }

      // Compress and convert to data URL
      const compressed = await compressImage(file, {
        maxWidth: 256,
        maxHeight: 256,
        quality: 1,
      });

      const dataUrl = await imageToDataURL(
        new File([compressed], file.name, { type: file.type })
      );

      setAssets(prev => ({ ...prev, favicon: dataUrl }));
    } catch (error) {
      console.error('Favicon upload error:', error);
      setErrors(prev => ({ ...prev, favicon: 'Failed to upload favicon' }));
    } finally {
      setUploading(null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading('logo');
    setErrors(prev => ({ ...prev, logo: '' }));

    try {
      // Validate file
      const validation = await validateImageFile(file, {
        maxSizeMB: 2,
        allowedTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
      });

      if (!validation.valid) {
        setErrors(prev => ({ ...prev, logo: validation.error || 'Invalid file' }));
        setUploading(null);
        return;
      }

      // Compress and convert to data URL
      const compressed = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 400,
        quality: 0.9,
      });

      const dataUrl = await imageToDataURL(
        new File([compressed], file.name, { type: file.type })
      );

      setAssets(prev => ({ ...prev, logo: dataUrl }));
    } catch (error) {
      console.error('Logo upload error:', error);
      setErrors(prev => ({ ...prev, logo: 'Failed to upload logo' }));
    } finally {
      setUploading(null);
    }
  };

  const handleRemove = (type: 'favicon' | 'logo') => {
    setAssets(prev => {
      const newAssets = { ...prev };
      delete newAssets[type];
      return newAssets;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await onSave(assets);
    } catch (error) {
      console.error('Failed to save brand assets:', error);
      setErrors({ general: 'Failed to save. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Favicon Upload */}
      <Card elevation="md" className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
          Favicon
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Small icon displayed in browser tabs (16x16 to 256x256 pixels, square, PNG format recommended)
        </p>

        <div className="space-y-4">
          {assets.favicon ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                <img
                  src={assets.favicon}
                  alt="Favicon preview"
                  className="w-8 h-8 object-contain"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Favicon uploaded
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  This will appear in browser tabs
                </p>
              </div>

              <div className="flex gap-2">
                <label>
                  <input
                    type="file"
                    accept="image/png,image/x-icon,image/vnd.microsoft.icon"
                    onChange={handleFaviconUpload}
                    disabled={uploading !== null}
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    as="span"
                    disabled={uploading !== null}
                  >
                    Change
                  </Button>
                </label>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove('favicon')}
                  disabled={uploading !== null}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <label className="block">
              <input
                type="file"
                accept="image/png,image/x-icon,image/vnd.microsoft.icon"
                onChange={handleFaviconUpload}
                disabled={uploading !== null}
                className="hidden"
              />
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                {uploading === 'favicon' ? (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-8 h-8 animate-spin text-primary-500 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Uploading...
                    </span>
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 mx-auto text-neutral-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Click to upload favicon
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PNG or ICO, max 1MB
                    </p>
                  </>
                )}
              </div>
            </label>
          )}

          {errors.favicon && (
            <p className="text-sm text-error-500">{errors.favicon}</p>
          )}
        </div>
      </Card>

      {/* Logo Upload */}
      <Card elevation="md" className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
          Logo
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Your brand logo displayed on the microsite (PNG, JPG, SVG, or WebP, max 2MB)
        </p>

        <div className="space-y-4">
          {assets.logo ? (
            <div className="flex items-center gap-4">
              <div className="w-32 h-16 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden bg-white flex items-center justify-center p-2">
                <img
                  src={assets.logo}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Logo uploaded
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  This will appear on your microsite
                </p>
              </div>

              <div className="flex gap-2">
                <label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleLogoUpload}
                    disabled={uploading !== null}
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    as="span"
                    disabled={uploading !== null}
                  >
                    Change
                  </Button>
                </label>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove('logo')}
                  disabled={uploading !== null}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <label className="block">
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                disabled={uploading !== null}
                className="hidden"
              />
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                {uploading === 'logo' ? (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-8 h-8 animate-spin text-primary-500 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Uploading...
                    </span>
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 mx-auto text-neutral-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Click to upload logo
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PNG, JPG, SVG, or WebP, max 2MB
                    </p>
                  </>
                )}
              </div>
            </label>
          )}

          {errors.logo && (
            <p className="text-sm text-error-500">{errors.logo}</p>
          )}
        </div>
      </Card>

      {/* General Error */}
      {errors.general && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <p className="text-sm text-error-700">{errors.general}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving || uploading !== null}
          >
            Cancel
          </Button>
        )}

        <Button
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving || uploading !== null}
        >
          Save Brand Assets
        </Button>
      </div>
    </div>
  );
};
