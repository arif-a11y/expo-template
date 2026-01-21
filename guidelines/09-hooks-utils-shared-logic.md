# 9. Hooks, Utils & Shared Logic

## Overview

This section explains how to structure custom hooks, utility functions, and shared logic in React Native applications, emphasizing clear organization and avoiding over-abstraction.

---

## Custom Hooks Structure

### Hook Organization

```
src/
├── hooks/                    # Global shared hooks
│   ├── useDebounce.ts
│   ├── useKeyboard.ts
│   ├── useResponsive.ts
│   └── useNetworkStatus.ts
├── features/
│   └── auth/
│       └── hooks/            # Feature-specific hooks
│           ├── useAuth.ts
│           ├── useLogin.ts
│           └── useRegister.ts
```

---

## Shared Hooks vs Feature Hooks

### Decision Matrix

| Hook Type | Location | Example | When to Use |
|-----------|----------|---------|-------------|
| **Global shared hooks** | `src/hooks/` | `useDebounce`, `useKeyboard` | Used across multiple features |
| **Feature hooks** | `src/features/[name]/hooks/` | `useAuth`, `useLogin` | Specific to one feature |
| **Component hooks** | Co-located with component | `useFormState` inside form | Only used in one component |

---

## Global Shared Hooks

### useDebounce

```tsx
// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * Debounces a value by delaying updates until after the specified delay
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 300);

useEffect(() => {
  if (debouncedQuery) {
    searchAPI(debouncedQuery);
  }
}, [debouncedQuery]);
```

### useKeyboard

```tsx
// src/hooks/useKeyboard.ts
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

interface KeyboardInfo {
  isVisible: boolean;
  height: number;
}

/**
 * Tracks keyboard visibility and height
 * @returns Object containing keyboard visibility and height
 */
export function useKeyboard(): KeyboardInfo {
  const [keyboardInfo, setKeyboardInfo] = useState<KeyboardInfo>({
    isVisible: false,
    height: 0,
  });

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => {
      setKeyboardInfo({
        isVisible: true,
        height: e.endCoordinates.height,
      });
    };

    const onHide = () => {
      setKeyboardInfo({
        isVisible: false,
        height: 0,
      });
    };

    const showSubscription = Keyboard.addListener('keyboardWillShow', onShow);
    const hideSubscription = Keyboard.addListener('keyboardWillHide', onHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardInfo;
}

// Usage
const { isVisible, height } = useKeyboard();

return (
  <View style={{ paddingBottom: isVisible ? height : 0 }}>
    {/* Content */}
  </View>
);
```

### useNetworkStatus

```tsx
// src/hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string | null;
}

/**
 * Monitors network connectivity status
 * @returns Object containing network connection information
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
      });
    });

    return () => unsubscribe();
  }, []);

  return status;
}

// Usage
const { isConnected, isInternetReachable } = useNetworkStatus();

if (!isConnected) {
  return <OfflineScreen />;
}
```

---

## Feature-Specific Hooks

### useAuth

```tsx
// src/features/auth/hooks/useAuth.ts
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import type { User } from '../types/auth.types';

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

/**
 * Hook for authentication management
 * Provides user state and auth methods
 */
export function useAuth(): UseAuthReturn {
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authState = await authService.login(email, password);
      setUser(authState.user, authState.accessToken, authState.refreshToken);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearUser();
    }
  };

  const refreshToken = async () => {
    try {
      const newTokens = await authService.refreshToken();
      setUser(user, newTokens.accessToken, newTokens.refreshToken);
    } catch (error) {
      clearUser();
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  };
}
```

### useUsers (React Query)

```tsx
// src/features/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { userService } from '../services/userService';
import type { User, CreateUserData } from '../types/user.types';

/**
 * Hook for fetching users list
 */
export function useUsers() {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: userService.getAll,
  });
}

/**
 * Hook for fetching a single user
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook for creating a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
}
```

