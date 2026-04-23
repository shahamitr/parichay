'use client';

import { useState } from 'react';
import { Tag, Plus, Trash2, GripVertical, Upload, Loader2, Calendar } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo' | 'free_shipping' | 'custom';
  discountValue?: number;
  originalPrice?: number;
  discountedPrice?: number;
  code?: string;
  imageUrl?: string;
  validFrom: string;
  validUntil: string;
  termsAndConditions?: string;
  isActive: boolean;
  featured: boolean;
}

interface OffersConfig {
  enabled: boolean;
  offers: Offer[];
}

interface OffersEditorProps {
  config: OffersConfig;
  onChange: (config: OffersConfig) => void;
}

export default function OffersEditor({ config, onChange }: OffersEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const addOffer = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      validFrom: today,
      validUntil: nextMonth,
      isActive: true,
      featured: false,
    };
    handleChange('offers', [...(config.offers || []), newOffer]);
    setExpandedId(newOffer.id);
  };

  const removeOffer = (index: number) => {
    handleChange('offers', config.offers.filter((_, i) => i !== index));
  };

  const updateOffer = (index: number, field: string, value: any) => {
    const newOffers = [...config.offers];
    newOffers[index] = { ...newOffers[index], [field]: value };
    handleChange('offers', newOffers);
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'gallery');
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      updateOffer(index, 'imageUrl', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newOffers = [...config.offers];
    const [dragged] = newOffers.splice(draggedIndex, 1);
    newOffers.splice(index, 0, dragged);
    handleChange('offers', newOffers);
    setDraggedIndex(index);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  const discountTypes = [
    { value: 'percentage', label: 'Percentage Off' },
    { value: 'fixed', label: 'Fixed Amount Off' },
    { value: 'bogo', label: 'Buy One Get One' },
    { value: 'free_shipping', label: 'Free Shipping' },
    { value: 'custom', label: 'Custom Offer' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Tag className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Offers & Promotions</h3>
            <p className="text-sm text-gray-400">Create special offers for your customers</p>
          </div>
        </div>
        <Toggle
          enabled={config.enabled}
          onChange={(enabled) => handleChange('enabled', enabled)}
        />
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Add Offer Button */}
          <div className="flex justify-end">
            <button
              onClick={addOffer}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Offer
            </button>
          </div>

          {/* Offers List */}
          {config.offers && config.offers.length > 0 ? (
            <div className="space-y-4">
              {config.offers.map((offer, index) => (
                <div
                  key={offer.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/30"
                    onClick={() => setExpandedId(expandedId === offer.id ? null : offer.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="cursor-move text-gray-600 hover:text-gray-400" onClick={(e) => e.stopPropagation()}>
                        <GripVertical className="w-4 h-4" />
                      </div>
                      {offer.imageUrl && (
                        <img src={offer.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <div>
                        <p className="text-white font-medium">{offer.title || 'Untitled Offer'}</p>
                        <p className="text-sm text-gray-500">
                          {offer.discountType === 'percentage' && `${offer.discountValue}% off`}
                          {offer.discountType === 'fixed' && `₹${offer.discountValue} off`}
                          {offer.discountType === 'bogo' && 'Buy One Get One'}
                          {offer.discountType === 'free_shipping' && 'Free Shipping'}
                          {offer.discountType === 'custom' && 'Custom Offer'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs ${offer.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeOffer(index); }}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedId === offer.id && (
                    <div className="p-4 pt-0 space-y-4 border-t border-gray-800">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Offer Title</label>
                          <input
                            type="text"
                            value={offer.title}
                            onChange={(e) => updateOffer(index, 'title', e.target.value)}
                            placeholder="e.g. Summer Sale"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Discount Type</label>
                          <select
                            value={offer.discountType}
                            onChange={(e) => updateOffer(index, 'discountType', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                          >
                            {discountTypes.map((type) => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                          value={offer.description}
                          onChange={(e) => updateOffer(index, 'description', e.target.value)}
                          placeholder="Describe the offer..."
                          rows={2}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none"
                        />
                      </div>

                      {(offer.discountType === 'percentage' || offer.discountType === 'fixed') && (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">
                              {offer.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
                            </label>
                            <input
                              type="number"
                              value={offer.discountValue || ''}
                              onChange={(e) => updateOffer(index, 'discountValue', parseFloat(e.target.value) || 0)}
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Original Price</label>
                            <input
                              type="number"
                              value={offer.originalPrice || ''}
                              onChange={(e) => updateOffer(index, 'originalPrice', parseFloat(e.target.value) || 0)}
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Coupon Code</label>
                            <input
                              type="text"
                              value={offer.code || ''}
                              onChange={(e) => updateOffer(index, 'code', e.target.value.toUpperCase())}
                              placeholder="SAVE10"
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Valid From</label>
                          <input
                            type="date"
                            value={offer.validFrom}
                            onChange={(e) => updateOffer(index, 'validFrom', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Valid Until</label>
                          <input
                            type="date"
                            value={offer.validUntil}
                            onChange={(e) => updateOffer(index, 'validUntil', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                          />
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Offer Image</label>
                        <div className="flex items-center gap-4">
                          {offer.imageUrl && (
                            <img src={offer.imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover" />
                          )}
                          <label className="inline-flex items-center px-3 py-2 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 text-sm text-gray-400">
                            {uploadingIndex === index ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])}
                              className="hidden"
                              disabled={uploadingIndex === index}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <Toggle
                            enabled={offer.isActive}
                            onChange={(enabled) => updateOffer(index, 'isActive', enabled)}
                          />
                          <span className="text-sm text-gray-400">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Toggle
                            enabled={offer.featured}
                            onChange={(enabled) => updateOffer(index, 'featured', enabled)}
                          />
                          <span className="text-sm text-gray-400">Featured</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-900/30 border-2 border-dashed border-gray-800 rounded-xl">
              <Tag className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No offers created yet</p>
              <button
                onClick={addOffer}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Your First Offer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
