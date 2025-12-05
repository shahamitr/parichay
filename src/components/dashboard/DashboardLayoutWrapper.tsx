'use client';

import { useState } from 'react';
import ModernSidebar from './ModernSidebar';
import DashboardHeader from './DashboardHeader';
import { ThemeProvider } from '@/lib/theme-context';
import HelpDrawer from '@/components/ui/HelpDrawer';
import CommandPalette, { useCommandPalette } from '@/components/ui/CommandPalette';
import ThemeCustomizer from '@/components/themes/ThemeCustomizer';
import AIAssistant from '@/components/ai/AIAssistant';

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const { isOpen: commandPaletteOpen, setIsOpen: setCommandPaletteOpen } = useCommandPalette();

    return (
        <ThemeProvider defaultTheme="system" storageKey="parichay-theme">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <ModernSidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                <div
                    className={`
              transition-all duration-300 ease-in-out
              ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}
            `}
                >
                    <DashboardHeader onOpenHelp={() => setShowHelp(true)} />
                    <main className="py-6">
                        <div className="px-4 sm:px-6 lg:px-8 w-full">
                            {children}
                        </div>
                    </main>
                </div>

                <HelpDrawer isOpen={showHelp} onClose={() => setShowHelp(false)} />

                {/* Phase 2 & 3 Global Features */}
                <CommandPalette
                    isOpen={commandPaletteOpen}
                    onClose={() => setCommandPaletteOpen(false)}
                />
                <ThemeCustomizer />
                <AIAssistant />
            </div>
        </ThemeProvider>
    );
}
