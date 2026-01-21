# 11. Configuration & Environment Management

## Overview

This section covers environment configuration, build-time vs runtime config, feature flags, API management, and secure storage considerations.

---

## Environment Configuration

### File Structure

```
project-root/
├── .env                    # Default (never commit secrets)
├── .env.development        # Development
├── .env.staging            # Staging
├── .env.production         # Production
├── .env.example            # Template (commit this)
└── src/
    └── config/
        ├── env.ts          # Environment configuration
        └── featureFlags.ts # Feature flags
```

### Environment Files

```bash
# .env.example (commit to repo)
# Copy to .env and fill in actual values

# API
API_URL=https://api.example.com
API_TIMEOUT=10000

# Features
ENABLE_ANALYTICS=false
ENABLE_PUSH_NOTIFICATIONS=false

# Keys (use placeholder values)
SENTRY_DSN=your_sentry_dsn_here
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

```bash
# .env.development
API_URL=https://dev-api.example.com
API_TIMEOUT=30000
ENABLE_ANALYTICS=false
ENABLE_PUSH_NOTIFICATIONS=false
SENTRY_DSN=dev_sentry_dsn
GOOGLE_MAPS_API_KEY=dev_maps_key
```

```bash
# .env.production
API_URL=https://api.example.com
API_TIMEOUT=10000
ENABLE_ANALYTICS=true
ENABLE_PUSH_NOTIFICATIONS=true
SENTRY_DSN=prod_sentry_dsn
GOOGLE_MAPS_API_KEY=prod_maps_key
```

---

## Build-Time vs Runtime Config

### Build-Time Configuration

Values baked into the bundle at build time.

```bash
# Using expo-constants
npm install expo-constants
```

```tsx
// app.config.ts
export default {
  name: 'MyApp',
  version: '1.0.0',
  extra: {
    apiUrl: process.env.API_URL,
    environment: process.env.APP_ENV || 'development',
  },
};
```

```tsx
// src/config/env.ts
import Constants from 'expo-constants';

export const ENV = {
  API_URL: Constants.expoConfig?.extra?.apiUrl,
  ENVIRONMENT: Constants.expoConfig?.extra?.environment,
} as const;
```

**Pros:**
- Fast (no runtime lookup)
- Type-safe
- Values cannot be changed after build

**Cons:**
- Requires rebuild to change values
- Different bundles for each environment

---

### Runtime Configuration

Values loaded at app startup.

```bash
# Using react-native-config
npm install react-native-config
```

```tsx
// src/config/env.ts
import Config from 'react-native-config';

export const ENV = {
  API_URL: Config.API_URL!,
  API_TIMEOUT: Number(Config.API_TIMEOUT) || 10000,
  ENABLE_ANALYTICS: Config.ENABLE_ANALYTICS === 'true',
  SENTRY_DSN: Config.SENTRY_DSN,
  GOOGLE_MAPS_API_KEY: Config.GOOGLE_MAPS_API_KEY,
} as const;
```

**Pros:**
- Single bundle for all environments
- Can change config without rebuild (with remote config)

**Cons:**
- Slightly slower startup
- Requires proper .env file management

---

## Environment Configuration Module

### Type-Safe Configuration

```tsx
// src/config/env.ts
import Constants from 'expo-constants';

interface EnvConfig {
  // API
  API_URL: string;
  API_TIMEOUT: number;

  // Feature flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;

  // Services
  SENTRY_DSN: string;
  GOOGLE_MAPS_API_KEY: string;

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

