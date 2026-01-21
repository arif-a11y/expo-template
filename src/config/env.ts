import Constants from 'expo-constants';

interface EnvConfig {
  // API
  API_URL: string;
  API_TIMEOUT: number;

  // Feature flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;

  // App
  APP_VERSION: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}

const extra = Constants.expoConfig?.extra || {};

export const ENV: EnvConfig = {
  // API
  API_URL: extra.apiUrl || 'https://api.example.com',
  API_TIMEOUT: Number(extra.apiTimeout) || 10000,

  // Feature flags
  ENABLE_ANALYTICS: extra.enableAnalytics === 'true',
  ENABLE_PUSH_NOTIFICATIONS: extra.enablePushNotifications === 'true',

  // App
  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
  ENVIRONMENT: extra.environment || 'development',
};

// Validate required env vars
const requiredEnvVars: (keyof EnvConfig)[] = ['API_URL'];

requiredEnvVars.forEach((key) => {
  if (!ENV[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
