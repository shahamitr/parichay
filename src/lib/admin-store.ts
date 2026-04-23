'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  // Sidebar state
  sidebarCollapsed: boolean;
  sidebarHovered: boolean;

  // View preferences
  brandsViewMode: 'grid' | 'table';
  usersViewMode: 'grid' | 'table';
  leadsViewMode: 'table' | 'kanban';

  // Command palette
  commandPaletteOpen: boolean;

  // Recent searches
  recentSearches: string[];

  // Notifications
  unreadNotifications: number;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarHovered: (hovered: boolean) => void;
  setBrandsViewMode: (mode: 'grid' | 'table') => void;
  setUsersViewMode: (mode: 'grid' | 'table') => void;
  setLeadsViewMode: (mode: 'table' | 'kanban') => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  setUnreadNotifications: (count: number) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarCollapsed: false,
      sidebarHovered: false,
      brandsViewMode: 'grid',
      usersViewMode: 'table',
      leadsViewMode: 'table',
      commandPaletteOpen: false,
      recentSearches: [],
      unreadNotifications: 0,

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSidebarHovered: (hovered) => set({ sidebarHovered: hovered }),
      setBrandsViewMode: (mode) => set({ brandsViewMode: mode }),
      setUsersViewMode: (mode) => set({ usersViewMode: mode }),
      setLeadsViewMode: (mode) => set({ leadsViewMode: mode }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      addRecentSearch: (search) =>
        set((state) => ({
          recentSearches: [search, ...state.recentSearches.filter((s) => s !== search)].slice(0, 5),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
      setUnreadNotifications: (count) => set({ unreadNotifications: count }),
    }),
    {
      name: 'parichay-admin-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        brandsViewMode: state.brandsViewMode,
        usersViewMode: state.usersViewMode,
        leadsViewMode: state.leadsViewMode,
        recentSearches: state.recentSearches,
      }),
    }
  )
);

// Keyboard shortcut hook for command palette
export const useAdminKeyboardShortcuts = () => {
  const { toggleCommandPalette, toggleSidebar } = useAdminStore();

  if (typeof window !== 'undefined') {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      // Cmd/Ctrl + B for sidebar toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    return { handleKeyDown };
  }

  return { handleKeyDown: () => {} };
};
