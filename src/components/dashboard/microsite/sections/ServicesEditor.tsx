'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, Upload } from 'lucide-react';
import { ServicesSection, ServiceItem } from '@/types/microsite';

interface ServicesEditorProps {
  config: ServicesSection;
  onChange: (data: ServicesSection) => void;
}

export default function ServicesEditor({ config, onChange }: ServicesEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const addService = () => {
    const newService: ServiceItem = {
      id: `service-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      features: [],
      category: '',
      availability: 'available',
    };
    handleChange('items', [...(config.items || []), newService]);
  };

  const removeService = (index: number) => {
    const newItems = config.items.filter((_, i) => i !== index);
    handleChange('items', newItems);
  };

  const updateService = (index: number, field: string, value: any) => {
    const newItems = [...config.items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('items', newItems);
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'gallery');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      updateService(index, 'image', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...config.items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    handleChange('items', newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Services Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          List your services, prices, and descriptions
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Services Section</h3>
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
          {/* Add Service Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Services ({config.items?.length || 0})
            </h3>
            <button
              onClick={addService}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </button>
          </div>

          {/* Services List */}
          {config.items && config.items.length > 0 ? (
            <div className="space-y-4">
              {config.items.map((service, index) => (
                <div
                  key={service.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 ${draggedIndex === index ? 'opacity-50' : ''
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="cursor-move text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mt-2">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-4">
                      {/* Name & Price */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Service Name *
                          </label>
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => updateService(index, 'name', e.target.value)}
                            placeholder="e.g. Web Design"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price
                          </label>
                          <input
                            type="number"
                            value={service.price}
                            onChange={(e) => updateService(index, 'price', parseFloat(e.target.value))}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          value={service.description}
                          onChange={(e) => updateService(index, 'description', e.target.value)}
                          placeholder="Describe your service..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Service Image
                        </label>
                        <div className="flex items-center gap-4">
                          {service.image && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])}
                              className="hidden"
                              id={`service-image-${index}`}
                              disabled={uploadingIndex === index}
                            />
                            <label
                              htmlFor={`service-image-${index}`}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {uploadingIndex === index ? 'Uploading...' : 'Upload Image'}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeService(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove service"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No services added yet</p>
              <button
                onClick={addService}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Service
              </button>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Service Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Use clear, descriptive names for your services</li>
              <li>Include pricing to qualify leads upfront</li>
              <li>Add high-quality images to showcase your work</li>
              <li>Keep descriptions concise but informative</li>
              <li>Group similar services together</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
