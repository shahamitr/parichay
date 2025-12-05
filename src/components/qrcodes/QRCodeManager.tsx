'use client';

/**
 * QR Code Manager Component
 * Displays and manages QR codes for branches
 */

import { useState, useEffect } from 'react';

interface QRCode {
  id: string;
  url: string;
  qrData: string;
  format: string;
  scanCount: number;
  createdAt: string;
  branch?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface QRCodeManagerProps {
  branchId?: string;
  brandId?: string;
}

export default function QRCodeManager({ branchId, brandId }: QRCodeManagerProps) {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'svg'>('png');

  useEffect(() => {
    fetchQRCodes();
  }, [branchId, brandId]);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId);
      if (brandId) params.append('brandId', brandId);

      const response = await fetch(`/api/qrcodes?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch QR codes');

      const data = await response.json();
      setQrCodes(data.qrCodes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      setGenerating(true);
      setError(null);

      const response = await fetch('/api/qrcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId,
          brandId,
          format: selectedFormat,
          size: 512,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate QR code');
      }

      await fetchQRCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
    } finally {
      setGenerating(false);
    }
  };

  const downloadQRCode = async (qrCodeId: string, format: 'png' | 'svg') => {
    try {
      const response = await fetch(`/api/qrcodes/${qrCodeId}/download?format=${format}`);
      if (!response.ok) throw new Error('Failed to download QR code');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download QR code');
    }
  };

  const deleteQRCode = async (qrCodeId: string) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return;

    try {
      const response = await fetch(`/api/qrcodes/${qrCodeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete QR code');

      await fetchQRCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete QR code');
    }
  };

  if (loading != null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading QR codes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">QR Codes</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as 'png' | 'svg')}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="png">PNG</option>
            <option value="svg">SVG</option>
          </select>
          <button
            onClick={generateQRCode}
            disabled={generating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {qrCodes.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No QR codes generated yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Click &quot;Generate QR Code&quot; to create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qrCode) => (
            <div
              key={qrCode.id}
              className="border border-gray-200 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-center bg-white p-4 rounded">
                <img
                  src={qrCode.qrData}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Entity:</span>{' '}
                  {qrCode.branch?.name || qrCode.brand?.name}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Format:</span> {qrCode.format}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Scans:</span> {qrCode.scanCount}
                </div>
                <div className="text-sm text-gray-500">
                  Created: {new Date(qrCode.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadQRCode(qrCode.id, 'png')}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  PNG
                </button>
                <button
                  onClick={() => downloadQRCode(qrCode.id, 'svg')}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  SVG
                </button>
                <button
                  onClick={() => deleteQRCode(qrCode.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
