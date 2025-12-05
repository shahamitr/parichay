'use client';

import { useState, useEffect } from 'react';
import { QrCode, Download, Share2 } from 'lucide-react';
import Image from 'next/image';

interface QRCodeDisplayProps {
  branchId: string;
  brandId: string;
  branchName: string;
  url: string;
}

export default function QRCodeDisplay({ branchId, brandId, branchName, url }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [branchId]);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/qrcodes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          format: 'dataurl',
          size: 512,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeUrl(data.qrCode);
      } else {
        console.error('Failed to generate QR code:', await response.text());
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${branchName.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Track download
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'QR_DOWNLOAD',
        branchId,
        brandId,
        metadata: { action: 'download_qr' },
      }),
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${branchName} - Digital Card`,
          text: `Check out ${branchName}`,
          url: url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Scan to Connect</h3>
        </div>
        <button
          onClick={() => setShowQR(!showQR)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showQR ? 'Hide' : 'Show'} QR
        </button>
      </div>

      {showQR && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : qrCodeUrl ? (
            <>
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200 flex items-center justify-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>

              <p className="text-sm text-gray-600 text-center">
                Scan this QR code to save contact or share this page
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="font-medium">Download QR</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="font-medium">Share Link</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Unable to generate QR code</p>
              <button
                onClick={generateQRCode}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