---

## Utility Functions Placement

### File Structure

```
src/
├── lib/                      # Global utilities
│   ├── utils.ts              # cn() and general utils
│   ├── validation.ts         # Validation helpers
│   └── date.ts               # Date formatting
├── features/
│   └── users/
│       └── utils/            # Feature-specific utilities
│           └── userUtils.ts
```

### Global Utilities

```tsx
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes intelligently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalizes first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates text to specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
```

### Validation Utilities

```tsx
// src/lib/validation.ts

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 */
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

/**
 * Validates phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
}
```

### Date Utilities

```tsx
// src/lib/date.ts
import { format, formatDistance, parseISO } from 'date-fns';

/**
 * Formats a date to readable string
 */
export function formatDate(date: Date | string, formatStr: string = 'PPP'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Gets relative time from now (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

/**
 * Checks if date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}
```

---

## Avoiding Over-Abstraction

### When NOT to Create a Utility

❌ **Bad: Over-abstracted**

```tsx
// src/lib/textUtils.ts
export function getFirstName(fullName: string): string {
  return fullName.split(' ')[0];
}

export function getLastName(fullName: string): string {
  const parts = fullName.split(' ');
  return parts[parts.length - 1];
}

// Used only once in the entire app
```

✅ **Good: Inline where needed**

```tsx
// In the component where it's used
const firstName = user.name.split(' ')[0];
const lastName = user.name.split(' ').pop();
```

### When TO Create a Utility

✅ **Good: Reusable logic**

```tsx
// src/lib/currency.ts
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Used in 10+ places across the app
```

### Rules for Utilities

1. **Used multiple**: If logic is large complex & used in multiple places, extract it
2. **Testable**: If it needs unit tests, it should be a utility
3. **Pure functions**: Utilities should be pure functions when possible

---

## Hook Best Practices

### DO's

✅ **Use descriptive names**

```tsx
// Good
export function useUserProfile(userId: string) {}
export function useDebouncedSearch() {}

// Bad
export function useData() {}
export function useHook() {}
```

✅ **Return consistent shapes**

```tsx
// Good: Consistent return object
export function useAsync<T>(fn: () => Promise<T>) {
  return {
    data,
    loading,
    error,
    refetch,
  };
}
```

✅ **Document parameters and return values**

```tsx
/**
 * Hook for managing form state
 * @param initialValues - Initial form values
 * @returns Form state and methods
 */
export function useForm<T>(initialValues: T) {
  // Implementation
}
```

### DON'Ts

❌ **Don't create hooks for everything**

```tsx
// Bad: Over-abstracted
export function useSetState(value: any) {
  const [state, setState] = useState(value);
  return [state, setState];
}

// Just use useState directly
```

❌ **Don't mix concerns**

```tsx
// Bad: Hook does too many things
export function useUserDashboard() {
  // Fetches user
  // Fetches posts
  // Handles navigation
  // Manages form state
  // ...
}

// Split into focused hooks
export function useUser() {}
export function usePosts() {}
```

---

## Do's and Don'ts

### Do's

- ✅ Place global hooks in `src/hooks/`
- ✅ Place feature hooks in `src/features/[name]/hooks/`
- ✅ Create utilities for logic used 3+ times
- ✅ Write JSDoc comments for hooks and utilities
- ✅ Use TypeScript for type safety
- ✅ Keep hooks focused on one concern
- ✅ Return consistent shapes from hooks
- ✅ Test complex hooks and utilities

### Don'ts

- ❌ Don't create utilities for one-time use
- ❌ Don't mix multiple concerns in one hook
- ❌ Don't over-abstract simple logic
- ❌ Don't forget to document hook parameters
- ❌ Don't create hooks that just wrap one line of code
- ❌ Don't duplicate utility logic across features
- ❌ Don't forget to cleanup effects in hooks
- ❌ Don't make hooks do too much
