'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isLoading: boolean;
}

const initialState: ThemeProviderState = {
    theme: 'system',
    setTheme: () => null,
    isLoading: true,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
        }
        return defaultTheme;
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load theme preference from API on mount
    useEffect(() => {
        const loadThemeFromAPI = async () => {
            try {
                const response = await fetch('/api/user/preferences', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    const serverTheme = data.preferences?.themePreference as Theme;
                    if (serverTheme && ['light', 'dark', 'system'].includes(serverTheme)) {
                        setThemeState(serverTheme);
                        localStorage.setItem(storageKey, serverTheme);
                    }
                }
            } catch (error) {
                // API unavailable or user not logged in - use localStorage value
                console.debug('Theme API not available, using localStorage');
            } finally {
                setIsLoading(false);
            }
        };

        loadThemeFromAPI();
    }, [storageKey]);

    // Apply theme to DOM
    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
                .matches
                ? 'dark'
                : 'light';

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    const setTheme = useCallback(async (newTheme: Theme) => {
        // Immediately update local state and localStorage
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);

        // Sync to database in background (non-blocking)
        try {
            await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ themePreference: newTheme }),
            });
        } catch (error) {
            // Silently fail - localStorage is already updated
            console.debug('Failed to sync theme to server');
        }
    }, [storageKey]);

    const value = {
        theme,
        setTheme,
        isLoading,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};
