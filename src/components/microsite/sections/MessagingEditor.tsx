'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Phone, Mail, Send, Settings, Users, Clock } from 'lucide-react';

interface MessagingConfig {
  enabled: boolean;
  channels: {
    whatsapp: {
      enabled: boolean;
      number: string;
      welcomeMessage: string;
      businessHours: boolean;
    };
    email: {
      enabled: boolean;
      address: string;
      autoReply: boolean;
      autoReplyMessage: string;
    };
    phone: {
      enabled: boolean;
      number: string;
      displayFormat: string;
    };
    livechat: {
      enabled: boolean;
      welcomeMessage: string;
      offlineMessage: string;
      position: 'bottom-right' | 'bottom-left';
    };
  };
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: {
      [key: string]: {
        open: string;
        close: string;
        closed: boolean;
      };
    };
  };
  autoResponses: {
    enabled: boolean;
    responses: Array<{
      trigger: string;
      response: string;
      active: boolean;
    }>;
  };
}

interface MessagingEditorProps {
  config: MessagingConfig;
  onChange: (config: MessagingConfig) => void;
}

const defaultConfig: MessagingConfig = {
  enabled: false,
  channels: {
    whatsapp: {
      enabled: false,
      number: '',
      welcomeMessage: 'Hi! How can we help you today?',
      businessHours: true,
    },
    email: {
      enabled: false,
      address: '',
      autoReply: false,
      autoReplyMessage: 'Thank you for your message. We will get back to you soon!',
    },
    phone: {
      enabled: false,
      number: '',
      displayFormat: 'button',
    },
    livechat: {
      enabled: false,
      welcomeMessage: 'Welcome! How can we assist you?',
      offlineMessage: 'We are currently offline. Please leave a message.',
      position: 'bottom-right',
    },
  },
  businessHours: {
    enabled: false,
    timezone: 'Asia/Kolkata',
    schedule: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: true },
    },
  },
  autoResponses: {
    enabled: false,
    responses: [
      { trigger: 'pricing', response: 'Please check our pricing page or contact us for a custom quote.', active: true },
      { trigger: 'hours', response: 'We are open Monday to Saturday, 9 AM to 6 PM.', active: true },
      { trigger: 'location', response: 'You can find our address in the contact section below.', active: true },
    ],
  },
};

