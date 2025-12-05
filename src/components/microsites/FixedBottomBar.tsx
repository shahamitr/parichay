'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, Share2, Navigation, Check, X } from 'lucide-react';
import { MicrositeData } from '@/types/microsite';

interface FixedBottomBarProps {
  data: MicrositeData;
}

export default function FixedBottomBar({ data }: FixedBottomBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const { branch, brand } = data;
  const contact = branch.contact as any;
  const address = branch.address as any;
  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trackClick = async (action: string) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'CLICK',
          branchId: branch.id,
          brandId: brand.id,
          metadata: { action, source: 'bottom_bar' },
        }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleShare = async () => {
    trackClick('share');
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${brand.name} - ${branch.name}`,
          text: brand.tagline || `Check out ${brand.name}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setShowShareToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareToast(false);
      }, 2000);
    }
  };

  const actions = [
    {
      id: 'call',
      icon: Phone,
      label: 'Call',
      href: contact?.phone ? `tel:${contact.phone}` : null,
      gradient: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/30',
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      href: contact?.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}` : null,
      gradient: 'from-green-500 to-green-600',
      shadowColor: 'shadow-green-500/30',
    },
    {
      id: 'directions',
      icon: Navigation,
      label: 'Directions',
      href: address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address.street || ''}, ${address.city || ''}`)}` : null,
      gradient: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/30',
    },
    {
      id: 'share',
      icon: copied ? Check : Share2,
      label: copied ? 'Copied!' : 'Share',
      onClick: handleShare,
      gradient: copied ? 'from-green-500 to-emerald-500' : 'from-purple-500 to-indigo-500',
      shadowColor: copied ? 'shadow-green-500/30' : 'shadow-purple-500/30',
    },
  ].filter(action => action.href || action.onClick);

  if (actions.length === 0) return null;

  return (
    <>
      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full shadow-lg">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">Link copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* Modern Bottom Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Gradient blur background */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/80 backdrop-blur-lg" />

        {/* Top border gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}40, transparent)` }}
        />

        {/* Content */}
        <div className="relative px-4 py-3 pb-safe">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-around gap-2">
              {actions.map((action) => {
                const Icon = action.icon;

                const buttonContent = (
                  <div className="flex flex-col items-center gap-1 group">
                    <div
                      className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center
                        bg-gradient-to-br ${action.gradient}
                        shadow-lg ${action.shadowColor}
                        transform transition-all duration-300
                        group-hover:scale-110 group-hover:shadow-xl
                        group-active:scale-95
                      `}
                    >
                      <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                      {action.label}
                    </span>
                  </div>
                );

                if (action.onClick) {
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        trackClick(action.id);
                        action.onClick?.();
                      }}
                      className="flex-1 max-w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-2xl"
                      aria-label={action.label}
                    >
                      {buttonContent}
                    </button>
                  );
                }

                return (
                  <a
                    key={action.id}
                    href={action.href!}
                    target={action.id === 'directions' ? '_blank' : undefined}
                    rel={action.id === 'directions' ? 'noopener noreferrer' : undefined}
                    onClick={() => trackClick(action.id)}
                    className="flex-1 max-w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-2xl"
                    aria-label={action.label}
                  >
                    {buttonContent}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Safe area spacer for mobile */}
      <div className="h-24 sm:h-20" />

      {/* Animation styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .pb-safe { padding-bottom: max(12px, env(safe-area-inset-bottom)); }
      `}} />
    </>
  );
}
