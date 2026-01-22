import { create } from 'zustand';
import { storage } from '@/services/storage/storage';
import { STORAGE_KEYS } from '@/constants';

/**
 * App-level settings and preferences
 */
interface AppSettings {
  language: 'en' | 'es' | 'fr';
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface AppState {
  settings: AppSettings;
  isInitialized: boolean;
}

interface AppActions {
  setLanguage: (language: AppSettings['language']) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setTheme: (theme: AppSettings['theme']) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  initialize: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  notificationsEnabled: true,
  theme: 'system',
};

/**
 * Global app store
 *
 * Responsibilities:
 * - Persisted user preferences
 * - App initialization lifecycle
 *
 * Usage:
 * ```ts
 * const language = useAppStore((s) => s.settings.language);
 * ```
 */
export const useAppStore = create<AppState & AppActions>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isInitialized: false,

  setLanguage: async (language) => {
    const settings = { ...get().settings, language };
    await storage.setObject(STORAGE_KEYS.REGULAR.USER_PREFERENCES, settings);
    set({ settings });
  },

  setNotificationsEnabled: async (notificationsEnabled) => {
    const settings = { ...get().settings, notificationsEnabled };
    await storage.setObject(STORAGE_KEYS.REGULAR.USER_PREFERENCES, settings);
    set({ settings });
  },

  setTheme: async (theme) => {
    const settings = { ...get().settings, theme };
    await storage.setObject(STORAGE_KEYS.REGULAR.USER_PREFERENCES, settings);
    set({ settings });
  },

  updateSettings: async (partialSettings) => {
    const settings = { ...get().settings, ...partialSettings };
    await storage.setObject(STORAGE_KEYS.REGULAR.USER_PREFERENCES, settings);
    set({ settings });
  },

  initialize: async () => {
    try {
      const savedSettings = await storage.getObject<AppSettings>(
        STORAGE_KEYS.REGULAR.USER_PREFERENCES
      );

      set({
        settings: savedSettings || DEFAULT_SETTINGS,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize app store:', error);
      set({
        settings: DEFAULT_SETTINGS,
        isInitialized: true,
      });
    }
  },
}));
