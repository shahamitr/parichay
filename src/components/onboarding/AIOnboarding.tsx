'use client';

import { useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';
import GoogleBusinessImport from '@/components/import/GoogleBusinessImport';
import EditablePreview from '@/components/preview/EditablePreview';
import MicrositePreviewModal from '@/components/preview/MicrositePreviewModal';
import { ExtractedMicrositeData } from '@/lib/google-business-extractor';
import { generateBatchContent, BatchGenerationRequest } from '@/lib/ai-content-generator';

type OnboardingStep = 'import' | 'generate' | 'edit' | 'preview' | 'publish';

interface AIOnboardingProps {
  onComplete: (data: any) => void;
  onCancel?: () => void;
}

export default function AIOnboarding({ onComplete, onCancel }: AIOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('import');
  const [businessData, setBusinessData] = useState<ExtractedMicrositeData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [editedSections, setEditedSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const steps = [
    { id: 'import', label: 'Import Business', description: 'Import from Google' },
    { id: 'generate', label: 'Generate Content', description: 'AI creates content' },
    { id: 'edit', label: 'Review & Edit', description: 'Customize content' },
    { id: 'preview', label: 'Preview', description: 'See your microsite' },
    { id: 'publish', label: 'Publish', description: 'Go live' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  // Step 1: Import from Google Business
  const handleImportComplete = async (data: ExtractedMicrositeData) => {
    setBusinessData(data);
    setCurrentStep('generate');
    await generateAIContent(data);
  };

  // Step 2: Generate AI Content
  const generateAIContent = async (data: ExtractedMicrositeData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/ai/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: data.brandName,
          industry: data.industry,
          location: `${data.address.city}, ${data.address.state}`,
          keywords: data.keywords,
          tone: 'professional',
        } as BatchGenerationRequest),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedContent(result.data);

        // Prepare editable sections
        const sections = [
          {
            id: 'headline',
            type: 'headline' as const,
            label: 'Headline',
            content: result.data.headline[0] || '',
            editable: true,
          },
          {
            id: 'tagline',
            type: 'tagline' as const,
            label: 'Tagline',
            content: result.data.tagline[0] || '',
            editable: true,
          },
          {
            id: 'about',
            type: 'about' as const,
            label: 'About Section',
            content: result.data.about[0] || '',
            editable: true,
          },
          {
            id: 'hero_title',
            type: 'hero_title' as const,
            label: 'Hero Title',
            content: result.data.heroTitle[0] || '',
            editable: true,
          },
          {
            id: 'hero_subtitle',
            type: 'hero_subtitle' as const,
            label: 'Hero Subtitle',
            content: result.data.heroSubtitle[0] || '',
            editable: true,
          },
          {
            id: 'cta',
            type: 'cta' as const,
            label: 'Call to Action',
            content: result.data.ctas[0] || '',
            editable: true,
          },
        ];

        setEditedSections(sections);
        setCurrentStep('edit');
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save edited content
  const handleSaveEdits = (sections: any[]) => {
    setEditedSections(sections);
    setCurrentStep('preview');
    setShowPreview(true);
  };

  // Step 4: Preview
  const handlePreviewClose = () => {
    setShowPreview(false);
  };

  const handleContinueToPublish = () => {
    setShowPreview(false);
    setCurrentStep('publish');
  };

  // Step 5: Publish
  const handlePublish = async () => {
    if (!businessData) return;

    setLoading(true);

    try {
      // Prepare final data
      const finalData = {
        // Business data from Google
        ...businessData,

        // AI-generated content
        content: editedSections.reduce((acc, section) => {
          acc[section.id] = section.content;
          return acc;
        }, {} as Record<string, string>),

        // Microsite configuration
        micrositeConfig: {
          sections: {
            hero: {
              enabled: true,
              title: editedSections.find(s => s.id === 'hero_title')?.content || '',
              subtitle: editedSections.find(s => s.id === 'hero_subtitle')?.content || '',
              backgroundType: 'gradient',
            },
            about: {
              enabled: true,
              content: editedSections.find(s => s.id === 'about')?.content || '',
            },
            services: {
              enabled: true,
              items: [],
            },
            gallery: {
              enabled: true,
              images: businessData.photos,
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
        },
      };

      // Call your API to create the branch/microsite
      onComplete(finalData);
    } catch (error) {
      console.error('Error publishing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isUpcoming = index > currentStepIndex;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col itflex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isCurrent
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={`text-sm font-medium ${
                          isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="mt-8">
          {/* Step 1: Import */}
          {currentStep === 'import' && (
            <GoogleBusinessImport
              onImportComplete={handleImportComplete}
              onCancel={onCancel}
            />
          )}

          {/* Step 2: Generating */}
          {currentStep === 'generate' && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Generating AI Content
              </h3>
              <p className="text-gray-600">
                Our AI is creating professional content for your microsite...
              </p>
              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Analyzing business information</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Loader className="w-4 h-4 animate-spin text-blue-500" />
                  <span>Generating headlines and taglines</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-4 h-4" />
                  <span>Creating about section</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-4 h-4" />
                  <span>Crafting call-to-actions</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Edit */}
          {currentStep === 'edit' && businessData && (
            <EditablePreview
              businessName={businessData.brandName}
              industry={businessData.industry}
              sections={editedSections}
              onSave={handleSaveEdits}
              onCancel={onCancel}
            />
          )}

          {/* Step 4: Preview */}
          {currentStep === 'preview' && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Preview Your Microsite
              </h3>
              <p className="text-gray-600 mb-8">
                Review your microsite in different device views before publishing
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentStep('edit')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Edit
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Preview
                </button>
                <button
                  onClick={handleContinueToPublish}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue to Publish
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Publish */}
          {currentStep === 'publish' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Ready to Publish?
              </h3>
              <p className="text-gray-600 mb-8 text-center">
                Your microsite is ready to go live. Click publish to make it accessible to everyone.
              </p>

              {businessData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h4 className="font-semibold text-blue-900 mb-4">Your Microsite URL:</h4>
                  <code className="block bg-white px-4 py-3 rounded border border-blue-300 text-blue-800">
                    {window.location.origin}/{businessData.slug}
                  </code>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentStep('preview')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Preview
                </button>
                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Publish Microsite</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && businessData && (
        <MicrositePreviewModal
          isOpen={showPreview}
          onClose={handlePreviewClose}
          previewData={{
            tempData: {
              brandName: businessData.brandName,
              branchName: businessData.branchName,
              address: businessData.address,
              contact: businessData.contact,
              micrositeConfig: {
                sections: {
                  hero: {
                    enabled: true,
                    title: editedSections.find(s => s.id === 'hero_title')?.content || '',
                    subtitle: editedSections.find(s => s.id === 'hero_subtitle')?.content || '',
                  },
                  about: {
                    enabled: true,
                    content: editedSections.find(s => s.id === 'about')?.content || '',
                  },
                },
              },
            },
          }}
          mode="preview"
        />
      )}
    </div>
  );
}
