'use client';

import { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { TrustIndicatorsSection, TrustIndicatorItem } from '@/types/microsite';

interface TrustIndicatorsEditorProps {
  config?: TrustIndicatorsSection;
  onChange: (data: TrustIndicatorsSection) => void;
}

export default function TrustIndicatorsEditor({
  config = { enabled: false, certifications: [], partners: [] },
  onChange
}: TrustIndicatorsEditorProps) {
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const addItem = (type: 'certifications' | 'partners') => {
    const newItem: TrustIndicatorItem = {
      id: `${type}-${Date.now()}`,
      name: '',
      description: '',
    };
    handleChange(type, [...(config[type] || []), newItem]);
  };

  const removeItem = (type: 'certifications' | 'partners', index: number) => {
    const newItems = config[type].filter((_, i) => i !== index);
    handleChange(type, newItems);
  };

  const updateItem = (type: 'certifications' | 'partners', index: number, field: string, value: any) => {
    const newItems = [...config[type]];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange(type, newItems);
  };

  const handleLogoUpload = async (type: 'certifications' | 'partners', index: number, file: File) => {
    setUploadingType(type);
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      updateItem(type, index, 'logo', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload logo');
    } finally {
      setUploadingType(null);
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Trust Indicators Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Display certifications, awards, and partner logos to build credibility
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Trust Indicators Section</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Show or hide this section on your microsite
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      {config.enabled && (
        <>
          {/* Certifications */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Certifications ({config.certifications?.length || 0})
              </h3>
              <button
                onClick={() => addItem('certifications')}
                className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>

            {config.certifications && config.certifications.length > 0 ? (
              <div className="space-y-4">
                {config.certifications.map((cert, index) => (
                  <div key={cert.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateItem('certifications', index, 'name', e.target.value)}
                            placeholder="ISO 9001"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={cert.description || ''}
                            onChange={(e) => updateItem('certifications', index, 'description', e.target.value)}
                            placeholder="Quality Management"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Logo
                        </label>
                        {cert.logo && (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 mb-2">
                            <img src={cert.logo} alt={cert.name} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleLogoUpload('certifications', index, e.target.files[0])}
                          className="hidden"
                          id={`cert-logo-${index}`}
                          disabled={uploadingType === 'certifications' && uploadingIndex === index}
                        />
                        <label
                          htmlFor={`cert-logo-${index}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploadingType === 'certifications' && uploadingIndex === index ? 'Uploading...' : 'Upload Logo'}
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem('certifications', index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No certifications added yet
              </div>
            )}
          </div>

          {/* Partners */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Partners ({config.partners?.length || 0})
              </h3>
              <button
                onClick={() => addItem('partners')}
                className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>

            {config.partners && config.partners.length > 0 ? (
              <div className="space-y-4">
                {config.partners.map((partner, index) => (
                  <div key={partner.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={partner.name}
                            onChange={(e) => updateItem('partners', index, 'name', e.target.value)}
                            placeholder="Partner Company"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={partner.description || ''}
                            onChange={(e) => updateItem('partners', index, 'description', e.target.value)}
                            placeholder="Strategic Partner"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Logo
                        </label>
                        {partner.logo && (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 mb-2">
                            <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleLogoUpload('partners', index, e.target.files[0])}
                          className="hidden"
                          id={`partner-logo-${index}`}
                          disabled={uploadingType === 'partners' && uploadingIndex === index}
                        />
                        <label
                          htmlFor={`partner-logo-${index}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploadingType === 'partners' && uploadingIndex === index ? 'Uploading...' : 'Upload Logo'}
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem('partners', index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No partners added yet
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Trust Indicator Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Use high-quality, transparent PNG logos</li>
              <li>Include only legitimate certifications</li>
              <li>Add well-known partners for credibility</li>
              <li>Keep descriptions brief and clear</li>
              <li>Update regularly as you gain new certifications</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
