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

/**
 * Global app store state
 */
interface AppState {
  // Settings
  settings: AppSettings;

  // UI state
  isOnboardingCompleted: boolean;

  // Loading state
  isInitialized: boolean;
}

/**
 * Global app store actions
 */
interface AppActions {
  // Settings actions
  setLanguage: (language: AppSettings['language']) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setTheme: (theme: AppSettings['theme']) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;

  // Onboarding actions
  completeOnboarding: () => Promise<void>;

  // Initialization
  initialize: () => Promise<void>;
}

/**
 * Default app settings
 */
const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  notificationsEnabled: true,
  theme: 'system',
};

/**
 * Global app store - manages app-level state and preferences
 *
 * Features:
 * - Persisted settings (language, notifications, theme)
 * - Onboarding completion state
 * - Auto-initialization on app start
 *
 * Usage:
 * ```tsx
 * const { settings, setLanguage } = useAppStore();
 *
 * // Change language
 * await setLanguage('es');
 *
 * // Access current language
 * console.log(settings.language);
 * ```
 *
 * Selective subscription (prevents unnecessary re-renders):
 * ```tsx
 * // Only re-render when language changes
 * const language = useAppStore((state) => state.settings.language);
 * ```
 */
export const useAppStore = create<AppState & AppActions>((set, get) => ({
  // Initial state
  settings: DEFAULT_SETTINGS,
  isOnboardingCompleted: false,
  isInitialized: false,

  // Settings actions
  setLanguage: async (language) => {
    const newSettings = { ...get().settings, language };
    await storage.setObject(STORAGE_KEYS.REGULAR.USER_PREFERENCES, newSettings);
    set({ settings: newSettings });
  },

  setNotificationsEnabled: async (notificationsEnabled) => {
    const newSettings = { ...get().settings, notificationsEnabled };
    await storage.setObject(STORAGE_KEYS.REGULAR.USER_PREFERENCES, newSettings);
    set({ settings: newSettings });
  },

  setTheme: async (theme) => {
    const newSettings = { ...get().settings, theme };
    await storage.setObject(STORAGE_KEYS.REGULAR.USER_PREFERENCES, newSettings);
    set({ settings: newSettings });
  },

  updateSettings: async (partialSettings) => {
    const newSettings = { ...get().settings, ...partialSettings };
    await storage.setObject(STORAGE_KEYS.REGULAR.USER_PREFERENCES, newSettings);
    set({ settings: newSettings });
  },

  // Onboarding actions
  completeOnboarding: async () => {
    await storage.set(STORAGE_KEYS.REGULAR.ONBOARDING_COMPLETED, 'true');
    set({ isOnboardingCompleted: true });
  },

  // Initialize app store from persisted data
  initialize: async () => {
    try {
      // Load persisted settings
      const savedSettings = await storage.getObject<AppSettings>(
        STORAGE_KEYS.REGULAR.USER_PREFERENCES
      );

      // Load onboarding status
      const onboardingCompleted = await storage.get(
        STORAGE_KEYS.REGULAR.ONBOARDING_COMPLETED
      );

      set({
        settings: savedSettings || DEFAULT_SETTINGS,
        isOnboardingCompleted: onboardingCompleted === 'true',
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize app store:', error);
      set({
        settings: DEFAULT_SETTINGS,
        isOnboardingCompleted: false,
        isInitialized: true,
      });
    }
  },
}));
