'use client';

import { useState } from 'react';
import { Monitor, Smartphone, Tablet, ExternalLink, RefreshCw, Save, Sparkles, Loader2, AlertCircle, Check, Pencil, Eye } from 'lucide-react';
import { MicrositeConfig, SectionId } from '@/types/microsite';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type ViewMode = 'preview' | 'edit';

interface PreviewPanelProps {
  config: MicrositeConfig;
  brandId: string;
  branchId: string;
  // Action props
  onSave?: () => void;
  onAIMagic?: () => void;
  saving?: boolean;
  hasChanges?: boolean;
  saveSuccess?: boolean;
  saveError?: string | null;
  // View mode props
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  activeSection?: SectionId | null;
  editorContent?: React.ReactNode;
}

const deviceConfig: Record<DeviceType, { width: string; maxWidth: string; icon: React.ReactNode; label: string }> = {
  desktop: { width: '100%', maxWidth: '100%', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' },
  tablet: { width: '768px', maxWidth: '768px', icon: <Tablet className="w-4 h-4" />, label: 'Tablet' },
  mobile: { width: '375px', maxWidth: '375px', icon: <Smartphone className="w-4 h-4" />, label: 'Mobile' },
};

export default function PreviewPanel({
  config,
  brandId,
  branchId,
  onSave,
  onAIMagic,
  saving = false,
  hasChanges = false,
  saveSuccess = false,
  saveError = null,
  viewMode = 'preview',
  onViewModeChange,
  activeSection,
  editorContent,
}: PreviewPanelProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

  const previewUrl = `/preview/${brandId}/${branchId}`;
  const isMobileOrTablet = device !== 'desktop';

  const handleOpenInNewTab = () => {
    window.open(previewUrl, '_blank');
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const isEditMode = viewMode === 'edit';

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Compact Single Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-900/80 gap-2">
        {/* Left: Edit/Preview Toggle + Device Toggle */}
        <div className="flex items-center gap-2">
          {/* Edit/Preview Toggle */}
          {onViewModeChange && (
            <div className="flex items-center bg-gray-800 rounded-lg p-0.5">
              <button
                onClick={() => onViewModeChange('edit')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isEditMode
                    ? 'bg-amber-500 text-gray-900'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Edit mode"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => onViewModeChange('preview')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  !isEditMode
                    ? 'bg-amber-500 text-gray-900'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Preview mode"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>
          )}

          {/* Device Toggle (only show in preview mode) */}
          {!isEditMode && (
            <div className="flex items-center gap-0.5 bg-gray-800 rounded-lg p-0.5">
              {(Object.keys(deviceConfig) as DeviceType[]).map((deviceType) => (
                <button
                  key={deviceType}
                  onClick={() => setDevice(deviceType)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                    device === deviceType
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-500 hover:text-white hover:bg-gray-700/50'
                  }`}
                  title={deviceConfig[deviceType].label}
                >
                  {deviceConfig[deviceType].icon}
                  <span className="hidden sm:inline">{deviceConfig[deviceType].label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Status Indicators (compact) */}
        <div className="flex-1 flex items-center justify-center">
          {hasChanges && !saveSuccess && !saveError && (
            <div className="flex items-center gap-1.5 text-amber-500">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-medium">Unsaved</span>
            </div>
          )}
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-emerald-500">
              <Check className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Saved</span>
            </div>
          )}
          {saveError && (
            <div className="flex items-center gap-1.5 text-red-500">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium truncate max-w-[150px]">{saveError}</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* AI Magic */}
          {onAIMagic && (
            <button
              onClick={onAIMagic}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
              title="AI Magic Fill"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">AI</span>
            </button>
          )}

          {/* Refresh (only in preview mode) */}
          {!isEditMode && (
            <button
              onClick={handleRefresh}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Refresh preview"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Open in new tab */}
          <button
            onClick={handleOpenInNewTab}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Save */}
          {onSave && (
            <button
              onClick={onSave}
              disabled={saving || !hasChanges}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-900 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Save changes"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{saving ? 'Saving' : 'Save'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Area - Edit or Preview */}
      {isEditMode ? (
        /* Edit Mode - Show Editor */
        <div className="flex-1 overflow-y-auto bg-gray-900/30">
          {editorContent ? (
            <div className="p-4 max-w-4xl mx-auto">
              {editorContent}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-sm">Select a section from the sidebar to edit</p>
            </div>
          )}
        </div>
      ) : (
        /* Preview Mode - Show Live Preview */
        <div className="flex-1 overflow-auto p-3 flex justify-center items-start">
          <div
            className={`transition-all duration-300 ${
              isMobileOrTablet
                ? 'border-8 border-gray-700 rounded-[2rem] shadow-2xl bg-gray-700'
                : 'border border-gray-800 rounded-lg'
            }`}
            style={{
              width: deviceConfig[device].width,
              maxWidth: deviceConfig[device].maxWidth,
            }}
          >
            {/* Device Frame Header (for mobile/tablet) */}
            {isMobileOrTablet && (
              <div className="h-5 bg-gray-700 flex items-center justify-center rounded-t-xl">
                <div className="w-16 h-1 bg-gray-600 rounded-full" />
              </div>
            )}

            {/* Iframe Preview */}
            <div
              className={`bg-white overflow-hidden ${
                isMobileOrTablet ? 'rounded-b-xl' : 'rounded-lg'
              }`}
              style={{
                height: isMobileOrTablet ? '580px' : 'calc(100vh - 180px)',
                minHeight: '400px',
              }}
            >
              <iframe
                key={refreshKey}
                src={previewUrl}
                className="w-full h-full border-0"
                title="Microsite Preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>

            {/* Device Frame Footer (for mobile) */}
            {device === 'mobile' && (
              <div className="h-3 bg-gray-700 flex items-center justify-center rounded-b-xl">
                <div className="w-8 h-1 bg-gray-600 rounded-full" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
