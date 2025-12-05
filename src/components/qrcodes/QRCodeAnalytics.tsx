'use client';

/**
 * QR Code Analytics Component
 * Displays scan statistics and analytics for QR codes
 */

import { useState, useEffect } from 'react';

interface QRCodeScanData {
  qrCodeId: string;
  scanCount: number;
  recentScans: {
    timestamp: string;
    location?: {
      country?: string;
      city?: string;
    };
    userAgent?: string;
  }[];
}

interface QRCodeAnalyticsProps {
  qrCodeId: string;
}

export default function QRCodeAnalytics({ qrCodeId }: QRCodeAnalyticsProps) {
  const [analytics, setAnalytics] = useState<QRCodeScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [qrCodeId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/qrcode/${qrCodeId}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading != null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Scan Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {analytics.scanCount}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Scans</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {analytics.recentScans.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Recent Scans (7d)</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {new Set(
                analytics.recentScans
                  .map((s) => s.location?.country)
                  .filter(Boolean)
              ).size}
            </div>
            <div className="text-sm text-gray-600 mt-1">Countries</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Scans</h3>
        {analytics.recentScans.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No recent scans</p>
        ) : (
          <div className="space-y-3">
            {analytics.recentScans.map((scan, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {scan.location?.city && scan.location?.country
                      ? `${scan.location.city}, ${scan.location.country}`
                      : scan.location?.country || 'Unknown Location'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(scan.timestamp).toLocaleString()}
                  </div>
                </div>
                {scan.userAgent && (
                  <div className="text-xs text-gray-500 max-w-xs truncate">
                    {scan.userAgent}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
