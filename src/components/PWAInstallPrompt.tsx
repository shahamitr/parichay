'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) return;

    // Check if running as PWA already
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Mobile check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Delay showing the prompt by 30 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  // Only show on mobile and when prompt is available
  if (!showPrompt || !isMobile || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
        {/* App icon */}
        <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-[16px]">P</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900">Add Parichay to Home Screen</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Quick access to your business profile</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-[12px] font-medium rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
