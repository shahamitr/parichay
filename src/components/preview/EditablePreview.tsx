'use client';

import { useState } from 'react';
import { Edit2, Save, X, Sparkles, RefreshCw } from 'lucide-react';
import ContentGenerator from '@/components/ai/ContentGenerator';
import { ContentGenerationRequest } from '@/lib/ai-content-generator';

interface EditableSection {
  id: string;
  type: ContentGenerationRequest['type'];
  label: string;
  content: string;
  editable: boolean;
}

interface EditablePreviewProps {
  businessName: string;
  industry: string;
  sections: EditableSection[];
  onSave: (sections: EditableSection[]) => void;
  onCancel?: () => void;
}

export default function EditablePreview({
  businessName,
  industry,
  sections: initialSections,
  onSave,
  onCancel,
}: EditablePreviewProps) {
  const [sections, setSections] = useState<EditableSection[]>(initialSections);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleEdit = (sectionId: string) => {
    setEditingSection(sectionId);
    setShowAIGenerator(null);
  };

  const handleSaveSection = (sectionId: string, newContent: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, content: newContent }
          : section
      )
    );
    setEditingSection(null);
    setHasChanges(true);
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setShowAIGenerator(null);
  };

  const handleAIGenerate = (sectionId: string) => {
    setShowAIGenerator(sectionId);
    setEditingSection(null);
  };

  const handleAISelect = (sectionId: string, content: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, content }
          : section
      )
    );
    setShowAIGenerator(null);
    setHasChanges(true);
  };

  const handleSaveAll = () => {
    onSave(sections);
  };

  const getSection = (sectionId: string) => {
    return sections.find(s => s.id === sectionId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Microsite Content
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Review and customize your AI-generated content
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <span className="text-sm text-orange-600 font-medium">
                Unsaved changes
              </span>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSaveAll}
              disabled={!hasChanges}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => {
          const isEditing = editingSection === section.id;
          const isGenerating = showAIGenerator === section.id;

          return (
            <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Section Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.label}
                </h3>
                {section.editable && !isEditing && !isGenerating && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAIGenerate(section.id)}
                      className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center space-x-1"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>AI Regenerate</span>
                    </button>
                    <button
                      onClick={() => handleEdit(section.id)}
                      className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Section Content */}
              <div className="p-6">
                {isGenerating ? (
                  <div>
                    <ContentGenerator
                      type={section.type}
                      businessName={businessName}
                      industry={industry}
                      currentContent={section.content}
                      onSelect={(content) => handleAISelect(section.id, content)}
                    />
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : isEditing ? (
                  <div>
                    <textarea
                      value={section.content}
                      onChange={(e) => {
                        const newContent = e.target.value;
                        setSections(prev =>
                          prev.map(s =>
                            s.id === section.id
                              ? { ...s, content: newContent }
                              : s
                          )
                        );
                      }}
                      rows={section.type === 'about' ? 8 : 4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={() => handleSaveSection(section.id, section.content)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {hasChanges
              ? 'You have unsaved changes. Click "Save Changes" to apply them.'
              : 'All changes are saved. You can continue to preview or publish.'}
          </p>
          <div className="flex items-center space-x-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSaveAll}
              disabled={!hasChanges}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save & Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
