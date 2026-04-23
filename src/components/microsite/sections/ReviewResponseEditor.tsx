'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, AlertCircle, ExternalLink, Settings } from 'lucide-react';

interface ReviewResponseConfig {
  enabled: boolean;
  autoResponse: {
    enabled: boolean;
    positiveTemplate: string;
    negativeTemplate: string;
    neutralTemplate: string;
  };
  reviewSources: {
    google: { enabled: boolean; businessId?: string };
    facebook: { enabled: boolean; pageId?: string };
    yelp: { enabled: boolean; businessId?: string };
    justdial: { enabled: boolean; businessId?: string };
    internal: { enabled: boolean };
  };
  responseTemplates: Array<{
    id: string;
    name: string;
    template: string;
    category: 'positive' | 'negative' | 'neutral';
    active: boolean;
  }>;
  notifications: {
    enabled: boolean;
    email: boolean;
    whatsapp: boolean;
    threshold: number; // Minimum rating to trigger notification
  };
  publicDisplay: {
    enabled: boolean;
    showResponses: boolean;
    moderateBeforePublish: boolean;
  };
}

interface ReviewResponseEditorProps {
  config: ReviewResponseConfig;
  onChange: (config: ReviewResponseConfig) => void;
  branchId: string;
}

const defaultConfig: ReviewResponseConfig = {
  enabled: false,
  autoResponse: {
    enabled: false,
    positiveTemplate: 'Thank you so much for your wonderful review! We truly appreciate your feedback and are delighted that you had a great experience with us.',
    negativeTemplate: 'Thank you for your feedback. We take all reviews seriously and would love to discuss this further. Please contact us directly so we can make things right.',
    neutralTemplate: 'Thank you for taking the time to review us. Your feedback helps us improve our services.',
  },
  reviewSources: {
    google: { enabled: false },
    facebook: { enabled: false },
    yelp: { enabled: false },
    justdial: { enabled: false },
    internal: { enabled: true },
  },
  responseTemplates: [
    {
      id: '1',
      name: 'Positive - Standard',
      template: 'Thank you for the amazing review! We\'re thrilled you had a great experience.',
      category: 'positive',
      active: true,
    },
    {
      id: '2',
      name: 'Negative - Apologetic',
      template: 'We sincerely apologize for not meeting your expectations. Please contact us directly so we can resolve this issue.',
      category: 'negative',
      active: true,
    },
    {
      id: '3',
      name: 'Neutral - Appreciative',
      template: 'Thank you for your honest feedback. We value all input from our customers.',
      category: 'neutral',
      active: true,
    },
  ],
  notifications: {
    enabled: false,
    email: true,
    whatsapp: false,
    threshold: 3,
  },
  publicDisplay: {
    enabled: true,
    showResponses: true,
    moderateBeforePublish: false,
  },
};

