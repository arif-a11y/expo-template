import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';

/**
 * Hook to access auth state and actions
 *
 * @example
 * ```tsx
 * const { user, isLoggedIn, isLoading } = useAuth();
 * ```
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setUser = useAuthStore((state) => state.setUser);
  const getTokens = useAuthStore((state) => state.getTokens);

  return {
    user,
    isLoggedIn,
    isLoading,
    setAuth,
    clearAuth,
    setUser,
    getTokens,
  };
}

/**
 * React Query mutation hook for user login
 *
 * @example
 * ```tsx
 * const { mutate: login, isPending } = useLogin();
 *
 * const handleLogin = (data: LoginFormData) => {
 *   login(data, {
 *     onSuccess: () => {
 *       router.push('/home');
 *     },
 *     onError: (error) => {
 *       Alert.alert('Login Failed', error.message);
 *     },
 *   });
 * };
 * ```
 */
export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: async (data) => {
      // Store user and tokens in auth store
      await setAuth(data.user, data.tokens);
    },
  });
}

/**
 * React Query mutation hook for user registration
 *
 * @example
 * ```tsx
 * const { mutate: register, isPending } = useRegister();
 *
 * const handleRegister = (data: RegisterFormData) => {
 *   register(
 *     {
 *       email: data.email,
 *       password: data.password,
 *       name: data.name,
 *     },
 *     {
 *       onSuccess: () => {
 *         router.push('/home');
 *       },
 *       onError: (error) => {
 *         Alert.alert('Registration Failed', error.message);
 *       },
 *     }
 *   );
 * };
 * ```
 */
export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: async (data) => {
      // Store user and tokens in auth store
      await setAuth(data.user, data.tokens);
    },
  });
}

/**
 * React Query mutation hook for user logout
 *
 * @example
 * ```tsx
 * const { mutate: logout, isPending } = useLogout();
 *
 * const handleLogout = () => {
 *   logout(undefined, {
 *     onSuccess: () => {
 *       router.push('/login');
 *     },
 *   });
 * };
 * ```
 */
export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      // Clear auth state and tokens
      await clearAuth();
    },
  });
}
