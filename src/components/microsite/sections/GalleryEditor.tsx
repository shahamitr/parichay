'use client';

import ImageUploadArray from '../ImageUploadArray';
import { GallerySection } from '@/types/microsite';
import Toggle from '@/components/ui/Toggle';

interface GalleryEditorProps {
  config: GallerySection;
  onChange: (data: GallerySection) => void;
  branchId?: string;
}

export default function GalleryEditor({ config, onChange, branchId }: GalleryEditorProps) {
  const handleImagesChange = (images: string[]) => {
    onChange({
      ...config,
      images,
    });
  };

  const handleToggle = (enabled: boolean) => {
    onChange({
      ...config,
      enabled,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gallery Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Showcase your work, products, or business with a beautiful image gallery
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Gallery Section</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Show or hide this section on your microsite
          </p>
        </div>
        <Toggle
          enabled={config.enabled}
          onChange={handleToggle}
        />
      </div>

      {config.enabled && (
        <>
          {/* Image Upload */}
          <ImageUploadArray
            label="Gallery Images"
            images={config.images || []}
            onChange={handleImagesChange}
            maxImages={50}
            helpText="Upload high-quality images to showcase your business. Drag to reorder."
            branchId={branchId}
            assetType="gallery"
          />

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Gallery Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Use high-resolution images (at least 1200px wide)</li>
              <li>Maintain consistent aspect ratios for a professional look</li>
              <li>Show variety: products, team, workspace, events</li>
              <li>Add captions or descriptions in the image file name</li>
              <li>Optimize images before upload for faster loading</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
