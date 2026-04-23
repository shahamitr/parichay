'use client';

import { useState } from 'react';
import {
  Download,
  FileText,
  Image as ImageIcon,
  CreditCard,
  X,
  Check,
  Loader2,
  Share2,
} from 'lucide-react';

interface BusinessCardDownloadProps {
  branchId: string;
  branchName: string;
  brandName: string;
  isOpen: boolean;
  onClose: () => void;
  primaryColor?: string;
}

type DownloadFormat = 'vcard' | 'pdf' | 'image';

interface FormatOption {
  id: DownloadFormat;
  name: string;
  description: string;
  icon: typeof FileText;
  extension: string;
}

const formatOptions: FormatOption[] = [
  {
    id: 'vcard',
    name: 'Contact Card',
    description: 'Save to phone contacts (.vcf)',
    icon: CreditCard,
    extension: 'vcf',
  },
  {
    id: 'pdf',
    name: 'PDF Card',
    description: 'Professional PDF business card',
    icon: FileText,
    extension: 'pdf',
  },
  {
    id: 'image',
    name: 'Image Card',
    description: 'PNG image for sharing',
    icon: ImageIcon,
    extension: 'png',
  },
];

export default function BusinessCardDownload({
  branchId,
  branchName,
  brandName,
  isOpen,
  onClose,
  primaryColor = '#3B82F6',
}: BusinessCardDownloadProps) {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('vcard');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setDownloaded(false);

    try {
      if (selectedFormat === 'image') {
        // For image format, we get SVG and convert to PNG client-side
        const response = await fetch(
          `/api/branches/${branchId}/business-card?format=image`
        );
        const data = await response.json();

        if (data.success && data.svg) {
          await convertSvgToPng(data.svg, data.filename, data.width, data.height);
        } else {
          throw new Error('Failed to generate image');
        }
      } else {
        // For vcard and pdf, direct download
        const response = await fetch(
          `/api/branches/${branchId}/business-card?format=${selectedFormat}`
        );

        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const extension = selectedFormat === 'pdf' ? 'pdf' : 'vcf';
        link.download = `${branchName.replace(/[^a-zA-Z0-9]/g, '_')}_business_card.${extension}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const convertSvgToPng = async (
    svgString: string,
    filename: string,
    width: number,
    height: number
  ) => {
    return new Promise<void>((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
            URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };

      img.src = url;
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${brandName} - ${branchName}`,
          text: `Download my digital business card`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 bottom-4 sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-full z-50 animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className="px-6 py-4 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Download Business Card</h3>
                <p className="text-sm text-white/80 mt-0.5">{brandName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Format Options */}
          <div className="p-4 space-y-2">
            {formatOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedFormat === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedFormat(option.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-current bg-opacity-10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={isSelected ? { borderColor: primaryColor, backgroundColor: `${primaryColor}10` } : {}}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected ? 'text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                    style={isSelected ? { backgroundColor: primaryColor } : {}}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${isSelected ? '' : 'text-gray-900'}`}
                       style={isSelected ? { color: primaryColor } : {}}>
                      {option.name}
                    </p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  {isSelected && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="px-4 pb-4 space-y-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {downloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : downloaded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download {formatOptions.find(f => f.id === selectedFormat)?.name}</span>
                </>
              )}
            </button>

            {navigator.share && (
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Profile Link</span>
              </button>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-400 text-center">
              {selectedFormat === 'vcard'
                ? 'Opens in your contacts app'
                : selectedFormat === 'pdf'
                ? 'Professional card for printing'
                : 'Perfect for social media sharing'}
            </p>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) translateX(-50%); }
          to { opacity: 1; transform: translateY(-50%) translateX(-50%); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        @media (max-width: 640px) {
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(100%); }
            to { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
    </>
  );
}
