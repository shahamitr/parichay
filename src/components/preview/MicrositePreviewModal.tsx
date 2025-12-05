'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, Smartphone, Monitor, Tablet, RefreshCw } from 'lucide-react';

interface MicrositePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: {
    brandId?: string;
    branchId?: string;
    slug?: string;
    // For temporary preview (before creation)
    tempData?: {
      brandName: string;
      branchName: string;
      address: any;
      contact: any;
      socialMedia?: any;
      micrositeConfig?: any;
    };
  };
  mode?: 'existing' | 'preview'; // existing = real branch, preview = temp data
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function MicrositePreviewModal({
  isOpen,
  onClose,
  previewData,
  mode = 'existing',
}: MicrositePreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (isOpen != null) {
      generatePreviewUrl();
    }
  }, [isOpen, previewData, mode]);

  const generatePreviewUrl = () => {
    setLoading(true);

    if (mode === 'existing' && previewData.brandId && previewData.slug) {
      // Real microsite URL
      setPreviewUrl(`/microsites/${previewData.brandId}/${previewData.slug}`);
    } else if (mode === 'preview' && previewData.tempData) {
      // Temporary preview URL with data in query params
      const encodedData = encodeURIComponent(JSON.stringify(previewData.tempData));
      setPreviewUrl(`/preview/microsite?data=${encodedData}`);
    }

    setLoading(false);
  };

  const getDeviceClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'w-[375px] h-[667px]';
      case 'tablet':
        return 'w-[768px] h-[1024px]';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  const openInNewTab = () => {
    if (previewUrl != null) {
      window.open(previewUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'preview' ? 'Preview Microsite' : 'Microsite Preview'}
            </h2>

            {mode === 'preview' && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                Temporary Preview
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Device Mode Selector */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-2 rounded transition-colors ${
                  deviceMode === 'desktop'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`p-2 rounded transition-colors ${
                  deviceMode === 'tablet'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-2 rounded transition-colors ${
                  deviceMode === 'mobile'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={generatePreviewUrl}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Refresh Preview"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Open in New Tab */}
            <button
              onClick={openInNewTab}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="w-5 h-5" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="flex items-center justify-center h-full">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading preview...</p>
              </div>
            ) : (
              <div
                className={`bg-white shadow-2xl transition-all duration-300 ${getDeviceClass()}`}
                style={{
                  maxHeight: deviceMode === 'desktop' ? '100%' : undefined,
                }}
              >
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0 rounded-lg"
                  title="Microsite Preview"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {mode === 'preview' ? (
                <span>
                  ⚠️ This is a temporary preview. Changes are not saved until you create the branch.
                </span>
              ) : (
                <span>
                  Viewing: {previewData.slug}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
