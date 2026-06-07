import { create } from 'zustand';
import type { User, UserRole } from '../types';
import { api } from '../services/api';

interface AppState {
  user: User | null;
  token: string | null;
  sidebarCollapsed: boolean;
  selectedCity: string;
  selectedBrand: string;
  isLoading: boolean;
  login: (role: UserRole) => Promise<void>;
  logout: () => void;
  toggleSidebar: () => void;
  setSelectedCity: (city: string) => void;
  setSelectedBrand: (brand: string) => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: null,
  sidebarCollapsed: false,
  selectedCity: 'all',
  selectedBrand: 'all',
  isLoading: false,

  login: async (role: UserRole) => {
    set({ isLoading: true });
    try {
      const { token, user } = await api.auth.login(role);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSelectedCity: (city: string) => set({ selectedCity: city }),
  setSelectedBrand: (brand: string) => set({ selectedBrand: brand }),
  setLoading: (isLoading: boolean) => set({ isLoading }),

  hydrate: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ token, user });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },
}));
