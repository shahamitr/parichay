'use client';

import React, { useEffect } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { useHelp, getHelpForPage } from '@/contexts/HelpContext';

interface HelpButtonProps {
  pageContext: string;
  className?: string;
  variant?: 'floating' | 'inline';
}

export default function HelpButton({
  pageContext,
  className = '',
  variant = 'floating'
}: HelpButtonProps) {
  const { openHelp, setPageContext, setHelpItems } = useHelp();

  useEffect(() => {
    setPageContext(pageContext);
    setHelpItems(getHelpForPage(pageContext.toLowerCase()));
  }, [pageContext, setPageContext, setHelpItems]);

  const handleClick = () => {
    openHelp();
  };

  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 ${className}`}
      >
        <HelpCircle className="w-4 h-4" />
        Help
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      <button
        onClick={handleClick}
        className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        title={`Get help with ${pageContext}`}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <HelpCircle className="w-6 h-6" />
        </div>

        {/* Sparkle effect */}
        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-bounce" />
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Get help with {pageContext}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
          </div>
        </div>

        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping" />
      </button>
    </div>
  );
}