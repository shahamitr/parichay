'use client';

import { useState, useRef } from 'react';
import { AssetType } from '@/lib/microsite-assets-types';

interface FileUploadProps {
  onUploadComplete?: (url: string) => void;
  onUpload?: (url: string) => void; // Alias for backward compatibility
  currentFile?: string;
  currentUrl?: string; // Alias for currentFile
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  branchId?: string; // For microsite-based storage
  assetType?: AssetType; // Asset type for proper categorization
}

export default function FileUpload({
  onUploadComplete,
  onUpload,
  currentFile,
  currentUrl,
  accept = 'image/*',
  maxSize = 5,
  className = '',
  branchId,
  assetType = 'gallery',
}: FileUploadProps) {
  // Support both prop names for backward compatibility
  const handleUploadComplete = onUploadComplete || onUpload;
  const fileUrl = currentFile || currentUrl;
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type based on accept prop
    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (accept === 'video/*' && !file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }
    if (accept === 'audio/*' && !file.type.startsWith('audio/')) {
      setError('Please select an audio file');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', assetType);

      // Add branchId for microsite-based storage
      if (branchId) {
        formData.append('branchId', branchId);
      }

      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      handleUploadComplete?.(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Determine preview type based on current file
  const isImage = fileUrl && (
    fileUrl.includes('/logo/') ||
    fileUrl.includes('/gallery/') ||
    fileUrl.includes('/hero/') ||
    fileUrl.includes('/testimonials/') ||
    fileUrl.includes('/team/') ||
    fileUrl.includes('/portfolio/') ||
    fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  );

  const isAudio = fileUrl && (
    fileUrl.includes('/voice/') ||
    fileUrl.match(/\.(mp3|wav|ogg|m4a|webm)$/i)
  );

  const isVideo = fileUrl && (
    fileUrl.includes('/video/') ||
    fileUrl.match(/\.(mp4|webm|ogg|mov)$/i)
  );

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
          ${dragOver
            ? 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        {fileUrl ? (
          <div className="flex items-center space-x-4">
            {isImage && (
              <img
                src={fileUrl}
                alt="Uploaded file"
                className="h-16 w-16 object-cover rounded-lg"
              />
            )}
            {isAudio && (
              <div className="h-16 w-16 flex items-center justify-center bg-primary-100 dark:bg-primary-900 rounded-lg">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            )}
            {isVideo && (
              <div className="h-16 w-16 flex items-center justify-center bg-primary-100 dark:bg-primary-900 rounded-lg">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {!isImage && !isAudio && !isVideo && (
              <div className="h-16 w-16 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                File uploaded
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Click or drag to replace
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {uploading ? 'Uploading...' : 'Upload a file'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                Max size: {maxSize}MB
              </p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-neutral-800 dark:bg-opacity-75 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 dark:border-primary-400"></div>
              <span className="text-sm text-neutral-600 dark:text-neutral-300">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-error-600 dark:text-error-400">{error}</p>
      )}
    </div>
  );
}
