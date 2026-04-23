'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { compressImageWithPreset } from '@/lib/image-utils';
import { AssetType } from '@/lib/microsite-assets-types';

interface ImageUploadArrayProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  helpText?: string;
  branchId?: string; // For microsite-based storage
  assetType?: AssetType; // Asset type for proper categorization
}

/**
 * ImageUploadArray Component
 *
 * Allows users to upload and manage multiple images
 * Features: drag-and-drop, preview, reorder, delete
 */
export default function ImageUploadArray({
  label,
  images,
  onChange,
  maxImages = 5,
  helpText,
  branchId,
  assetType = 'gallery',
}: ImageUploadArrayProps) {
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        // Compress image
        const compressed = await compressImageWithPreset(file, 'standard');

        // Upload to server
        const formData = new FormData();
        formData.append('file', compressed, file.name);
        formData.append('type', assetType);

        // Add branchId for microsite-based storage
        if (branchId) {
          formData.append('branchId', branchId);
        }

        const token = localStorage.getItem('token');
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
          <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
            ({images.length}/{maxImages})
          </span>
        </label>
      </div>

      {helpText && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{helpText}</p>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full px-4 py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-primary-500 dark:text-primary-400 animate-spin" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    PNG, JPG, GIF up to 10MB each
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group aspect-square rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-move ${draggedIndex === index ? 'opacity-50 scale-95' : ''
                }`}
            >
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-error-500 dark:bg-error-600 text-white rounded-full hover:bg-error-600 dark:hover:bg-error-700 transition-all transform scale-90 group-hover:scale-100"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-neutral-400 dark:text-neutral-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
