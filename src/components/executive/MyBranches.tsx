'use client';

import { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, ExternalLink, Calendar, CheckCircle, XCircle, Eye } from 'lucide-react';
import MicrositePreviewModal from '@/components/preview/MicrositePreviewModal';

interface Branch {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  onboardedAt: string;
  brand: {
    id: string;
    name: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
  };
}

interface MyBranchesProps {
  executiveId: string;
  onRefresh: () => void;
}

export default function MyBranches({ executiveId, onRefresh }: MyBranchesProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewBranch, setPreviewBranch] = useState<Branch | null>(null);

  useEffect(() => {
    fetchBranches();
  }, [executiveId]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/executives/stats?executiveId=${executiveId}`);
      const result = await response.json();

      if (result.success) {
        setBranches(result.data.recentBranches || []);
      } else {
        throw new Error(result.error || 'Failed to load branches');
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err instanceof Error ? err.message : 'Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading != null) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchBranches}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Branches Yet</h3>
        <p className="text-gray-600 mb-6">
          You haven't onboarded any branches yet. Start by creating your first branch!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Preview Modal */}
      {previewBranch && (
        <MicrositePreviewModal
          isOpen={!!previewBranch}
          onClose={() => setPreviewBranch(null)}
          previewData={{
            brandId: previewBranch.brand.id,
            branchId: previewBranch.id,
            slug: previewBranch.slug,
          }}
          mode="existing"
        />
      )}

      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Branches</h2>
          <p className="text-sm text-gray-600 mt-1">
            {branches.length} {branches.length === 1 ? 'branch' : 'branches'} onboarded
          </p>
        </div>
        <button
          onClick={fetchBranches}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {branch.name}
                  </h3>
                  <p className="text-sm text-gray-600">{branch.brand.name}</p>
                </div>
                <div>
                  {branch.isActive ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                      <XCircle className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p>{branch.address.street}</p>
                  <p>
                    {branch.address.city}, {branch.address.state} {branch.address.zipCode}
                  </p>
                  <p>{branch.address.country}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a
                    href={`tel:${branch.contact.phone}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {branch.contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a
                    href={`mailto:${branch.contact.email}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {branch.contact.email}
                  </a>
                </div>
              </div>

              {/* Onboarded Date */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Onboarded on {formatDate(branch.onboardedAt)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => setPreviewBranch(branch)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Preview</span>
              </button>

              <a
                href={`/microsites/${branch.brand.id}/${branch.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Open Live</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
