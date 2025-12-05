// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { MicrositeConfig, MicrositeData } from '@/types/microsite';
import { MicrositeTemplate } from '@/types/template';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import TemplateSelector from './TemplateSelector';
import SectionManager from './SectionManager';
import MicrositePreview from './MicrositePreview';
import ContentEditor from './ContentEditor';

interface MicrositeBuilderProps {
  branchId: string;
  initialData?: MicrositeData;
  onSave: (config: MicrositeConfig) => Promise<void>;
  onCancel: () => void;
}

type BuilderView = 'sections' | 'content' | 'preview';
type EditingSection = keyof MicrositeConfig['sections'] | null;

export default function MicrositeBuilder({
  branchId,
  initialData,
  onSave,
  onCancel,
}: MicrositeBuilderProps) {
  const initialConfig = initialData?.branch.micrositeConfig || getDefaultConfig();

  const {
    state: config,
    setState: setConfig,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<MicrositeConfig>({
    initialState: initialConfig,
    maxHistory: 50,
  });

  const [currentView, setCurrentView] = useState<BuilderView>('sections');
  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes for unsaved indicator
  useEffect(() => {
    const hasChanges = JSON.stringify(config) !== JSON.stringify(initialConfig);
    setHasUnsavedChanges(hasChanges);
  }, [config, initialConfig]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Z (Windows/Linux) or Cmd+Z (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo != null) {
          undo();
        }
      }
      // Check for Ctrl+Y (Windows/Linux) or Cmd+Shift+Z (Mac) for redo
      if (
        ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
      ) {
        event.preventDefault();
        if (canRedo != null) {
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  const handleConfigUpdate = (updates: Partial<MicrositeConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const handleSectionUpdate = (
    sectionKey: keyof MicrositeConfig['sections'],
    updates: any
  ) => {
    setConfig({
      ...config,
      sections: {
        ...config.sections,
        [sectionKey]: {
          ...config.sections[sectionKey],
          ...updates,
        },
      },
    });
  };

  const handleSectionToggle = (sectionKey: keyof MicrositeConfig['sections']) => {
    setConfig({
      ...config,
      sections: {
        ...config.sections,
        [sectionKey]: {
          ...config.sections[sectionKey],
          enabled: !config.sections[sectionKey].enabled,
        },
      },
    });
  };

  const handleSectionReorder = (sections: (keyof MicrositeConfig['sections'])[]) => {
    // Create new sections object with reordered keys
    const reorderedSections = {} as MicrositeConfig['sections'];
    sections.forEach(key => {
      reorderedSections[key] = config.sections[key];
    });

    setConfig({
      ...config,
      sections: reorderedSections,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(config);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges != null) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleTemplateSelect = (newConfig: MicrositeConfig) => {
    setConfig(newConfig);
    setShowTemplateSelector(false);
  };

  const handleEditSection = (sectionKey: keyof MicrositeConfig['sections']) => {
    setEditingSection(sectionKey);
    setCurrentView('content');
  };

  const handleBackToSections = () => {
    setEditingSection(null);
    setCurrentView('sections');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Microsite Builder</h1>
            <div className="flex items-center gap-2">
              {/* Undo/Redo Buttons */}
              <div className="flex items-center gap-1 mr-2">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Undo (Ctrl+Z)"
                  aria-label="Undo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Redo (Ctrl+Y)"
                  aria-label="Redo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Change Template
              </button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('sections')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === 'sections'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sections
            </button>
            <button
              onClick={() => setCurrentView('content')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === 'content'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setCurrentView('preview')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'sections' && (
            <SectionManager
              config={config}
              onSectionToggle={handleSectionToggle}
              onSectionReorder={handleSectionReorder}
              onEditSection={handleEditSection}
              onConfigUpdate={handleConfigUpdate}
            />
          )}

          {currentView === 'content' && (
            <ContentEditor
              config={config}
              editingSection={editingSection}
              onSectionUpdate={handleSectionUpdate}
              onBackToSections={handleBackToSections}
              branchData={initialData?.branch}
            />
          )}

          {currentView === 'preview' && (
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-4">
                Preview your microsite as it will appear to visitors.
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">Preview will be shown in the main area</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {hasUnsavedChanges && (
            <p className="text-xs text-orange-600 mt-2 text-center">
              You have unsaved changes
            </p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Preview Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentView === 'preview' ? 'Live Preview' : 'Microsite Builder'}
              </h2>
              <p className="text-sm text-gray-600">
                {initialData?.brand.name} - {initialData?.branch.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Template:</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {config.templateId.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {currentView === 'preview' && initialData ? (
            <MicrositePreview
              data={{
                ...initialData,
                branch: {
                  ...initialData.branch,
                  micrositeConfig: config,
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {currentView === 'sections' ? 'Manage Sections' : 'Edit Content'}
                </h3>
                <p className="text-gray-600">
                  {currentView === 'sections'
                    ? 'Use the sidebar to enable, disable, and reorder sections'
                    : 'Select a section from the sidebar to edit its content'
                  }
                </p>
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
    </div>
  );
}

function getDefaultConfig(): MicrositeConfig {
  return {
    templateId: 'general-modern',
    sections: {
      hero: {
        enabled: true,
        title: 'Welcome to Our Business',
        subtitle: 'Professional services you can trust',
      },
      about: {
        enabled: true,
        content: 'Tell your customers about your business and what makes you special.',
      },
      services: {
        enabled: true,
        items: [],
      },
      gallery: {
        enabled: false,
        images: [],
      },
      contact: {
        enabled: true,
        showMap: true,
        leadForm: {
          enabled: true,
          fields: ['name', 'email', 'phone', 'message'],
        },
      },
    },
    seoSettings: {
      title: 'Professional Business Services',
      description: 'Contact us for all your business needs.',
      keywords: ['business', 'professional', 'services'],
    },
  };
}