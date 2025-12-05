'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, EyeOff, Key, Copy, Calendar } from 'lucide-react';

interface BranchPrivacySettingsProps {
  branchId: string;
  branchName: string;
  onUpdate?: () => void;
}

export default function BranchPrivacySettings({
  branchId,
  branchName,
  onUpdate,
}: BranchPrivacySettingsProps) {
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [tokenExpiry, setTokenExpiry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage('');

      const response = await fetch(`/api/branches/${branchId}/privacy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visibility,
          accessPassword: password || undefined,
          generateToken: visibility === 'private',
          tokenExpiresAt: tokenExpiry || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }
        setMessage('Privacy settings updated successfully!');
        setPassword(''); // Clear password after saving
        if (onUpdate) onUpdate();
      } else {
        setMessage('Failed to update privacy settings');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToken = () => {
    const baseUrl = window.location.origin;
    const tokenUrl = `${baseUrl}/${branchName}?token=${accessToken}`;
    navigator.clipboard.writeText(tokenUrl);
    alert('Private link copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Privacy Settings
        </h3>
        <p className="text-sm text-gray-600">
          Control who can access this microsite
        </p>
      </div>

      {/* Visibility Mode */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Visibility Mode
        </label>
        <div className="space-y-3">
          {/* Public */}
          <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === 'public'}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Unlock className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Public</span>
              </div>
              <p className="text-sm text-gray-600">
                Anyone can access this microsite. Appears in search results.
              </p>
            </div>
          </label>

          {/* Private */}
          <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === 'private'}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Lock className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-900">Private</span>
              </div>
              <p className="text-sm text-gray-600">
                Requires password or token to access. Not in search results.
              </p>
            </div>
          </label>

          {/* Unlisted */}
          <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="radio"
              name="visibility"
              value="unlisted"
              checked={visibility === 'unlisted'}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <EyeOff className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-900">Unlisted</span>
              </div>
              <p className="text-sm text-gray-600">
                Anyone with the link can access. Not in search results.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Password (only for private) */}
      {visibility === 'private' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a secure password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-600 mt-2">
            Visitors will need this password to access the microsite
          </p>
        </div>
      )}

      {/* Token Expiry (only for private) */}
      {visibility === 'private' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Expiration (Optional)
          </label>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="datetime-local"
              value={tokenExpiry}
              onChange={(e) => setTokenExpiry(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Access token will expire on this date
          </p>
        </div>
      )}

      {/* Access Token Display */}
      {accessToken && visibility === 'private' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-green-900">
              Private Access Link
            </label>
            <button
              onClick={copyToken}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
          </div>
          <div className="bg-white p-3 rounded border border-green-300 break-all text-sm font-mono text-gray-700">
            {window.location.origin}/{branchName}?token={accessToken}
          </div>
          <p className="text-xs text-green-800 mt-2">
            Share this link to grant access without a password
          </p>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-3 rounded-lg text-sm ${
            message.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center space-x-2"
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Save Privacy Settings</span>
          </>
        )}
      </button>
    </div>
  );
}
