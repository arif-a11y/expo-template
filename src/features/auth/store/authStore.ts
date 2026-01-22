import { create } from 'zustand';
import { secureStorage } from '@/services/storage/secureStorage';
import { STORAGE_KEYS } from '@/constants';
import type { User, AuthTokens } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (user: User, tokens: AuthTokens) => Promise<void>;
  clearAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  getTokens: () => Promise<AuthTokens | null>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // State
  user: null,
  isLoggedIn: false,
  isLoading: true,

  setAuth: async (user, tokens) => {
    await secureStorage.set(STORAGE_KEYS.SECURE.AUTH_TOKEN, tokens.accessToken);
    await secureStorage.set(STORAGE_KEYS.SECURE.REFRESH_TOKEN, tokens.refreshToken);

    set({ user, isLoggedIn: true, isLoading: false });
  },

  clearAuth: async () => {
    await secureStorage.delete(STORAGE_KEYS.SECURE.AUTH_TOKEN);
    await secureStorage.delete(STORAGE_KEYS.SECURE.REFRESH_TOKEN);

    set({ user: null, isLoggedIn: false, isLoading: false });
  },

  setUser: (user) => {
    set({ user, isLoggedIn: !!user });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  getTokens: async () => {
    const accessToken = await secureStorage.get(STORAGE_KEYS.SECURE.AUTH_TOKEN);
    const refreshToken = await secureStorage.get(STORAGE_KEYS.SECURE.REFRESH_TOKEN);

    if (!accessToken || !refreshToken) {
      return null;
    }

    return { accessToken, refreshToken };
  },

  initialize: async () => {
    set({ isLoading: true });

    try {
      const tokens = await useAuthStore.getState().getTokens();

      if (tokens) {
        set({ isLoggedIn: true, isLoading: false });
      } else {
        set({ user: null, isLoggedIn: false, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },
}));
