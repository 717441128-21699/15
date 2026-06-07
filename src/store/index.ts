import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, StoreFilters } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

interface FilterState {
  storeFilters: StoreFilters;
  setStoreFilters: (filters: Partial<StoreFilters>) => void;
  resetStoreFilters: () => void;
}

type AppState = AuthState & UIState & FilterState;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      storeFilters: {
        city: undefined,
        brand: undefined,
        regionId: undefined,
      },
      setStoreFilters: (filters) =>
        set((state) => ({ storeFilters: { ...state.storeFilters, ...filters } })),
      resetStoreFilters: () =>
        set({
          storeFilters: {
            city: undefined,
            brand: undefined,
            regionId: undefined,
          },
        }),
    }),
    {
      name: 'restaurant-platform-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
