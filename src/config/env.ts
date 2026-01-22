import Constants from 'expo-constants';

interface EnvConfig {
  API_URL: string;
  API_TIMEOUT: number;
  CLERK_PUBLISHABLE_KEY: string;

  ENABLE_ANALYTICS: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;

  APP_VERSION: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}

export const ENV: EnvConfig = {
  API_URL: process.env.EXPO_PUBLIC_API_BASE_URL!,
  API_TIMEOUT: 10000,
  CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!,

  ENABLE_ANALYTICS: false,
  ENABLE_PUSH_NOTIFICATIONS: false,

  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
  ENVIRONMENT: 'development',
};

const requiredEnvVars: (keyof EnvConfig)[] = ['API_URL', 'CLERK_PUBLISHABLE_KEY'];

requiredEnvVars.forEach((key) => {
  if (!ENV[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
