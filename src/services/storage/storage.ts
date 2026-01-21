import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage wrapper for non-sensitive data
 */
export const storage = {
  /**
   * Store a value
   */
  async set(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  /**
   * Get a value
   */
  async get(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },

  /**
   * Delete a value
   */
  async delete(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  /**
   * Store an object (JSON serialized)
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Get an object
   */
  async getObject<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};
