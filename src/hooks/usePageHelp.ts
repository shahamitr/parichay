'use client';

import { useEffect } from 'react';
import { useHelp, getHelpForPage } from '@/contexts/HelpContext';

interface UsePageHelpOptions {
  pageContext: string;
  customHelpItems?: Array<{
    id: string;
    title: string;
    description: string;
    type: 'guide' | 'video' | 'faq' | 'feature';
    content?: string;
    videoUrl?: string;
    category: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }>;
}

export function usePageHelp({ pageContext, customHelpItems }: UsePageHelpOptions) {
  const { setPageContext, setHelpItems, openHelp } = useHelp();

  useEffect(() => {
    setPageContext(pageContext);

    // Use custom help items if provided, otherwise use default ones
    const helpItems = customHelpItems || getHelpForPage(pageContext.toLowerCase());
    setHelpItems(helpItems);
  }, [pageContext, customHelpItems, setPageContext, setHelpItems]);

  return {
    openHelp,
    pageContext
  };
}