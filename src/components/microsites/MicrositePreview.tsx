'use client';

import { useState } from 'react';
import { MicrositeData } from '@/types/microsite';
import MicrositeRenderer from './MicrositeRenderer';

interface MicrositePreviewProps {
  data: MicrositeData;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const deviceDimensions = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '1024px' },
  mobile: { width: '375px', height: '667px' },
};

export default function MicrositePreview({ data }: MicrositePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  const dimensions = deviceDimensions[deviceMode];

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col">
      {/* Device Mode Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center gap-2">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              deviceMode === 'desktop'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Desktop View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                clipRule="evenodd"
              />
            </svg>
            Desktop
          </button>

          <button
            onClick={() => setDeviceMode('tablet')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              deviceMode === 'tablet'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Tablet View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            Tablet
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              deviceMode === 'mobile'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Mobile View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            Mobile
          </button>
        </div>

        {deviceMode !== 'desktop' && (
          <span className="text-sm text-gray-500 ml-4">
            {dimensions.width} × {dimensions.height}
          </span>
        )}
      </div>

      {/* Preview Frame */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <div
          className={`bg-white shadow-xl transition-all duration-300 ${
            deviceMode === 'desktop' ? 'w-full h-full' : 'rounded-lg overflow-hidden'
          }`}
          style={{
            width: dimensions.width,
            height: deviceMode === 'desktop' ? '100%' : dimensions.height,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <div className="w-full h-full overflow-auto">
            <MicrositeRenderer data={data} />
          </div>
        </div>
      </div>

      {/* Preview Overlay Indicator */}
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Preview Mode</span>
        </div>
      </div>
    </div>
  );
}
