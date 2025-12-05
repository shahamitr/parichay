// @ts-nocheck
'use client';

import { useState, useEffect, useCallback } from 'react';
import { MicrositeConfig, MicrositeData, SectionOrderItem, SectionId } from '@/types/microsite';
import {
  DragDropEditor,
  MobilePreviewToggle,
  PreviewContainer,
  ColorThemePicker,
  FontSelector,
  SectionTemplates,
  UndoHistoryPanel,
  useHistoryWithDescriptions,
  generateFontCSS,
} from './builder';
import type { DeviceType } from './builder';
import MicrositePreview from './MicrositePreview';
import ContentEditor from './ContentEditor';
import TemplateSelector from './TemplateSelector';
import {
  Palette,
  Type,
  Layout,
  Settings,
  Eye,
  Save,
  X,
  ChevronLeft,
  Sparkles,
  Layers,
} from 'lucide-react';

interface EnhancedMicrositeBuilderProps {
  branchId: string;
  initialData?: MicrositeData;
  onSave: (config: MicrositeConfig) => Promise<void>;
  onCancel: () => void;
}

type SidebarTab = 'sections' | 'design' | 'content';

const DEFAULT_SECTION_ORDER: SectionOrderItem[] = [
  { id: 'hero', enabled: true },
  { id: 'about', enabled: true },
  { id: 'services', enabled: true },
  { id: 'gallery', enabled: false },
  { id: 'testimonials', enabled: false },
  { id: 'contact', enabled: true },
  { id: 'businessHours', enabled: true },
  { id: 'payment', enabled: true },
  { id: 'feedback', enabled: true },
  { id: 'trustIndicators', enabled: false },
  { id: 'videos', enabled: false },
  { id: 'impact', enabled: false },
  { id: 'portfolio', enabled: false },
  { id: 'aboutFounder', enabled: false },
  { id: 'offers', enabled: false },
  { id: 'cta', enabled: false },
];

function getDefaultConfig(): MicrositeConfig {
  return {
    templateId: 'general-modern',
    sectionOrder: DEFAULT_SECTION_ORDER,
    sections: {
      hero: { enabled: true, title: 'Welcome', subtitle: 'Professional services you can trust' },
      about: { enabled: true, content: '' },
      services: { enabled: true, items: [] },
      gallery: { enabled: false, images: [] },
      contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'email', 'phone', 'message'] } },
    },
    themeSettings: {
      colorTheme: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' },
      fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
    },
    seoSettings: {
      title: '',
      description: '',
      keywords: [],
    },
  };
}

