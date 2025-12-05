'use client';

import { useState, useEffect } from 'react';
import { Link2, Copy, Trash2, ExternalLink, Plus, Calendar, MousePointerClick } from 'lucide-react';

interface ShortLink {
  id: string;
  code: string;
  targetUrl: string;
  shortUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  branchId?: string;
  brandId?: string;
}

interface ShortLinksManagerProps {
  branchId?: string;
  brandId?: string;
}

export default function ShortLinksManager({ branchId, brandId }: ShortLinksManagerProps) {
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    targetUrl: '',
    expiresAt: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchShortLinks();
  }, [branchId, brandId]);

  const fetchShortLinks = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId);
      if (brandId) params.append('brandId', brandId);

      const response = await fetch(`/api/short-links?${params}`);
      if (response.ok) {
        const data = await response.json();
        setShortLinks(data);
      }
    } catch (error) {
      console.error('Error fetching short links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch('/api/short-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: formData.targetUrl,
          branchId,
          brandId,
          expiresAt: formData.expiresAt || undefined,
        }),
      });

      if (response.ok) {
        const newLink = await response.json();
        setShortLinks([newLink, ...shortLinks]);
        setFormData({ targetUrl: '', expiresAt: '' });
        setShowCreateForm(false);
      } else {
        alert('Failed to create short link');
      }
    } catch (error) {
      console.error('Error creating short link:', error);
      alert('Error creating short link');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = (shortUrl: string, code: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this short link?')) return;

    try {
      const response = await fetch(`/api/short-links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShortLinks(shortLinks.filter((link) => link.id !== id));
      } else {
        alert('Failed to delete short link');
      }
    } catch (error) {
      console.error('Error deleting short link:', error);
      alert('Error deleting short link');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-600" />
              Short Links
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage shortened URLs for easy sharing
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Short Link
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target URL *
              </label>
              <input
                type="url"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                placeholder="https://parichay.com/brand/branch"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
             {isCreating ? 'Creating...' : 'Create Short Link'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links List */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading short links...</p>
          </div>
        ) : shortLinks.length === 0 ? (
          <div className="text-center py-12">
            <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No short links yet</p>
            <p className="text-sm text-gray-500">Create your first short link to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shortLinks.map((link) => (
              <div
                key={link.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Short URL */}
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-lg font-mono font-semibold text-blue-600 truncate">
                        {link.shortUrl}
                      </code>
                      <button
                        onClick={() => handleCopy(link.shortUrl, link.code)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedCode === link.code ? (
                          <span className="text-green-600 text-sm font-medium">Copied!</span>
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                    </div>

                    {/* Target URL */}
                    <div className="text-sm text-gray-600 mb-3 truncate">
                      → {link.targetUrl}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MousePointerClick className="w-4 h-4" />
                        <span>{link.clicks} clicks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created {formatDate(link.createdAt)}</span>
                      </div>
                      {link.expiresAt && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Calendar className="w-4 h-4" />
                          <span>Expires {formatDate(link.expiresAt)}</span>
                        </div>
                      )}
                      {!link.isActive && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
