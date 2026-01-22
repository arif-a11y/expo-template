export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  // Example: USERS
  // USERS: {
  //   LIST: '/users',
  //   DETAIL: (id: string) => `/users/${id}`,
  //   UPDATE: (id: string) => `/users/${id}`,
  //   DELETE: (id: string) => `/users/${id}`,
  // },

  // Add your API endpoints here
} as const;
