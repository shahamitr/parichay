'use client';

import { Share2, Link, Check, Smartphone } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ShareActionProps {
  title: string;
  text: string;
  url: string;
  brandColor?: string;
}

export default function ShareAction({ title, text, url, brandColor = '#3B82F6' }: ShareActionProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
          setIsOpen(true); // Fallback to custom menu
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95"
        style={{ backgroundColor: brandColor }}
      >
        <Share2 className="w-4 h-4" />
        Share Card
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 sm:hidden" />
            
            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Share Connection</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">Spread your professional presence across any platform.</p>

            <div className="space-y-4">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600">
                    <Link className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm uppercase tracking-wider">Copy Link</span>
                </div>
                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-primary-500 transition-colors" />}
              </button>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4">
                <Smartphone className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-1">PWA Tip</p>
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    Install this card as an app on your home screen for instant offline access and faster sharing.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all"
            >
              Close
            </button>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
