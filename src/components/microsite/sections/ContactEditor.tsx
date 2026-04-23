'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface ContactEditorProps {
  config: any;
  onChange: (config: any) => void;
}

export default function ContactEditor({ config, onChange }: ContactEditorProps) {
  const [localConfig, setLocalConfig] = useState(config || {
    enabled: true,
    title: 'Contact Us',
    phone: '',
    email: '',
    address: '',
    hours: '',
    showMap: false,
    mapUrl: '',
    leadForm: {
      enabled: true,
      fields: ['name', 'email', 'phone', 'message'],
    },
  });

  const handleChange = (field: string, value: any) => {
    const updated = { ...localConfig, [field]: value };
    setLocalConfig(updated);
    onChange(updated);
  };

  const handleLeadFormChange = (field: string, value: any) => {
    const updated = {
      ...localConfig,
      leadForm: { ...localConfig.leadForm, [field]: value },
    };
    setLocalConfig(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Phone className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Contact Section</h3>
            <p className="text-sm text-gray-400">Contact information and lead capture</p>
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
            placeholder="Contact Us"
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </span>
            </label>
            <input
              type="tel"
              value={localConfig.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </span>
            </label>
            <input
              type="email"
              value={localConfig.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@business.com"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </span>
          </label>
          <textarea
            value={localConfig.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Business Street, City, State, PIN"
            rows={2}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Business Hours
            </span>
          </label>
          <input
            type="text"
            value={localConfig.hours || ''}
            onChange={(e) => handleChange('hours', e.target.value)}
            placeholder="Mon-Sat: 9 AM - 6 PM"
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          />
        </div>

        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-white">Lead Capture Form</h4>
              <p className="text-sm text-gray-400">Enable form to collect leads</p>
            </div>
            <Toggle
              enabled={localConfig.leadForm?.enabled ?? false}
              onChange={(enabled) => handleLeadFormChange('enabled', enabled)}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-white">Show Map</h4>
              <p className="text-sm text-gray-400">Display Google Maps embed</p>
            </div>
            <Toggle
              enabled={localConfig.showMap ?? false}
              onChange={(enabled) => handleChange('showMap', enabled)}
            />
          </div>

          {localConfig.showMap && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Google Maps Embed URL</label>
              <input
                type="url"
                value={localConfig.mapUrl || ''}
                onChange={(e) => handleChange('mapUrl', e.target.value)}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
