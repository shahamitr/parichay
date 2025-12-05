'use client';

import { useEffect, useState } from 'react';

interface UsageData {
  usage: {
    currentBranches: number;
    maxBranches: number;
    hasCustomDomain: boolean;
    canAddBranch: boolean;
    percentageUsed: number;
  };
  limits: {
    maxBranches: number;
    customDomain: boolean;
    analytics: boolean;
    qrCodes: boolean;
    leadCapture: boolean;
  };
}

export default function UsageDashboard({ brandId }: { brandId: string }) {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch(`/api/usage?brandId=${brandId}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, [brandId]);

  if (loading != null) {
    return <div className="p-4">Loading usage statistics...</div>;
  }

  if (!data) {
    return <div className="p-4">Failed to load usage data</div>;
  }

  const { usage, limits } = data;
  const isNearLimit = usage.percentageUsed >= 80;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Usage & Limits</h2>

      {/* Branch Usage */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 font-medium">Branches</span>
          <span className="text-sm text-gray-600">
            {usage.currentBranches} / {usage.maxBranches}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              isNearLimit ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(usage.percentageUsed, 100)}%` }}
          />
        </div>
        {isNearLimit && (
          <p className="text-sm text-red-600 mt-2">
            You're approaching your branch limit. Consider upgrading your plan.
          </p>
        )}
      </div>

      {/* Feature Access */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 mb-3">Available Features</h3>

        <FeatureItem
          name="Custom Domain"
          enabled={limits.customDomain}
          active={usage.hasCustomDomain}
        />
        <FeatureItem name="Analytics" enabled={limits.analytics} />
        <FeatureItem name="QR Codes" enabled={limits.qrCodes} />
        <FeatureItem name="Lead Capture" enabled={limits.leadCapture} />
      </div>

      {/* Upgrade Prompt */}
      {!usage.canAddBranch && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium mb-2">
            Branch Limit Reached
          </p>
          <p className="text-sm text-yellow-700 mb-3">
            You've reached your maximum of {usage.maxBranches} branches. Upgrade to add more.
          </p>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition">
            Upgrade Plan
          </button>
        </div>
      )}
    </div>
  );
}

function FeatureItem({
  name,
  enabled,
  active,
}: {
  name: string;
  enabled: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <span className="text-gray-700">{name}</span>
      <div className="flex items-center gap-2">
        {active && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            Active
          </span>
        )}
        <span
          className={`text-sm font-medium ${
            enabled ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          {enabled ? '✓ Enabled' : '✗ Disabled'}
        </span>
      </div>
    </div>
  );
}
