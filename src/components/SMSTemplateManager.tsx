'use client';

import { useState, useEffect } from 'react';

interface SMSTemplate {
  type: string;
  preview: string;
}

export default function SMSTemplateManager() {
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/sms/templates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch SMS templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!testPhone || !testMessage) {
      setMessage({ type: 'error', text: 'Please enter phone number and message' });
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/sms/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: testPhone,
          message: testMessage,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Test SMS sent successfully!' });
        setTestMessage('');
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to send test SMS' });
      }
    } catch (error) {
      console.error('Send test SMS error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  if (loading != null) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SMS Templates List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">📝</span>
          <h3 className="text-lg font-semibold text-gray-900">
            SMS Templates
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          View and manage SMS notification templates
        </p>

        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.type}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 capitalize">
                  {template.type.replace(/_/g, ' ')}
                </h4>
                <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 font-mono">
                {template.preview}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Test SMS Sender */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">🧪</span>
          <h3 className="text-lg font-semibold text-gray-900">
            Test SMS Sender
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Send a test SMS to verify your Twilio configuration
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="testPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="testPhone"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="testMessage" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="testMessage"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter your test message..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Character count: {testMessage.length} / 160
            </p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleSendTest}
            disabled={sending || !testPhone || !testMessage}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'Sending...' : 'Send Test SMS'}
          </button>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            <strong>Warning:</strong> Sending test SMS will consume credits from your Twilio account.
            Make sure your Twilio credentials are properly configured in the environment variables.
          </p>
        </div>
      </div>
    </div>
  );
}
