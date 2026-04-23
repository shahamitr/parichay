'use client';

import { useState } from 'react';
import { Briefcase, Plus, Trash2, GripVertical } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  price?: string;
}

interface ServicesEditorProps {
  config: any;
  onChange: (config: any) => void;
}

export default function ServicesEditor({ config, onChange }: ServicesEditorProps) {
  const [localConfig, setLocalConfig] = useState(config || {
    enabled: true,
    title: 'Our Services',
    subtitle: '',
    items: [],
  });

  const handleChange = (field: string, value: any) => {
    const updated = { ...localConfig, [field]: value };
    setLocalConfig(updated);
    onChange(updated);
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: '',
      description: '',
      icon: '',
      price: '',
    };
    handleChange('items', [...(localConfig.items || []), newService]);
  };

  const updateService = (id: string, field: string, value: string) => {
    const updated = (localConfig.items || []).map((item: Service) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    handleChange('items', updated);
  };

  const removeService = (id: string) => {
    const updated = (localConfig.items || []).filter((item: Service) => item.id !== id);
    handleChange('items', updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Briefcase className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Services Section</h3>
            <p className="text-sm text-gray-400">Showcase your services or products</p>
          </div>
        </div>
        <Toggle
          enabled={localConfig.enabled}
          onChange={(enabled) => handleChange('enabled', enabled)}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Section Title</label>
          <input
            type="text"
            value={localConfig.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Our Services"
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
          <input
            type="text"
            value={localConfig.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="What we offer"
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-400">Services</label>
            <button
              type="button"
              onClick={addService}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500/20 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          <div className="space-y-3">
            {(localConfig.items || []).map((service: Service, index: number) => (
              <div
                key={service.id}
                className="bg-gray-800/50 border border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="text-gray-600 cursor-grab mt-2">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateService(service.id, 'title', e.target.value)}
                      placeholder="Service name"
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                    <textarea
                      value={service.description}
                      onChange={(e) => updateService(service.id, 'description', e.target.value)}
                      placeholder="Service description"
                      rows={2}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                    />
                    <input
                      type="text"
                      value={service.price || ''}
                      onChange={(e) => updateService(service.id, 'price', e.target.value)}
                      placeholder="Price (optional)"
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeService(service.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {(localConfig.items || []).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No services added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
