export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    SEND_VERIFICATION: '/auth/send-verification-code',
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
