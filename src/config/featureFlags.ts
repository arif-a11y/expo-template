import { ENV } from './env';

export const FEATURE_FLAGS = {
  // Analytics
  ENABLE_ANALYTICS: ENV.ENABLE_ANALYTICS,
  ENABLE_CRASH_REPORTING: ENV.ENVIRONMENT === 'production',

  // Features
  ENABLE_PUSH_NOTIFICATIONS: ENV.ENABLE_PUSH_NOTIFICATIONS,
  ENABLE_DARK_MODE: true,
  ENABLE_BIOMETRIC_AUTH: true,

  // Experimental
  ENABLE_NEW_UI: ENV.ENVIRONMENT !== 'production',
  ENABLE_BETA_FEATURES: ENV.ENVIRONMENT === 'development',
} as const;
