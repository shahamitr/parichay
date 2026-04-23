'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

export function useInstantNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const navigateInstantly = useCallback((path: string) => {
    if (path === pathname) return;
    
    setIsNavigating(true);
    setTargetPath(path);
    
    // Start navigation immediately
    router.push(path);
    
    // Add loading cursor
    document.body.style.cursor = 'wait';
    
    // Reset after navigation
    setTimeout(() => {
      document.body.style.cursor = 'default';
      setIsNavigating(false);
      setTargetPath(null);
    }, 300);
  }, [router, pathname]);

  // Reset navigation state when pathname changes
  useEffect(() => {
    if (targetPath && pathname === targetPath) {
      setIsNavigating(false);
      setTargetPath(null);
      document.body.style.cursor = 'default';
    }
  }, [pathname, targetPath]);

  return { 
    navigateInstantly,
    isNavigating,
    targetPath
  };
}