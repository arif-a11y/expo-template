import Constants from 'expo-constants';

interface EnvConfig {
  API_URL: string;
  API_TIMEOUT: number;

  ENABLE_ANALYTICS: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;

  APP_VERSION: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}

const extra = Constants.expoConfig?.extra || {};

export const ENV: EnvConfig = {
  API_URL: extra.apiUrl || 'https://api.example.com',
  API_TIMEOUT: Number(extra.apiTimeout) || 10000,

  ENABLE_ANALYTICS: extra.enableAnalytics === 'true',
  ENABLE_PUSH_NOTIFICATIONS: extra.enablePushNotifications === 'true',

  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
  ENVIRONMENT: extra.environment || 'development',
};

const requiredEnvVars: (keyof EnvConfig)[] = ['API_URL'];

requiredEnvVars.forEach((key) => {
  if (!ENV[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
