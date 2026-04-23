'use client';

import React from 'react';
import { useHelp } from '@/contexts/HelpContext';
import HelpDrawer from './HelpDrawer';

export default function HelpSystem() {
  const { isHelpOpen, closeHelp, currentPageContext, helpItems } = useHelp();

  return (
    <HelpDrawer
      isOpen={isHelpOpen}
      onClose={closeHelp}
      pageContext={currentPageContext}
      helpItems={helpItems}
    />
  );
}