export default function ReviewResponseEditor({ config, onChange, branchId }: ReviewResponseEditorProps) {
  const [localConfig, setLocalConfig] = useState<ReviewResponseConfig>({ ...defaultConfig, ...config });
  const [activeTab, setActiveTab] = useState<'settings' | 'templates' | 'sources'>('settings');

  useEffect(() => {
    onChange(localConfig);
  }, [localConfig, onChange]);

  const updateAutoResponse = (field: string, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      autoResponse: { ...prev.autoResponse, [field]: value },
    }));
  };

  const updateReviewSource = (source: keyof ReviewResponseConfig['reviewSources'], field: string, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      reviewSources: {
        ...prev.reviewSources,
        [source]: { ...prev.reviewSources[source], [field]: value },
      },
    }));
  };

  const addTemplate = () => {
    const newTemplate = {
      id: Date.now().toString(),
      name: 'New Template',
      template: '',
      category: 'positive' as const,
      active: true,
    };
    setLocalConfig(prev => ({
      ...prev,
      responseTemplates: [...prev.responseTemplates, newTemplate],
    }));
  };

  const updateTemplate = (id: string, field: string, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      responseTemplates: prev.responseTemplates.map(template =>
        template.id === id ? { ...template, [field]: value } : template
      ),
    }));
  };

  const removeTemplate = (id: string) => {
    setLocalConfig(prev => ({
      ...prev,
      responseTemplates: prev.responseTemplates.filter(template => template.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Review Response Management</h3>
          <p className="text-xs text-gray-400">Manage and respond to customer reviews</p>
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
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {[
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'templates', label: 'Templates', icon: MessageSquare },
              { id: 'sources', label: 'Sources', icon: ExternalLink },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  activeTab === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Auto Response */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">Auto Response</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localConfig.autoResponse.enabled}
                      onChange={(e) => updateAutoResponse('enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {localConfig.autoResponse.enabled && (
                  <div className="space-y-4 pl-4">
                    <div>
                      <label className="block text-xs text-gray-300 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Positive Reviews (4-5 stars)
                      </label>
                      <textarea
                        value={localConfig.autoResponse.positiveTemplate}
                        onChange={(e) => updateAutoResponse('positiveTemplate', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Negative Reviews (1-2 stars)
                      </label>
                      <textarea
                        value={localConfig.autoResponse.negativeTemplate}
                        onChange={(e) => updateAutoResponse('negativeTemplate', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-2 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-blue-500" />
                        Neutral Reviews (3 stars)
                      </label>
                      <textarea
                        value={localConfig.autoResponse.neutralTemplate}
                        onChange={(e) => updateAutoResponse('neutralTemplate', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">Notifications</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localConfig.notifications.enabled}
                      onChange={(e) => setLocalConfig(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, enabled: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {localConfig.notifications.enabled && (
                  <div className="space-y-3 pl-4">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Alert Threshold</label>
                      <select
                        value={localConfig.notifications.threshold}
                        onChange={(e) => setLocalConfig(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, threshold: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                      >
                        <option value={1}>1 star and below</option>
                        <option value={2}>2 stars and below</option>
                        <option value={3}>3 stars and below</option>
                        <option value={4}>4 stars and below</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">Get notified for reviews at or below this rating</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Email Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localConfig.notifications.email}
                            onChange={(e) => setLocalConfig(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, email: e.target.checked }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">WhatsApp Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localConfig.notifications.whatsapp}
                            onChange={(e) => setLocalConfig(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, whatsapp: e.target.checked }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Public Display */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white">Public Display</h4>

                <div className="space-y-3 pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Show Reviews on Website</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.publicDisplay.enabled}
                        onChange={(e) => setLocalConfig(prev => ({
            ...prev,
                          publicDisplay: { ...prev.publicDisplay, enabled: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Show Response Messages</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.publicDisplay.showResponses}
                        onChange={(e) => setLocalConfig(prev => ({
                          ...prev,
                          publicDisplay: { ...prev.publicDisplay, showResponses: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Moderate Before Publishing</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.publicDisplay.moderateBeforePublish}
                        onChange={(e) => setLocalConfig(prev => ({
                          ...prev,
                          publicDisplay: { ...prev.publicDisplay, moderateBeforePublish: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">Response Templates</h4>
                <button
                  onClick={addTemplate}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Add Template
                </button>
              </div>

              <div className="space-y-3">
                {localConfig.responseTemplates.map((template) => (
                  <div key={template.id} className="p-4 bg-gray-800 rounded-md space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={template.name}
                        onChange={(e) => updateTemplate(template.id, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm mr-3"
                      />
                      <select
                        value={template.category}
                        onChange={(e) => updateTemplate(template.id, 'category', e.target.value)}
                        className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs mr-2"
                      >
                        <option value="positive">Positive</option>
                        <option value="negative">Negative</option>
                        <option value="neutral">Neutral</option>
                      </select>
                      <button
                        onClick={() => removeTemplate(template.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={template.template}
                      onChange={(e) => updateTemplate(template.id, 'template', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      rows={3}
                      placeholder="Response template..."
                    />
                    <div className="flex items-center">
                      <label className="flex items-center text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={template.active}
                          onChange={(e) => updateTemplate(template.id, 'active', e.target.checked)}
                          className="mr-2"
                        />
                        Active
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources Tab */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">Review Sources</h4>

              {Object.entries(localConfig.reviewSources).map(([source, config]) => (
                <div key={source} className="p-4 bg-gray-800 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-white capitalize">{source}</h5>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => updateReviewSource(source as any, 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {config.enabled && source !== 'internal' && (
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">
                        {source === 'google' ? 'Business ID' :
                         source === 'facebook' ? 'Page ID' :
                         source === 'yelp' ? 'Business ID' :
                         'Business ID'}
                      </label>
                      <input
                        type="text"
                        value={(config as any).businessId || (config as any).pageId || ''}
                        onChange={(e) => updateReviewSource(
                          source as any,
                          source === 'facebook' ? 'pageId' : 'businessId',
                          e.target.value
                        )}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        placeholder={`Enter your ${source} ${source === 'facebook' ? 'page' : 'business'} ID`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}