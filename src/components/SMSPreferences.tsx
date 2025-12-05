'use client';

import { useState, useEffect } from 'react';

export default function SMSPreferences() {
  const [phone, setPhone] = useState('');
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/sms-preferences', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPhone(data.phone || '');
        setSmsEnabled(data.smsEnabled || false);
      }
    } catch (error) {
      console.error('Failed to fetch SMS preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    // Validate phone number if SMS is enabled
    if (smsEnabled && !phone) {
      setMessage({ type: 'error', text: 'Please enter a phone number to enable SMS notifications' });
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/sms-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: phone || null,
          smsEnabled,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'SMS preferences saved successfully!' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save preferences. Please try again.' });
      }
    } catch (error) {
      console.error('Save SMS preferences error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading != null) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">📱</span>
        <h3 className="text-lg font-semibold text-gray-900">
          SMS Notification Settings
        </h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Configure your phone number to receive critical alerts via SMS
      </p>

      <div className="space-y-4">
        {/* Phone Number Input */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Use international format (e.g., +1234567890 for US, +919876543210 for India)
          </p>
        </div>

        {/* Enable SMS Toggle */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">🔔</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Enable SMS Notifications</h4>
              <p className="text-xs text-gray-500">
                Receive critical alerts via SMS
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={smsEnabled}
              onChange={(e) => setSmsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* SMS Alert Types */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">SMS alerts are sent for:</h4>
          <ul className="space-y-1 text-xs text-gray-600">
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Payment failures and subscription issues</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>License expiration warnings</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Critical system alerts</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Account security notifications</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save SMS Preferences'}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> SMS notifications are only sent for critical alerts to minimize costs.
          Standard carrier rates may apply. You can disable SMS notifications at any time.
        </p>
      </div>
    </div>
  );
}
