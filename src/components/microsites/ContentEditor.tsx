// @ts-nocheck
'use client';

import { useState } from 'react';
import { MicrositeConfig, ServiceItem } from '@/types/microsite';
import { Branch } from '@/generated/prisma';
import FileUpload from '../ui/FileUpload';
import RichTextEditor from '../ui/RichTextEditor';
import ImageUploadWithPreview from '../ui/ImageUploadWithPreview';

interface ContentEditorProps {
  config: MicrositeConfig;
  editingSection: keyof MicrositeConfig['sections'] | null;
  onSectionUpdate: (
    sectionKey: keyof MicrositeConfig['sections'],
    updates: any
  ) => void;
  onBackToSections: () => void;
  branchData?: Branch;
}

export default function ContentEditor({
  config,
  editingSection,
  onSectionUpdate,
  onBackToSections,
  branchData,
}: ContentEditorProps) {
  if (!editingSection) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Select a section to edit its content</p>
      </div>
    );
  }

  const sectionConfig = config.sections[editingSection];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onBackToSections}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Sections
        </button>
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          Edit {editingSection} Section
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {editingSection === 'hero' && (
          <HeroEditor
            config={sectionConfig}
            onUpdate={(updates) => onSectionUpdate('hero', updates)}
          />
        )}

        {editingSection === 'about' && (
          <AboutEditor
            config={sectionConfig}
            onUpdate={(updates) => onSectionUpdate('about', updates)}
          />
        )}

        {editingSection === 'services' && (
          <ServicesEditor
            config={sectionConfig}
            onUpdate={(updates) => onSectionUpdate('services', updates)}
          />
        )}

        {editingSection === 'gallery' && (
          <GalleryEditor
            config={sectionConfig}
            onUpdate={(updates) => onSectionUpdate('gallery', updates)}
          />
        )}

        {editingSection === 'contact' && (
          <ContactEditor
            config={sectionConfig}
            onUpdate={(updates) => onSectionUpdate('contact', updates)}
            branchData={branchData}
          />
        )}
      </div>
    </div>
  );
}

// Hero Section Editor
function HeroEditor({ config, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter hero title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle
        </label>
        <textarea
          value={config.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter hero subtitle"
        />
      </div>

      <ImageUploadWithPreview
        value={config.backgroundImage}
        onChange={(url) => onUpdate({ backgroundImage: url })}
        onRemove={() => onUpdate({ backgroundImage: undefined })}
        label="Background Image"
      />
    </div>
  );
}

// About Section Editor
function AboutEditor({ config, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          About Content
        </label>
        <RichTextEditor
          value={config.content}
          onChange={(content) => onUpdate({ content })}
          placeholder="Tell your customers about your business..."
          minHeight="300px"
        />
        <p className="text-xs text-gray-500 mt-2">
          Describe your business, mission, values, and what makes you unique. Use the toolbar to format your text.
        </p>
      </div>
    </div>
  );
}

// Services Section Editor
function ServicesEditor({ config, onUpdate }: any) {
  const [items, setItems] = useState<ServiceItem[]>(config.items || []);

  const addService = () => {
    const newService: ServiceItem = {
      id: `service-${Date.now()}`,
      name: '',
      description: '',
    };
    const updatedItems = [...items, newService];
    setItems(updatedItems);
    onUpdate({ items: updatedItems });
  };

  const updateService = (index: number, updates: Partial<ServiceItem>) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    setItems(updatedItems);
    onUpdate({ items: updatedItems });
  };

  const removeService = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    onUpdate({ items: updatedItems });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Services/Products</h4>
        <button
          onClick={addService}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Service
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No services added yet. Click "Add Service" to get started.</p>
        </div>
      )}

      {items.map((item, index) => (
        <div key={item.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Service {index + 1}
            </span>
            <button
              onClick={() => removeService(index)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateService(index, { name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Service name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={item.description}
              onChange={(e) => updateService(index, { description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Service description"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Price (optional)
            </label>
            <input
              type="number"
              value={item.price || ''}
              onChange={(e) =>
                updateService(index, { price: parseFloat(e.target.value) || undefined })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <ImageUploadWithPreview
            value={item.image}
            onChange={(url) => updateService(index, { image: url })}
            onRemove={() => updateService(index, { image: undefined })}
            label="Service Image"
          />
        </div>
      ))}
    </div>
  );
}

// Gallery Section Editor
function GalleryEditor({ config, onUpdate }: any) {
  const [images, setImages] = useState<string[]>(config.images || []);

  const addImage = (url: string) => {
    const updatedImages = [...images, url];
    setImages(updatedImages);
    onUpdate({ images: updatedImages });
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onUpdate({ images: updatedImages });
  };

  return (
    <div className="space-y-4">
      <ImageUploadWithPreview
        onChange={addImage}
        label="Add Image to Gallery"
      />

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No images added yet. Upload images to create your gallery.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Gallery ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              Image {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Contact Section Editor
function ContactEditor({ config, onUpdate, branchData }: any) {
  const [fields, setFields] = useState<string[]>(config.leadForm?.fields || []);
  const availableFields = ['name', 'email', 'phone', 'company', 'message'];

  const toggleField = (field: string) => {
    const updatedFields = fields.includes(field)
      ? fields.filter((f) => f !== field)
      : [...fields, field];
    setFields(updatedFields);
    onUpdate({
      leadForm: {
        ...config.leadForm,
        fields: updatedFields,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.showMap}
            onChange={(e) => onUpdate({ showMap: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Show Google Maps
          </span>
        </label>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Lead Capture Form</h4>

        <div>
          <label className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              checked={config.leadForm?.enabled}
              onChange={(e) =>
                onUpdate({
                  leadForm: {
                    ...config.leadForm,
                    enabled: e.target.checked,
                  },
                })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Enable Lead Form
            </span>
          </label>

          {config.leadForm?.enabled && (
            <div className="ml-6 space-y-2">
              <p className="text-xs text-gray-600 mb-2">Select form fields:</p>
              {availableFields.map((field) => (
                <label key={field} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={fields.includes(field)}
                    onChange={() => toggleField(field)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {field}
                    {['name', 'email'].includes(field) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {branchData && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Contact Information
          </h4>
          <p className="text-xs text-gray-500">
            Contact details are managed in branch settings. Leads will be routed to:
          </p>
          <ul className="mt-2 text-xs text-gray-600 space-y-1">
            {(branchData.contact as any)?.email && (
              <li>• Email: {(branchData.contact as any).email}</li>
            )}
            {(branchData.contact as any)?.whatsapp && (
              <li>• WhatsApp: {(branchData.contact as any).whatsapp}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
