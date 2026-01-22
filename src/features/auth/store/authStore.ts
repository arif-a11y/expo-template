import { create } from 'zustand';
import { secureStorage } from '@/services/storage/secureStorage';
import { STORAGE_KEYS } from '@/constants';
import type { User, AuthTokens } from '../types/auth.types';

/**
 * Auth store state interface
 */
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

/**
 * Auth store actions interface
 */
interface AuthActions {
  setAuth: (user: User, tokens: AuthTokens) => Promise<void>;
  clearAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  getTokens: () => Promise<AuthTokens | null>;
  initialize: () => Promise<void>;
}

/**
 * Auth store - manages client-side authentication state
 *
 * Usage:
 * - User info stored in Zustand (client state)
 * - Tokens stored in SecureStore (encrypted)
 * - Call initialize() on app start to restore auth state
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // State
  user: null,
  isLoggedIn: false,
  isLoading: true,

  // Actions
  setAuth: async (user, tokens) => {
    // Store tokens securely
    await secureStorage.set(STORAGE_KEYS.SECURE.AUTH_TOKEN, tokens.accessToken);
    await secureStorage.set(STORAGE_KEYS.SECURE.REFRESH_TOKEN, tokens.refreshToken);

    // Update state
    set({ user, isLoggedIn: true, isLoading: false });
  },

  clearAuth: async () => {
    // Clear tokens from secure storage
    await secureStorage.delete(STORAGE_KEYS.SECURE.AUTH_TOKEN);
    await secureStorage.delete(STORAGE_KEYS.SECURE.REFRESH_TOKEN);

    // Clear state
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
        // If we have tokens, we're logged in but don't have user data yet
        // The user data will be fetched by the app on startup
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