  // Services
  SENTRY_DSN: extra.sentryDsn || '',
  GOOGLE_MAPS_API_KEY: extra.googleMapsApiKey || '',

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
```

### Usage

```tsx
// src/services/api/client.ts
import axios from 'axios';
import { ENV } from '@/config/env';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## Feature Flags

### Simple Feature Flags

```tsx
// src/config/featureFlags.ts
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
```

### Usage

```tsx
// src/app/_layout.tsx
import { FEATURE_FLAGS } from '@/config/featureFlags';
import * as Sentry from '@sentry/react-native';

if (FEATURE_FLAGS.ENABLE_CRASH_REPORTING) {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
  });
}
```

### Remote Feature Flags

For production apps, consider remote feature flag services:

```tsx
// src/config/remoteConfig.ts
import remoteConfig from '@react-native-firebase/remote-config';

export async function initRemoteConfig() {
  await remoteConfig().setDefaults({
    enable_new_checkout: false,
    enable_social_login: true,
  });

  await remoteConfig().fetchAndActivate();
}

export function getFeatureFlag(key: string): boolean {
  return remoteConfig().getValue(key).asBoolean();
}

// Usage
const isNewCheckoutEnabled = getFeatureFlag('enable_new_checkout');
```

---

## API Base URLs

### Multiple Environments

```tsx
// src/constants/api.ts
import { ENV } from '@/config/env';

const BASE_URLS = {
  development: 'https://dev-api.example.com',
  staging: 'https://staging-api.example.com',
  production: 'https://api.example.com',
};

export const API_BASE_URL = ENV.API_URL || BASE_URLS[ENV.ENVIRONMENT];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
  },
} as const;
```

---

## Secure Storage Considerations

### What to Store Securely

```tsx
// src/constants/storage-keys.ts
export const STORAGE_KEYS = {
  // Secure storage (encrypted)
  SECURE: {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    BIOMETRIC_KEY: 'biometric_key',
    API_KEY: 'api_key',
  },

  // Regular storage (AsyncStorage)
  REGULAR: {
    USER_PREFERENCES: 'user_preferences',
    THEME: 'app_theme',
    LANGUAGE: 'app_language',
    ONBOARDING_COMPLETED: 'onboarding_completed',
  },
} as const;
```

### Secure Storage Implementation

```bash
npx expo install expo-secure-store
```

```tsx
// src/services/storage/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  /**
   * Store a value securely
   */
  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  /**
   * Get a secure value
   */
  async get(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  },

  /**
   * Delete a secure value
   */
  async delete(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },

  /**
   * Store an object securely (JSON serialized)
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  },

  /**
   * Get a secure object
   */
  async getObject<T>(key: string): Promise<T | null> {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  },
};
```

### Regular Storage

```tsx
// src/services/storage/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async set(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async get(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },

  async delete(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async setObject<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async getObject<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};
```

---

## Configuration Best Practices

### ✅ Do's

1. **Use .env files for configuration**
2. **Never commit secrets to git**
3. **Use .env.example as a template**
4. **Validate required env vars at startup**
5. **Use TypeScript for type-safe config**
6. **Store sensitive data in secure storage**
7. **Use different configs per environment**
8. **Document all env variables**

### ❌ Don'ts

1. **Don't hardcode API URLs in code**
2. **Don't store tokens in AsyncStorage**
3. **Don't commit .env files with real secrets**
4. **Don't mix dev and prod credentials**
5. **Don't ignore env var validation**
6. **Don't use environment vars for runtime flags**

---

## Environment Checklist

### Development

- [ ] .env.development configured
- [ ] Dev API URL set
- [ ] Dev API keys configured
- [ ] Analytics disabled
- [ ] Verbose logging enabled

### Staging

- [ ] .env.staging configured
- [ ] Staging API URL set
- [ ] Staging API keys configured
- [ ] Analytics enabled
- [ ] Error reporting enabled

### Production

- [ ] .env.production configured
- [ ] Production API URL set
- [ ] Production API keys configured
- [ ] Analytics enabled
- [ ] Error reporting enabled
- [ ] Logging reduced
- [ ] All secrets in secure storage

---

## Do's and Don'ts Summary

### Do's

- ✅ Use environment-specific .env files
- ✅ Validate required environment variables
- ✅ Use TypeScript for type-safe configuration
- ✅ Store secrets in secure storage (expo-secure-store)
- ✅ Create .env.example template
- ✅ Document all environment variables
- ✅ Use feature flags for gradual rollouts
- ✅ Separate dev/staging/prod configurations

### Don'ts

- ❌ Don't commit secrets to version control
- ❌ Don't hardcode API URLs or keys
- ❌ Don't store sensitive data in AsyncStorage
- ❌ Don't use production keys in development
- ❌ Don't forget to validate required env vars
- ❌ Don't mix build-time and runtime config carelessly
- ❌ Don't expose API keys in client code
