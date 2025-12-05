'use client';

import { useState, useEffect } from 'react';
import { QrCode, Download, Plus, Trash2, Eye, Copy, Check } from 'lucide-react';

interface QRCode {
  id: string;
  url: string;
  qrData: string;
  format: string;
  scanCount: number;
  createdAt: string;
  branch?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; slug: string };
}

interface QRCodesTabProps {
  brandId?: string | null;
  branchId?: string | null;
}

export default function QRCodesTab({ brandId, branchId }: QRCodesTabProps) {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchQRCodes();
  }, [brandId, branchId]);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (brandId) params.append('brandId', brandId);
      if (branchId) params.append('branchId', branchId);

      const response = await fetch(`/api/qrcodes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setQrCodes(data.qrCodes || []);
      }
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    if (!branchId && !brandId) return;
    try {
      setGenerating(true);
      const response = await fetch('/api/qrcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId,
          brandId: branchId ? undefined : brandId,
          format: 'png',
          size: 512,
        }),
      });
      if (response.ok) {
        fetchQRCodes();
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadQRCode = (qrCode: QRCode) => {
    const link = document.createElement('a');
    link.href = qrCode.qrData;
    link.download = `qrcode-${qrCode.branch?.slug || qrCode.brand?.slug || 'download'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyUrl = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0);

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
            <p className="text-2xl font-bold text-purple-700">{qrCodes.length}</p>
            <p className="text-sm text-purple-600">QR Codes</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-700">{totalScans}</p>
            <p className="text-sm text-blue-600">Total Scans</p>
          </div>
        </div>
        <button
          onClick={generateQRCode}
          disabled={generating || (!branchId && !brandId)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {generating ? 'Generating...' : 'Generate QR'}
        </button>
      </div>

      {/* QR Codes Grid */}
      {qrCodes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qrCode) => (
            <div
              key={qrCode.id}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <img
                    src={qrCode.qrData}
                    alt="QR Code"
                    className="w-40 h-40 object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {qrCode.branch?.name || qrCode.brand?.name || 'QR Code'}
                  </span>
                  <span className="text-sm text-gray-500">{qrCode.format}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{qrCode.scanCount} scans</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={qrCode.url}
                    readOnly
                    className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1 truncate"
                  />
                  <button
                    onClick={() => copyUrl(qrCode.url, qrCode.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {copiedId === qrCode.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => downloadQRCode(qrCode)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No QR codes generated yet</p>
          <p className="text-sm text-gray-400 mt-1">Generate QR codes for your branches</p>
        </div>
      )}
    </div>
  );
}
