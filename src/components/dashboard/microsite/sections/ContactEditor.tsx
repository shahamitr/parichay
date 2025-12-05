'use client';

import { ContactSection } from '@/types/microsite';

interface ContactEditorProps {
  config: ContactSection;
  onChange: (data: ContactSection) => void;
}

export default function ContactEditor({ config, onChange }: ContactEditorProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleLeadFormChange = (field: string, value: any) => {
    onChange({
      ...config,
      leadForm: {
        ...config.leadForm,
        [field]: value,
      },
    });
  };

  const toggleField = (field: string) => {
    const currentFields = config.leadForm?.fields || [];
    const newFields = currentFields.includes(field)
      ? currentFields.filter(f => f !== field)
      : [...currentFields, field];
    handleLeadFormChange('fields', newFields);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Configure contact forms, maps, and appointment booking
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Contact Section</h3>
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
          {/* Show Map Toggle */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Show Google Map</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Display your business location on a map
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.showMap}
                onChange={(e) => handleChange('showMap', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Lead Form Configuration */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Form</h3>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Lead Form</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Allow visitors to contact you
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.leadForm?.enabled ?? true}
                  onChange={(e) => handleLeadFormChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {config.leadForm?.enabled && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Form Fields
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['name', 'email', 'phone', 'company', 'message', 'subject'].map((field) => (
                    <label
                      key={field}
                      className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={config.leadForm?.fields?.includes(field) ?? false}
                        onChange={() => toggleField(field)}
                        className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Appointment Booking */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appointment Booking</h3>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Appointment Booking</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Let visitors book appointments
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.appointmentBooking?.enabled ?? false}
                  onChange={(e) => handleChange('appointmentBooking', {
                    ...config.appointmentBooking,
                    enabled: e.target.checked,
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {config.appointmentBooking?.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Booking Provider
                  </label>
                  <select
                    value={config.appointmentBooking?.provider || 'calendly'}
                    onChange={(e) => handleChange('appointmentBooking', {
                      ...config.appointmentBooking,
                      provider: e.target.value,
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="calendly">Calendly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {config.appointmentBooking?.provider === 'calendly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Calendly URL
                    </label>
                    <input
                      type="url"
                      value={config.appointmentBooking?.calendlyUrl || ''}
                      onChange={(e) => handleChange('appointmentBooking', {
                        ...config.appointmentBooking,
                        calendlyUrl: e.target.value,
                      })}
                      placeholder="https://calendly.com/your-link"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Chat */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Chat</h3>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Live Chat</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add live chat widget to your microsite
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.liveChatEnabled ?? false}
                  onChange={(e) => handleChange('liveChatEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {config.liveChatEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chat Provider
                  </label>
                  <select
                    value={config.liveChatProvider || 'tawk'}
                    onChange={(e) => handleChange('liveChatProvider', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="tawk">Tawk.to</option>
                    <option value="intercom">Intercom</option>
                    <option value="crisp">Crisp</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Widget ID
                  </label>
                  <input
                    type="text"
                    value={config.liveChatConfig?.widgetId || ''}
                    onChange={(e) => handleChange('liveChatConfig', {
                      ...config.liveChatConfig,
                      widgetId: e.target.value,
                    })}
                    placeholder="Your widget ID"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Contact Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Keep form fields minimal for better conversion</li>
              <li>Enable map if you have a physical location</li>
              <li>Use appointment booking for service businesses</li>
              <li>Live chat can increase engagement by 40%</li>
              <li>Test your contact form regularly</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
