export const STORAGE_KEYS = {
  SECURE: {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    BIOMETRIC_KEY: 'biometric_key',
    API_KEY: 'api_key',
  },

  REGULAR: {
    USER_PREFERENCES: 'user_preferences',
    THEME: 'app_theme',
    LANGUAGE: 'app_language',
    ONBOARDING_COMPLETED: 'onboarding_completed',
  },
} as const;
