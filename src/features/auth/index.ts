/**
 * Auth feature public API
 *
 * This is the single entry point for the auth feature.
 * Other parts of the app should import from this file only.
 */

// Hooks
export { useAuth, useLogin, useRegister, useLogout } from './hooks/useAuth';

// Store
export { useAuthStore } from './store/authStore';

export type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
} from './types/auth.types';

export { loginSchema, registerSchema } from './schemas/auth.schema';
export type { LoginFormData, RegisterFormData } from './schemas/auth.schema';
