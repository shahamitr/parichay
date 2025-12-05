'use client';

import { useState } from 'react';
import { Monitor, Smartphone, Tablet, Maximize2, Minimize2 } from 'lucide-react';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface MobilePreviewToggleProps {
  currentDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

const deviceConfig: Record<DeviceType, { width: string; icon: React.ReactNode; label: string }> = {
  desktop: { width: '100%', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' },
  tablet: { width: '768px', icon: <Tablet className="w-4 h-4" />, label: 'Tablet' },
  mobile: { width: '375px', icon: <Smartphone className="w-4 h-4" />, label: 'Mobile' },
};

export function getPreviewWidth(device: DeviceType): string {
  return deviceConfig[device].width;
}

export default function MobilePreviewToggle({
  currentDevice,
  onDeviceChange,
  isFullscreen,
  onFullscreenToggle,
}: MobilePreviewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      {(Object.keys(deviceConfig) as DeviceType[]).map((device) => (
        <button
          key={device}
          onClick={() => onDeviceChange(device)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            currentDevice === device
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          title={deviceConfig[device].label}
        >
          {deviceConfig[device].icon}
          <span className="hidden sm:inline">{deviceConfig[device].label}</span>
        </button>
      ))}

      {onFullscreenToggle && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            onClick={onFullscreenToggle}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen preview'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </>
      )}
    </div>
  );
}

// Preview Container Component
interface PreviewContainerProps {
  device: DeviceType;
  children: React.ReactNode;
  className?: string;
}

export function PreviewContainer({ device, children, className = '' }: PreviewContainerProps) {
  const width = getPreviewWidth(device);
  const isMobileOrTablet = device !== 'desktop';

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className={`transition-all duration-300 ${
          isMobileOrTablet
            ? 'border-8 border-gray-800 rounded-[2rem] shadow-xl bg-gray-800'
            : ''
        }`}
        style={{
          width: width === '100%' ? '100%' : width,
          maxWidth: '100%',
        }}
      >
        {/* Device Frame Header (for mobile/tablet) */}
        {isMobileOrTablet && (
          <div className="h-6 bg-gray-800 flex items-center justify-center">
            <div className="w-20 h-1 bg-gray-600 rounded-full" />
          </div>
        )}

        {/* Content */}
        <div
          className={`bg-white overflow-auto ${
            isMobileOrTablet ? 'rounded-b-xl' : ''
          }`}
          style={{
            height: isMobileOrTablet ? 'calc(100vh - 200px)' : 'auto',
            maxHeight: isMobileOrTablet ? '700px' : 'none',
          }}
        >
          {children}
        </div>

        {/* Device Frame Footer (for mobile) */}
        {device === 'mobile' && (
          <div className="h-4 bg-gray-800 flex items-center justify-center">
            <div className="w-10 h-1 bg-gray-600 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
