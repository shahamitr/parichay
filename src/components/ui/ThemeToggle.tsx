'use client';

import { useTheme } from '@/lib/theme-context';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Toggle theme"
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 overflow-hidden">
                    <button
                        onClick={() => {
                            setTheme('light');
                            setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${theme === 'light'
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Sun className="h-4 w-4" />
                        Light
                    </button>
                    <button
                        onClick={() => {
                            setTheme('dark');
                            setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${theme === 'dark'
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Moon className="h-4 w-4" />
                        Dark
                    </button>
                    <button
                        onClick={() => {
                            setTheme('system');
                            setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${theme === 'system'
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Laptop className="h-4 w-4" />
                        System
                    </button>
                </div>
            )}
        </div>
    );
}