export default function EnhancedMicrositeBuilder({
  branchId,
  initialData,
  onSave,
  onCancel,
}: EnhancedMicrositeBuilderProps) {
  const initialConfig = initialData?.branch.micrositeConfig || getDefaultConfig();

  // History management with descriptions
  const {
    state: config,
    history,
    currentIndex,
    pushState,
    undo,
    redo,
    jumpToState,
    canUndo,
    canRedo,
  } = useHistoryWithDescriptions<MicrositeConfig>(initialConfig, 50);

  const [activeTab, setActiveTab] = useState<SidebarTab>('sections');
  const [editingSection, setEditingSection] = useState<SectionId | null>(null);
  const [previewDevice, setPreviewDevice] = useState<DeviceType>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showSectionTemplates, setShowSectionTemplates] = useState<SectionId | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const hasChanges = JSON.stringify(config) !== JSON.stringify(initialConfig);
    setHasUnsavedChanges(hasChanges);
  }, [config, initialConfig]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        if (canRedo) redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  // Update config with history tracking
  const updateConfig = useCallback((updates: Partial<MicrositeConfig>, action: string, description: string) => {
    pushState({ ...config, ...updates }, action, description);
  }, [config, pushState]);

  // Section handlers
  const handleSectionsChange = (sections: SectionOrderItem[]) => {
    updateConfig({ sectionOrder: sections }, 'section.reorder', 'Reordered sections');
  };

  const handleEditSection = (sectionId: SectionId) => {
    setEditingSection(sectionId);
    setActiveTab('content');
  };

  const handleSectionUpdate = (sectionKey: keyof MicrositeConfig['sections'], updates: any) => {
    const sectionName = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
    updateConfig({
      sections: {
        ...config.sections,
        [sectionKey]: { ...config.sections[sectionKey], ...updates },
      },
    }, 'section.update', `Updated ${sectionName} section`);
  };

  // Theme handlers
  const handleThemeChange = (colorTheme: { primary: string; secondary: string; accent: string }) => {
    updateConfig({
      themeSettings: { ...config.themeSettings, colorTheme },
    }, 'theme.change', 'Changed color theme');
  };

  const handleFontChange = (fonts: { heading: string; body: string }) => {
    updateConfig({
      themeSettings: { ...config.themeSettings, fonts },
    }, 'font.change', 'Changed typography');
  };

  // Template handlers
  const handleTemplateSelect = (newConfig: MicrositeConfig) => {
    pushState(newConfig, 'template.change', 'Changed template');
    setShowTemplateSelector(false);
  };

  const handleSectionTemplateSelect = (sectionConfig: any) => {
    if (showSectionTemplates != null) {
      handleSectionUpdate(showSectionTemplates as keyof MicrositeConfig['sections'], sectionConfig);
    }
    setShowSectionTemplates(null);
  };

  // Save handler
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(config);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    if (hasUnsavedChanges != null) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  // Get preview data
  const previewData = initialData ? {
    ...initialData,
    branch: { ...initialData.branch, micrositeConfig: config },
  } : null;

  return (
    <div className={`flex h-screen bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Sidebar */}
      {!isFullscreen && (
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold text-gray-900">Microsite Builder</h1>
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Templates
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { id: 'sections' as SidebarTab, icon: Layers, label: 'Sections' },
                { id: 'design' as SidebarTab, icon: Palette, label: 'Design' },
                { id: 'content' as SidebarTab, icon: Settings, label: 'Content' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'sections' && (
              <DragDropEditor
                sections={config.sectionOrder || DEFAULT_SECTION_ORDER}
                onSectionsChange={handleSectionsChange}
                onEditSection={handleEditSection}
              />
            )}

            {activeTab === 'design' && (
              <div className="divide-y">
                <ColorThemePicker
                  theme={config.themeSettings?.colorTheme || { primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' }}
                  onChange={handleThemeChange}
                />
                <FontSelector
                  fonts={config.themeSettings?.fonts || { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }}
                  onChange={handleFontChange}
                />
              </div>
            )}

            {activeTab === 'content' && (
              <div className="p-4">
                {editingSection ? (
                  <div>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back to sections
                    </button>
                    <ContentEditor
                      config={config}
                      editingSection={editingSection}
                      onSectionUpdate={handleSectionUpdate}
                      onBackToSections={() => setEditingSection(null)}
                      branchData={initialData?.branch}
                    />
                    <button
                      onClick={() => setShowSectionTemplates(editingSection)}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
                    >
                      <Sparkles className="w-4 h-4" />
                      Choose Layout Template
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Select a section to edit</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Go to Sections tab and click the settings icon
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* History Panel */}
          <UndoHistoryPanel
            history={history.map((h, i) => ({
              id: i,
              timestamp: h.timestamp,
              action: h.action,
              description: h.description,
              state: h.state,
            }))}
            currentIndex={currentIndex}
            onJumpToState={jumpToState}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />

          {/* Footer Actions */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
            {hasUnsavedChanges && (
              <p className="text-xs text-orange-600 mt-2 text-center">Unsaved changes</p>
            )}
          </div>
        </div>
      )}

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Preview Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="font-semibold text-gray-900">
                {initialData?.brand.name} - {initialData?.branch.name}
              </h2>
              <p className="text-sm text-gray-500">Live Preview</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MobilePreviewToggle
              currentDevice={previewDevice}
              onDeviceChange={setPreviewDevice}
              isFullscreen={isFullscreen}
              onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
            />
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-200 p-4">
          {previewData ? (
            <PreviewContainer device={previewDevice}>
              {/* Apply custom fonts */}
              <style dangerouslySetInnerHTML={{ __html: generateFontCSS(config.themeSettings?.fonts || { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }) }} />
              <MicrositePreview data={previewData} />
            </PreviewContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No preview available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          currentConfig={config}
          onTemplateSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {/* Section Templates Modal */}
      {showSectionTemplates && (
        <SectionTemplates
          sectionId={showSectionTemplates}
          currentConfig={config.sections[showSectionTemplates as keyof typeof config.sections]}
          onSelectTemplate={handleSectionTemplateSelect}
          onClose={() => setShowSectionTemplates(null)}
        />
      )}
    </div>
  );
}