export default function MessagingEditor({ config, onChange }: MessagingEditorProps) {
  const [localConfig, setLocalConfig] = useState<MessagingConfig>({ ...defaultConfig, ...config });

  useEffect(() => {
    onChange(localConfig);
  }, [localConfig, onChange]);

  const updateChannel = (channel: keyof MessagingConfig['channels'], field: string, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: {
          ...prev.channels[channel],
          [field]: value,
        },
      },
    }));
  };

  const updateBusinessHours = (day: string, field: string, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        schedule: {
          ...prev.businessHours.schedule,
          [day]: {
            ...prev.businessHours.schedule[day],
            [field]: value,
          },
        },
      },
    }));
  };

  const addAutoResponse = () => {
    setLocalConfig(prev => ({
      ...prev,
      autoResponses: {
        ...prev.autoResponses,
        responses: [
          ...prev.autoResponses.responses,
          { trigger: '', response: '', active: true },
        ],
      },
    }));
  };

  const updateAutoResponse = (index: number, field: string, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      autoResponses: {
        ...prev.autoResponses,
        responses: prev.autoResponses.responses.map((response, i) =>
          i === index ? { ...response, [field]: value } : response
        ),
      },
    }));
  };

  const removeAutoResponse = (index: number) => {
    setLocalConfig(prev => ({
      ...prev,
      autoResponses: {
        ...prev.autoResponses,
        responses: prev.autoResponses.responses.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Customer Messaging</h3>
          <p className="text-xs text-gray-400">Enable direct communication with customers</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={localConfig.enabled}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, enabled: e.target.checked }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {localConfig.enabled && (
        <>
          {/* WhatsApp */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                WhatsApp
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.channels.whatsapp.enabled}
                  onChange={(e) => updateChannel('whatsapp', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {localConfig.channels.whatsapp.enabled && (
              <div className="space-y-3 pl-6">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={localConfig.channels.whatsapp.number}
                    onChange={(e) => updateChannel('whatsapp', 'number', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Welcome Message</label>
                  <textarea
                    value={localConfig.channels.whatsapp.welcomeMessage}
                    onChange={(e) => updateChannel('whatsapp', 'welcomeMessage', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                    rows={2}
                    placeholder="Hi! How can we help you today?"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                Email
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.channels.email.enabled}
                  onChange={(e) => updateChannel('email', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {localConfig.channels.email.enabled && (
              <div className="space-y-3 pl-6">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={localConfig.channels.email.address}
                    onChange={(e) => updateChannel('email', 'address', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                    placeholder="contact@yourbusiness.com"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Auto Reply</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localConfig.channels.email.autoReply}
                      onChange={(e) => updateChannel('email', 'autoReply', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {localConfig.channels.email.autoReply && (
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Auto Reply Message</label>
                    <textarea
                      value={localConfig.channels.email.autoReplyMessage}
                      onChange={(e) => updateChannel('email', 'autoReplyMessage', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-500" />
                Phone
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.channels.phone.enabled}
                  onChange={(e) => updateChannel('phone', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {localConfig.channels.phone.enabled && (
              <div className="space-y-3 pl-6">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={localConfig.channels.phone.number}
                    onChange={(e) => updateChannel('phone', 'number', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Display Format</label>
                  <select
                    value={localConfig.channels.phone.displayFormat}
                    onChange={(e) => updateChannel('phone', 'displayFormat', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                  >
                    <option value="button">Call Button</option>
                    <option value="text">Text Link</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Live Chat */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-orange-500" />
                Live Chat
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.channels.livechat.enabled}
                  onChange={(e) => updateChannel('livechat', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {localConfig.channels.livechat.enabled && (
              <div className="space-y-3 pl-6">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Welcome Message</label>
                  <textarea
                    value={localConfig.channels.livechat.welcomeMessage}
                    onChange={(e) => updateChannel('livechat', 'welcomeMessage', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Offline Message</label>
                  <textarea
                    value={localConfig.channels.livechat.offlineMessage}
                    onChange={(e) => updateChannel('livechat', 'offlineMessage', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Position</label>
                  <select
                    value={localConfig.channels.livechat.position}
                    onChange={(e) => updateChannel('livechat', 'position', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Business Hours
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.businessHours.enabled}
                  onChange={(e) => setLocalConfig(prev => ({
                    ...prev,
                    businessHours: { ...prev.businessHours, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {localConfig.businessHours.enabled && (
              <div className="space-y-3 pl-6">
                {Object.entries(localConfig.businessHours.schedule).map(([day, schedule]) => (
                  <div key={day} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-gray-300 capitalize">{day}</div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!schedule.closed}
                        onChange={(e) => updateBusinessHours(day, 'closed', !e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-xs text-gray-400">Open</span>
                    </label>
                    {!schedule.closed && (
                      <>
                        <input
                          type="time"
                          value={schedule.open}
                          onChange={(e) => updatnessHours(day, 'open', e.target.value)}
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-xs"
                        />
                        <span className="text-gray-400">to</span>
                        <input
                          type="time"
                          value={schedule.close}
                          onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-xs"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auto Responses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Auto Responses
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.autoResponses.enabled}
                  onChange={(e) => setLocalConfig(prev => ({
                    ...prev,
                    autoResponses: { ...prev.autoResponses, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {localConfig.autoResponses.enabled && (
              <div className="space-y-3 pl-6">
                {localConfig.autoResponses.responses.map((response, index) => (
                  <div key={index} className="space-y-2 p-3 bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={response.trigger}
                        onChange={(e) => updateAutoResponse(index, 'trigger', e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs mr-2"
                        placeholder="Trigger keyword"
                      />
                      <button
                        onClick={() => removeAutoResponse(index)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={response.response}
                      onChange={(e) => updateAutoResponse(index, 'response', e.target.value)}
                      className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                      rows={2}
                      placeholder="Auto response message"
                    />
                  </div>
                ))}
                <button
                  onClick={addAutoResponse}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Add Response
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}