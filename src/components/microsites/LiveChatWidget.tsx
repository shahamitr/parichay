'use client';

import { useEffect, useState } from 'react';
import { ContactSection } from '@/types/microsite';

interface LiveChatWidgetProps {
  config: ContactSection;
}

export default function LiveChatWidget({ config }: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!config.liveChatEnabled || !config.liveChatConfig) return;

    // Load chat widget based on provider
    const loadChatWidget = () => {
      switch (config.liveChatProvider) {
        case 'tawk':
          loadTawkTo();
          break;
        case 'intercom':
          loadIntercom();
          break;
        case 'crisp':
          loadCrisp();
          break;
        case 'custom':
          loadCustomScript();
          break;
        default:
          console.warn('Unknown chat provider:', config.liveChatProvider);
      }
    };

    loadChatWidget();

    return () => {
      // Cleanup chat widgets on unmount
      cleanupChatWidget();
    };
  }, [config]);

  const loadTawkTo = () => {
    if (!config.liveChatConfig?.widgetId) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${config.liveChatConfig.widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);
  };

  const loadIntercom = () => {
    if (!config.liveChatConfig?.widgetId) return;

    (window as any).intercomSettings = {
      app_id: config.liveChatConfig.widgetId,
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://widget.intercom.io/widget/${config.liveChatConfig.widgetId}`;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);
  };

  const loadCrisp = () => {
    if (!config.liveChatConfig?.widgetId) return;

    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = config.liveChatConfig.widgetId;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://client.crisp.chat/l.js';
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);
  };

  const loadCustomScript = () => {
    if (!config.liveChatConfig?.customScript) return;

    try {
      const script = document.createElement('script');
      script.innerHTML = config.liveChatConfig.customScript;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error loading custom chat script:', error);
    }
  };

  const cleanupChatWidget = () => {
    // Remove Tawk.to
    const tawkScript = document.querySelector('script[src*="tawk.to"]');
    if (tawkScript) tawkScript.remove();
    const tawkWidget = document.getElementById('tawkchat-container');
    if (tawkWidget) tawkWidget.remove();

    // Remove Intercom
    const intercomScript = document.querySelector('script[src*="intercom.io"]');
    if (intercomScript) intercomScript.remove();
    if ((window as any).Intercom) {
      (window as any).Intercom('shutdown');
    }

    // Remove Crisp
    const crispScript = document.querySelector('script[src*="crisp.chat"]');
    if (crispScript) crispScript.remove();
    if ((window as any).$crisp) {
      delete (window as any).$crisp;
    }
  };

  // If using a third-party widget, it will render itself
  // This component just manages the loading
  if (config.liveChatProvider !== 'custom' || !config.liveChatConfig?.customScript) {
    return null;
  }

  // For custom implementations, you can add a custom UI here
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isLoaded && (
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Custom chat UI can be implemented here */}
        </div>
      )}
    </div>
  );
}
