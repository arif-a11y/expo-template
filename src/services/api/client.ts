import axios from 'axios';
import { ENV } from '@/config/env';
import { secureStorage } from '@/services/storage/secureStorage';
import { STORAGE_KEYS } from '@/constants';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from secure storage
    const token = await secureStorage.get(STORAGE_KEYS.SECURE.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear auth tokens on unauthorized
      await secureStorage.delete(STORAGE_KEYS.SECURE.AUTH_TOKEN);
      await secureStorage.delete(STORAGE_KEYS.SECURE.REFRESH_TOKEN);

      // Note: Auth store will be cleared by the app when it detects missing tokens
      // or you can dispatch a logout action here if needed
    }
    return Promise.reject(error);
  }
);
