'use client';

import { useState, useEffect } from 'react';

interface CustomDomainSettingsProps {
  brandId: string;
}

export default function CustomDomainSettings({ brandId }: CustomDomainSettingsProps) {
  const [customDomain, setCustomDomain] = useState<string | null>(null);
  const [sslEnabled, setSslEnabled] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCustomDomain();
  }, [brandId]);

  const fetchCustomDomain = async () => {
    try {
      const response = await fetch(`/api/brands/${brandId}/custom-domain`);
      if (response.ok) {
        const data = await response.json();
        setCustomDomain(data.customDomain);
        setSslEnabled(data.sslEnabled);
      }
    } catch (error) {
      console.error('Failed to fetch custom domain:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      setMessage({ type: 'error', text: 'Please enter a domain name' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/brands/${brandId}/custom-domain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: newDomain.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setCustomDomain(data.domain);
        setSslEnabled(data.sslEnabled);
        setNewDomain('');
        setShowInstructions(true);
        setMessage({ type: 'success', text: 'Custom domain configured successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to configure domain' });
      }
    } catch (error) {
      console.error('Add domain error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveDomain = async () => {
    if (!confirm('Are you sure you want to remove the custom domain?')) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/brands/${brandId}/custom-domain`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCustomDomain(null);
        setSslEnabled(false);
        setShowInstructions(false);
        setMessage({ type: 'success', text: 'Custom domain removed successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to remove domain' });
      }
    } catch (error) {
      console.error('Remove domain error:', error);
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
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Domain</h3>
      <p className="text-sm text-gray-600 mb-6">
        Use your own domain for your microsites instead of the default parichay.com domain
      </p>

      {customDomain ? (
        <div className="space-y-4">
          {/* Current Domain */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Current Domain</p>
                <p className="text-lg font-semibold text-blue-600 mt-1">{customDomain}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      sslEnabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {sslEnabled ? '🔒 SSL Enabled' : '⏳ SSL Pending'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleRemoveDomain}
                disabled={saving}
                className="px-4 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Remove
              </button>
            </div>
          </div>

          {/* DNS Instructions */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">DNS Configuration Instructions</span>
              <span className="text-gray-500">{showInstructions ? '▼' : '▶'}</span>
            </button>

            {showInstructions && (
              <div className="px-4 pb-4 space-y-4">
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Step 1: Add DNS Records</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Add the following DNS records to your domain provider:
                  </p>

                  <div className="bg-gray-50 p-4 rounded-md font-mono text-sm space-y-2">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">A Record:</p>
                      <p className="text-gray-900">
                        Type: A<br />
                        Name: @ (or your subdomain)<br />
                        Value: [Your Server IP]<br />
                        TTL: 3600
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-gray-500 text-xs mb-1">CNAME Record (for www):</p>
                      <p className="text-gray-900">
                        Type: CNAME<br />
                        Name: www<br />
                        Value: {customDomain}<br />
                        TTL: 3600
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Step 2: SSL Certificate</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    SSL certificate will be automatically provisioned once DNS records are verified.
                    This process typically takes 5-10 minutes after DNS propagation.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> DNS propagation can take up to 48 hours. Your custom domain
                      will be active once the DNS records are properly configured and verified.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Step 3: Verify Configuration</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    After adding DNS records, you can verify your configuration using:
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <code className="text-sm text-gray-900">
                      nslookup {customDomain}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* URL Structure Info */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Your Microsite URLs</h4>
            <p className="text-sm text-gray-600 mb-2">
              With custom domain, your microsites will be accessible at:
            </p>
            <div className="space-y-1">
              <p className="text-sm font-mono text-blue-600">
                {customDomain}/{'<branch-slug>'}
              </p>
              <p className="text-xs text-gray-500">
                Example: {customDomain}/ahmedabad
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add Domain Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domain Name
            </label>
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your domain without http:// or https://
            </p>
          </div>

          <button
            onClick={handleAddDomain}
            disabled={saving || !newDomain.trim()}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Configuring...' : 'Add Custom Domain'}
          </button>

          {/* Benefits */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Benefits of Custom Domain</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Professional brand image</li>
              <li>✓ Better SEO performance</li>
              <li>✓ Increased trust and credibility</li>
              <li>✓ Consistent brand experience</li>
            </ul>
          </div>
        </div>
      )}

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
    </div>
  );
}
