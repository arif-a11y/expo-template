# 2. State Management Strategy

## Overview

State management in React Native applications falls into three categories:

| State Type | Description | Recommended Tool |
|------------|-------------|------------------|
| **Server State** | Data from APIs (async, cached) | React Query |
| **Client State** | UI state, preferences | Zustand |
| **Form State** | Input validation, submission | React Hook Form + Zod |
| **Local State** | Component-specific | `useState` / `useReducer` |

---

## Server State: React Query vs RTK Query

### Comparison Table

| Criteria | React Query | RTK Query |
|----------|-------------|-----------|
| Bundle Size | ~12KB | ~30KB+ |
| Offline Support | Excellent | Good |
| Learning Curve | Lower | Higher |
| Caching | Fine-grained | Tag-based |
| DevTools | Dedicated | Redux DevTools |
| Boilerplate | Minimal | More |

### Recommendation: React Query

Better offline support, lighter bundle, simpler API.

```tsx
// src/features/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { QUERY_KEYS } from '@/constants/query-keys';

export function useUsers() {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] }),
  });
}
```

```tsx
// src/features/users/services/userService.ts
import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import type { User, CreateUserRequest } from '../types/user.types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.USERS.LIST);
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(API_ENDPOINTS.USERS.DETAIL(id));
    return data;
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    const { data } = await apiClient.post(API_ENDPOINTS.USERS.LIST, userData);
    return data;
  },
};
```

### When to Use RTK Query

- Already using Redux Toolkit
- Need complex middleware (sagas, thunks)
- Team experienced with Redux
- Need OpenAPI code generation

---

## Client State: Zustand

~1KB bundle, simple API, modern approach.

### Global vs Feature Stores

**When to use `src/store/` (Global Store):**
- State used across multiple unrelated features
- App-wide configuration (language, theme, notifications)
- Cross-cutting concerns (network status, app lifecycle)

**When to use `src/features/[name]/store/` (Feature Store):**
- State specific to one feature domain
- Only accessed within feature boundaries
- Can be removed with the feature

**Decision Table:**

| State Example | Location | Reasoning |
|--------------|----------|-----------|
| Auth token, user session | `src/store/authStore.ts` | Used across entire app |
| App language preference | `src/store/appStore.ts` | Global configuration |
| Network connectivity status | `src/store/networkStore.ts` | Cross-cutting concern |
| User list filters | `src/features/users/store/` | Only used in users feature |
| Shopping cart items | `src/features/cart/store/` | Only used in cart feature |
| UI drawer open/closed | `src/features/navigation/store/` | Feature-specific UI state |

### Global Store Example

```tsx
// src/store/appStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

interface AppState {
  language: 'en' | 'es' | 'fr';
  isOnboarded: boolean;
  notificationsEnabled: boolean;
  setLanguage: (language: AppState['language']) => void;
  completeOnboarding: () => void;
  toggleNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      isOnboarded: false,
      notificationsEnabled: true,
      setLanguage: (language) => set({ language }),
      completeOnboarding: () => set({ isOnboarded: true }),
      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
    }),
    {
      name: STORAGE_KEYS.APP_STATE,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Feature Store Example

```tsx
// src/features/ui/store/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isMenuOpen: boolean;
  activeTab: string;
  toggleMenu: () => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  activeTab: 'home',
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
```

### Persisted Store

```tsx
// src/features/settings/store/settingsStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  setTheme: (theme: SettingsState['theme']) => void;
  setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Selective Subscriptions (Performance)

```tsx
// ✅ Good - only re-renders when count changes
function Counter() {
  const count = useUIStore((state) => state.count);
  return <Text>{count}</Text>;
}

// ❌ Bad - re-renders on any state change
function Counter() {
  const store = useUIStore();
  return <Text>{store.count}</Text>;
}
```

---

## Zustand vs Redux Toolkit

| Criteria | Zustand | Redux Toolkit |
|----------|---------|---------------|
| Bundle Size | ~1KB | ~15KB |
| Boilerplate | Minimal | Moderate |
| DevTools | Via middleware | Built-in |
| Middleware | Basic | Powerful |
| Learning Curve | Easy | Moderate |

**Choose Zustand:** Simple state, small bundle, minimal boilerplate

**Choose Redux Toolkit:** Complex state, powerful middleware, DevTools required

---

## Form State: React Hook Form + Zod

```tsx
// src/features/auth/components/LoginForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { STRINGS } from '@/constants/strings';

//just an example use schema file
const loginSchema = z.object({
  email: z.string().email(STRINGS.ERRORS.INVALID_EMAIL),
  password: z.string().min(8, STRINGS.ERRORS.PASSWORD_MIN_LENGTH),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // Handle login
  };

  return (
    <View>
      <Text className="text-2xl font-bold">{STRINGS.AUTH.LOGIN_TITLE}</Text>
      <Text className="text-muted-foreground">{STRINGS.AUTH.LOGIN_SUBTITLE}</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder={STRINGS.AUTH.EMAIL_PLACEHOLDER}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
            secureTextEntry
          />
        )}
      />

      <Button onPress={handleSubmit(onSubmit)}>
        <Text>{STRINGS.AUTH.LOGIN_BUTTON}</Text>
      </Button>
    </View>
  );
}
```

---

## Decision Flowchart

```
Is it server data (API)?
├── YES → React Query
└── NO → Is it shared across components?
         ├── YES → Zustand
         └── NO → Is it form data?
                  ├── YES → React Hook Form
                  └── NO → useState/useReducer
```

---

## Provider Setup

```tsx
// src/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

## Constants for State Management

Add these to your constants folder:

```tsx
// src/constants/query-keys.ts
export const QUERY_KEYS = {
  USERS: 'users',
  USER_DETAIL: 'user-detail',
  POSTS: 'posts',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
} as const;
```

```tsx
// src/constants/storage-keys.ts
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;
```

---

## Anti-Patterns

### ❌ Storing Server Data in Zustand

```tsx
// ❌ Bad
const useStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const users = await api.getUsers();
    set({ users });
  },
}));

// ✅ Good - use React Query
const useUsers = () => useQuery({
  queryKey: [QUERY_KEYS.USERS],
  queryFn: api.getUsers
});
```

### ❌ Hardcoding Strings

```tsx
// ❌ Bad
<Text>Welcome Back</Text>
<Input placeholder="Email address" />

// ✅ Good - use constants
<Text>{STRINGS.AUTH.LOGIN_TITLE}</Text>
<Input placeholder={STRINGS.AUTH.EMAIL_PLACEHOLDER} />
```

### ❌ Hardcoding Storage Keys

```tsx
// ❌ Bad
await AsyncStorage.setItem('auth_token', token);

// ✅ Good - use constants
await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
```

### ❌ Over-globalizing State

```tsx
// ❌ Bad - modal state doesn't need to be global
const useStore = create((set) => ({
  isDeleteModalOpen: false,
}));

// ✅ Good - keep it local
function ItemList() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
}
```

---

## Do's and Don'ts

### Do's
- Use React Query for all API data
- Use Zustand for shared UI state
- Use selective subscriptions in Zustand
- Import all strings from `@/constants/strings`
- Import all storage keys from `@/constants/storage-keys`
- Import all API endpoints from `@/constants/api`

### Don'ts
- Don't duplicate server state in global state
- Don't use global state for form data
- Don't store derived/computed values
- Don't hardcode strings, API URLs, or storage keys
- Don't persist sensitive data without encryption
