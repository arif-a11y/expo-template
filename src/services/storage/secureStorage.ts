import * as SecureStore from 'expo-secure-store';

/**
 * SecureStore wrapper for sensitive data (tokens, API keys, etc.)
 */
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
