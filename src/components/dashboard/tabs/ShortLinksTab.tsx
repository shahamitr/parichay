'use client';

import { useState, useEffect } from 'react';
import { Link2, Copy, Check, ExternalLink, Plus, Trash2, BarChart2 } from 'lucide-react';

interface ShortLink {
  id: string;
  code: string;
  targetUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  branch?: { name: string };
}

interface ShortLinksTabProps {
  brandId?: string | null;
  branchId?: string | null;
}

export default function ShortLinksTab({ brandId, branchId }: ShortLinksTabProps) {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, [brandId, branchId]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (brandId) params.append('brandId', brandId);
      if (branchId) params.append('branchId', branchId);

      const response = await fetch(`/api/short-links?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLinks(data.shortLinks || []);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async (code: string, id: string) => {
    const url = `${window.location.origin}/s/${code}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const createLink = async () => {
    if (!newUrl) return;
    try {
      setCreating(true);
      const response = await fetch('/api/short-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: newUrl,
          brandId,
          branchId,
        }),
      });
      if (response.ok) {
        setNewUrl('');
        setShowForm(false);
        fetchLinks();
      }
    } catch (error) {
      console.error('Error creating link:', error);
    } finally {
      setCreating(false);
    }
  };

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  if (loading != null) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-purple-700">{links.length}</p>
            <p className="text-sm text-purple-600">Total Links</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-700">{totalClicks}</p>
            <p className="text-sm text-blue-600">Total Clicks</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Create Link
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="Enter URL to shorten..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={createLink}
              disabled={creating || !newUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links List */}
      {links.length > 0 ? (
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Link2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                      /s/{link.code}
                    </code>
                    <button
                      onClick={() => copyLink(link.code, link.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">{link.targetUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                    <BarChart2 className="w-4 h-4 text-gray-400" />
                    {link.clicks} clicks
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={link.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No short links yet</p>
          <p className="text-sm text-gray-400 mt-1">Create short links to track clicks</p>
        </div>
      )}
    </div>
  );
}
