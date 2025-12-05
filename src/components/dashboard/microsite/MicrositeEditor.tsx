// @ts-nocheck
import { useState, useEffect } from 'react';
import { Save, Eye, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import MicrositeEditorTabs from './MicrositeEditorTabs';
import ProfileEditor from './sections/ProfileEditor';
import HeroEditor from './sections/HeroEditor';
import AboutEditor from './sections/AboutEditor';
import ServicesEditor from './sections/ServicesEditor';
import ImpactEditor from './sections/ImpactEditor';
import TestimonialsEditor from './sections/TestimonialsEditor';
import GalleryEditor from './sections/GalleryEditor';
import TrustIndicatorsEditor from './sections/TrustIndicatorsEditor';
import VideosEditor from './sections/VideosEditor';
import CTAEditor from './sections/CTAEditor';
import ContactEditor from './sections/ContactEditor';
import PaymentEditor from './sections/PaymentEditor';
import SEOEditor from './sections/SEOEditor';
import ThemeCustomizer from './sections/ThemeCustomizer';
import AIGeneratorModal from './AIGeneratorModal';
import { MicrositeConfig } from '@/types/microsite';

interface MicrositeEditorProps {
  branchId: string;
  brandId: string;
  initialConfig: MicrositeConfig;
  userRole: string;
}

/**
 * MicrositeEditor Component
 *
 * Main editor for microsite configuration
 * Role-based access control for different user types
 */
export default function MicrositeEditor({
  branchId,
  brandId,
  initialConfig,
  userRole,
}: MicrositeEditorProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [config, setConfig] = useState<MicrositeConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Track changes
  useEffect(() => {
    const hasChanged = JSON.stringify(config) !== JSON.stringify(initialConfig);
    setHasChanges(hasChanged);
  }, [config, initialConfig]);

  // Save draft to localStorage
  useEffect(() => {
    if (hasChanges != null) {
      localStorage.setItem(`microsite-draft-${branchId}`, JSON.stringify(config));
    }
  }, [config, branchId, hasChanges]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/branches/${branchId}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ micrositeConfig: config }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save');
      }

      setSaveSuccess(true);
      setHasChanges(false);
      localStorage.removeItem(`microsite-draft-${branchId}`);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    window.open(`/preview/${brandId}/${branchId}`, '_blank');
  };

  const handleAIGenerate = (generatedData: any) => {
    setConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        hero: {
          ...prev.sections.hero,
          title: generatedData.hero.title,
          subtitle: generatedData.hero.subtitle,
        },
        about: {
          ...prev.sections.about,
          content: generatedData.about.content,
        },
        services: {
          ...prev.sections.services,
          items: generatedData.services,
        },
      },
      seoSettings: {
        ...prev.seoSettings,
        title: generatedData.hero.title,
        description: generatedData.about.content.substring(0, 160),
      },
    }));
    setSaveSuccess(true); // Show success message to indicate data was filled
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const updateSection = (sectionKey: string, sectionData: any) => {
    setConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: sectionData,
      },
    }));
  };

  const updateSEO = (seoData: any) => {
    setConfig((prev) => ({
      ...prev,
      seoSettings: seoData,
    }));
  };

  // Determine which sections are enabled
  const enabledSections = {
    profile: true, // Always enabled
    hero: true,
    about: true,
    services: true,
    impact: config.sections.impact?.enabled ?? false,
    testimonials: config.sections.testimonials?.enabled ?? false,
    gallery: true,
    trust: config.sections.trustIndicators?.enabled ?? false,
    videos: true,
    cta: config.sections.cta?.enabled ?? false,
    contact: true,
    payment: true,
    seo: true,
  };

  // Role-based permissions
  const canEditBranding = userRole === 'ADMIN';
  const canEditAdvanced = userRole === 'ADMIN' || userRole === 'EXECUTIVE';

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header with Save/Preview */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Microsite Editor</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Customize your microsite content and appearance
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Unsaved changes
              </span>
            )}

            <button
              onClick={() => setIsAIModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-purple-200 dark:border-purple-900/30 rounded-lg text-sm font-medium text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Magic Fill
            </button>

            <button
              onClick={handlePreview}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {saveError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg text-sm text-green-700 dark:text-green-400">
            Changes saved successfully!
          </div>
        )}
      </div>

      {/* Tabs */}
      <MicrositeEditorTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        enabledSections={enabledSections}
      />

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          {activeTab === 'profile' && (
            <ProfileEditor
              config={config.sections}
              onChange={(data) => updateSection('profile', data)}
              canEditBranding={canEditBranding}
            />
          )}
          {activeTab === 'hero' && (
            <HeroEditor
              config={config.sections.hero || { enabled: true, title: '', subtitle: '', backgroundType: 'gradient' }}
              onChange={(data) => updateSection('hero', data)}
            />
          )}
          {activeTab === 'about' && (
            <AboutEditor
              config={config.sections.about || { enabled: true, content: '' }}
              onChange={(data) => updateSection('about', data)}
            />
          )}
          {activeTab === 'services' && (
            <ServicesEditor
              config={config.sections.services || { enabled: true, items: [] }}
              onChange={(data) => updateSection('services', data)}
            />
          )}
          {activeTab === 'impact' && (
            <ImpactEditor
              config={config.sections.impact}
              onChange={(data) => updateSection('impact', data)}
            />
          )}
          {activeTab === 'testimonials' && (
            <TestimonialsEditor
              config={config.sections.testimonials}
              onChange={(data) => updateSection('testimonials', data)}
            />
          )}
          {activeTab === 'gallery' && (
            <GalleryEditor
              config={config.sections.gallery || { enabled: false, images: [] }}
              onChange={(data) => updateSection('gallery', data)}
            />
          )}
          {activeTab === 'trust' && (
            <TrustIndicatorsEditor
              config={config.sections.trustIndicators}
              onChange={(data) => updateSection('trustIndicators', data)}
            />
          )}
          {activeTab === 'videos' && (
            <VideosEditor
              config={config.sections.videos || { enabled: false, videos: [] }}
              onChange={(data) => updateSection('videos', data)}
            />
          )}
          {activeTab === 'cta' && (
            <CTAEditor
              config={config.sections.cta}
              onChange={(data) => updateSection('cta', data)}
            />
          )}
          {activeTab === 'contact' && (
            <ContactEditor
              config={config.sections.contact || { enabled: true, showMap: false, leadForm: { enabled: true, fields: [] } }}
              onChange={(data) => updateSection('contact', data)}
            />
          )}
          {activeTab === 'payment' && (
            <PaymentEditor
              config={config.sections.payment || { enabled: true }}
              onChange={(data) => updateSection('payment', data)}
            />
          )}
          {activeTab === 'seo' && (
            <SEOEditor
              config={config.seoSettings}
              onChange={updateSEO}
              canEditAdvanced={canEditAdvanced}
            />
          )}
          {activeTab === 'theme' && (
            <ThemeCustomizer
              config={config}
              onChange={(data) => setConfig(data)}
            />
          )}
        </div>
      </div>

      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
        currentName={config.seoSettings.title || 'My Business'}
      />
    </div>
  );
}
