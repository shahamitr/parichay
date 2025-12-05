'use client';

import { useState, useEffect } from 'react';
import { Link2, Copy, Trash2, Plus, ExternalLink, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ShortLink {
  id: string;
  code: string;
  shortUrl: string;
  targetUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export default function ShortLinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLink, setNewLink] = useState({ targetUrl: '', expiresAt: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/short-links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLink = async () => {
    try {
      setIsCreating(true);
      const response = await fetch('/api/short-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      });

      if (response.ok) {
        await fetchLinks();
        setShowCreateModal(false);
        setNewLink({ targetUrl: '', expiresAt: '' });
      }
    } catch (error) {
      console.error('Error creating link:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this short link?')) return;

    try {
      const response = await fetch(`/api/short-links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchLinks();
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Short Links</h1>
            <p className="text-gray-600 mt-1">
              Create and manage short URLs for your microsites
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Short Link</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Links</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{links.length}</p>
            </div>
            <Link2 className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {links.reduce((sum, link) => sum + link.clicks, 0)}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Links</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {links.filter((l) => l.isActive).length}
              </p>
            </div>
            <ExternalLink className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Links List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Short Links</h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading links...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="p-12 text-center">
            <Link2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No short links yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first short link to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Short Link
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {links.map((link) => (
              <div key={link.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {link.shortUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(link.shortUrl)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                      {!link.isActive && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Inactive
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2 break-all">
                      → {link.targetUrl}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{link.clicks} clicks</span>
                      </span>
                      <span>
                        Created {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                      {link.expiresAt && (
                        <span className="text-orange-600">
                          Expires {new Date(link.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteLink(link.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete link"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Create Short Link
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target URL *
                </label>
                <input
                  type="url"
                  value={newLink.targetUrl}
                  onChange={(e) =>
                    setNewLink({ ...newLink, targetUrl: e.target.value })
                  }
                  placeholder="https://parichay.com/brand/branch"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={newLink.expiresAt}
                  onChange={(e) =>
                    setNewLink({ ...newLink, expiresAt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createLink}
                disabled={!newLink.targetUrl || isCreating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? 'Creating...' : 'Create Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
