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
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 border border-neutral-100 dark:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-primary-600 dark:text-primary-500" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Scan to Connect</h3>
        </div>
        <button
          onClick={() => setShowQR(!showQR)}
          className="text-sm text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 font-medium"
        >
          {showQR ? 'Hide' : 'Show'} QR
        </button>
      </div>

      {showQR && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-500"></div>
            </div>
          ) : qrCodeUrl ? (
            <>
              <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                Scan this QR code to save contact or share this page
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="font-medium">Download QR</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="font-medium">Share Link</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              <p>Unable to generate QR code</p>
              <button
                onClick={generateQRCode}
                className="mt-2 text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 font-medium"
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
