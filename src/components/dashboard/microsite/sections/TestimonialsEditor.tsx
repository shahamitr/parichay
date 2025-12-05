'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, Upload, Star } from 'lucide-react';
import { TestimonialsSection, TestimonialItem } from '@/types/microsite';

interface TestimonialsEditorProps {
  config?: TestimonialsSection;
  onChange: (data: TestimonialsSection) => void;
}

export default function TestimonialsEditor({ config = { enabled: false, items: [] }, onChange }: TestimonialsEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const addTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: `testimonial-${Date.now()}`,
      name: '',
      role: '',
      content: '',
      rating: 5,
    };
    handleChange('items', [...(config.items || []), newTestimonial]);
  };

  const removeTestimonial = (index: number) => {
    const newItems = config.items.filter((_, i) => i !== index);
    handleChange('items', newItems);
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const newItems = [...config.items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('items', newItems);
  };

  const handlePhotoUpload = async (index: number, file: File) => {
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
      updateTestimonial(index, 'photo', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo');
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Testimonials Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Build trust with customer reviews and testimonials
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Testimonials Section</h3>
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
          {/* Add Testimonial Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Testimonials ({config.items?.length || 0})
            </h3>
            <button
              onClick={addTestimonial}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </button>
          </div>

          {/* Testimonials List */}
          {config.items && config.items.length > 0 ? (
            <div className="space-y-4">
              {config.items.map((testimonial, index) => (
                <div
                  key={testimonial.id}
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
                      {/* Name & Role */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={testimonial.name}
                            onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Role/Company
                          </label>
                          <input
                            type="text"
                            value={testimonial.role}
                            onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                            placeholder="CEO, Company Name"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Testimonial *
                        </label>
                        <textarea
                          value={testimonial.content}
                          onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                          placeholder="Share what the customer said..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>

                      {/* Photo & Rating */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Photo Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Photo
                          </label>
                          {testimonial.photo && (
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 mb-2">
                              <img
                                src={testimonial.photo}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handlePhotoUpload(index, e.target.files[0])}
                            className="hidden"
                            id={`testimonial-photo-${index}`}
                            disabled={uploadingIndex === index}
                          />
                          <label
                            htmlFor={`testimonial-photo-${index}`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingIndex === index ? 'Uploading...' : 'Upload Photo'}
                          </label>
                        </div>

                        {/* Rating */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Rating
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => updateTestimonial(index, 'rating', star)}
                                className="p-1"
                              >
                                <Star
                                  className={`w-6 h-6 ${star <= testimonial.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeTestimonial(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove testimonial"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No testimonials added yet</p>
              <button
                onClick={addTestimonial}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Testimonial
              </button>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Testimonial Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Use real customer testimonials with permission</li>
              <li>Include photos for authenticity</li>
              <li>Keep testimonials concise (2-3 sentences)</li>
              <li>Highlight specific benefits or results</li>
              <li>Mix different types of customers</li>
              <li>Update regularly with fresh testimonials</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
