'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationContextType {
  isNavigating: boolean;
  targetPath: string | null;
  navigate: (path: string) => void;
  setNavigationState: (navigating: boolean, path?: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const navigate = useCallback((path: string) => {
    if (path === pathname) return;
    
    setIsNavigating(true);
    setTargetPath(path);
    
    // Immediate navigation
    router.push(path);
    
    // Reset after short delay
    setTimeout(() => {
      setIsNavigating(false);
      setTargetPath(null);
    }, 200);
  }, [router, pathname]);

  const setNavigationState = useCallback((navigating: boolean, path?: string) => {
    setIsNavigating(navigating);
    setTargetPath(path || null);
  }, []);

  return (
    <NavigationContext.Provider value={{
      isNavigating,
      targetPath,
      navigate,
      setNavigationState
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}