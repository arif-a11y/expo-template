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

apiClient.interceptors.request.use(
  async (config) => {
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await secureStorage.delete(STORAGE_KEYS.SECURE.AUTH_TOKEN);
      await secureStorage.delete(STORAGE_KEYS.SECURE.REFRESH_TOKEN);
    }
    return Promise.reject(error);
  }
);
