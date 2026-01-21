# 14. Final Recommended Architecture

## Overview

This section presents the complete recommended architecture for a scalable, maintainable React Native application, consolidating all patterns and decisions from previous sections.

---

## Complete Folder Structure

```
expo-template/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/                   # Auth route group
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── home.tsx
│   │   ├── profile.tsx
│   │   ├── settings.tsx
│   │   └── _layout.tsx
│   ├── users/
│   │   └── [id].tsx              # Dynamic route
│   ├── _layout.tsx               # Root layout with providers
│   └── index.tsx                 # Entry/redirect
│
├── src/
│   ├── components/
│   │   ├── ui/                   # UI Primitives (atoms/molecules)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Text.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── index.ts          # Barrel export
│   │   └── shared/               # Shared organisms (multi-feature)
│   │       ├── Header.tsx
│   │       ├── TabBar.tsx
│   │       ├── EmptyState.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── features/                 # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── PasswordInput.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useLogin.ts
│   │   │   │   ├── useRegister.ts
│   │   │   │   └── index.ts
│   │   │   ├── schemas/
│   │   │   │   └── auth.schema.ts # Zod validation schemas
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   ├── store/
│   │   │   │   └── authStore.ts
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts  # All types in one file
│   │   │   └── index.ts          # Public API
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── UserList.tsx
│   │   │   │   ├── UserCard.tsx
│   │   │   │   └── UserAvatar.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useUsers.ts
│   │   │   │   ├── useUser.ts
│   │   │   │   ├── useCreateUser.ts
│   │   │   │   └── index.ts
│   │   │   ├── schemas/
│   │   │   │   └── user.schema.ts # Zod validation schemas
│   │   │   ├── services/
│   │   │   │   └── userService.ts
│   │   │   ├── types/
│   │   │   │   └── user.types.ts  # All types in one file
│   │   │   └── index.ts
│   │   └── products/
│   │       └── ... (similar structure)
│   │
│   ├── hooks/                    # Global shared hooks
│   │   ├── useDebounce.ts
│   │   ├── useKeyboard.ts
│   │   ├── useResponsive.ts
│   │   ├── useNetworkStatus.ts
│   │   └── index.ts
│   │
│   ├── services/                 # Global services
│   │   ├── api/
│   │   │   ├── client.ts         # Axios instance with auth header
│   │   │   └── index.ts
│   │   └── storage/
│   │       ├── storage.ts        # AsyncStorage wrapper
│   │       ├── secureStorage.ts  # Secure storage wrapper
│   │       └── index.ts
│   │
│   ├── providers/                # Context providers
│   │   ├── ThemeProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── index.ts
│   │
│   ├── constants/                # App-wide constants
│   │   ├── routes.ts             # Navigation route names
│   │   ├── api.ts                # API endpoint URLs
│   │   ├── strings.ts            # UI strings
│   │   ├── storage-keys.ts       # Storage keys
│   │   ├── query-keys.ts         # React Query keys
│   │   └── index.ts
│   │
│   ├── lib/                      # Utilities and helpers
│   │   ├── utils.ts              # cn() and general utils
│   │   ├── validation.ts
│   │   ├── date.ts
│   │   └── index.ts
│   │
│   ├── types/                    # Global shared types
│   │   ├── common.ts
│   │   ├── api.ts
│   │   ├── navigation.ts
│   │   └── index.ts
│   │
│   └── config/                   # App configuration
│       ├── env.ts
│       └── featureFlags.ts
│
├── assets/
│   ├── fonts/
│   │   ├── Inter-Regular.ttf
│   │   ├── Inter-Medium.ttf
│   │   ├── Inter-SemiBold.ttf
│   │   └── Inter-Bold.ttf
│   ├── images/
│   │   ├── logo.png
│   │   ├── logo@2x.png
│   │   ├── logo@3x.png
│   │   └── placeholders/
│   └── icons/
│
├── guidelines/                   # This documentation
│
├── .env.example
├── .env.development
├── .env.staging
├── .env.production
├── .gitignore
├── app.json
├── babel.config.js
├── global.css                    # NativeWind theme
├── metro.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Architecture Stack

### Core Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React Native + Expo | Cross-platform mobile development |
| **Routing** | Expo Router | File-based navigation |
| **Language** | TypeScript | Type safety |
| **Styling** | NativeWind | Tailwind CSS for RN |
| **Server State** | React Query | API data fetching & caching |
| **Client State** | Zustand | UI/local state management |
| **HTTP Client** | Axios | API communication |
| **Storage** | AsyncStorage + Expo SecureStore | Data persistence |

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────┐
│                    Screen                        │
│               (app/home.tsx)                     │
│              - Thin, delegates to                │
│                feature components                │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────┐
│              Feature Component                   │
│           (src/features/users/)                  │
│          - Uses hooks for logic                  │
│          - Renders UI primitives                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────┐
│                 Hooks Layer                      │
│       (useUsers, useAuth, useDebounce)          │
│     - React Query for server state               │
│     - Zustand for client state                   │
│     - Custom hooks for logic                     │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────┐
│               Services Layer                     │
│          (authService, userService)              │
│        - API calls via Axios client              │
│        - Returns typed data directly             │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────┐
│                 API Layer                        │
│                 (apiClient)                      │
│       - HTTP client configuration                │
│       - Auth token injection                     │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
                 Backend
```

---

## Feature Module Pattern

### Complete Feature Structure

```
src/features/users/
├── components/           # Feature UI components
│   ├── UserList.tsx
│   ├── UserCard.tsx
│   └── CreateUserForm.tsx
│
├── hooks/                # Feature hooks
│   ├── useUsers.ts       # React Query: list users
│   ├── useUser.ts        # React Query: single user
│   ├── useCreateUser.ts  # React Query: create mutation
│   ├── useDeleteUser.ts  # React Query: delete mutation
│   └── index.ts
│
├── schemas/              # Zod validation schemas
│   └── user.schema.ts    # Form validation schemas
│
├── services/             # API communication
│   └── userService.ts    # API calls (NOT exported)
│
├── store/                # Local state (if needed)
│   └── userFilterStore.ts
│
├── types/                # Feature types (one file)
│   └── user.types.ts     # Entity + Request/Response types
│
└── index.ts              # Public API (hooks, components, types)
```

### Feature Public API

```tsx
// src/features/users/index.ts
// ONLY export what other features need

// Hooks
export { useUsers, useUser, useCreateUser, useDeleteUser } from './hooks';

// Components (only public ones)
export { UserList, UserCard } from './components';

// Types
export type { User, CreateUserRequest, UpdateUserRequest } from './types/user.types';

// DON'T export:
// - services (internal)
// - store (internal)
```

---

## API Client Setup

```tsx
// src/services/api/client.ts
import axios from 'axios';
import { ENV } from '@/config/env';
import { useAuthStore } from '@/features/auth/store/authStore';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Example: Complete Feature Implementation

### 1. Types

```tsx
// src/features/users/types/user.types.ts

// Entity
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  createdAt: string;
}

// Request types
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Response types (if different from entity)
export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
}
```

### 2. Services

```tsx
// src/features/users/services/userService.ts
import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import type { User, CreateUserRequest } from '../types/user.types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
    return data;  // No mapper, use directly
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(id));
    return data;
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    const { data } = await apiClient.post<User>(API_ENDPOINTS.USERS.LIST, userData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DETAIL(id));
  },
};
```

### 3. Hooks

```tsx
// src/features/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { userService } from '../services/userService';

export function useUsers() {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: userService.getAll,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
}
```

### 4. Components

```tsx
// src/features/users/components/UserList.tsx
import { FlatList } from 'react-native';
import { useUsers } from '../hooks/useUsers';
import { UserCard } from './UserCard';
import { EmptyState, LoadingSpinner } from '@/components/shared';
import { STRINGS } from '@/constants/strings';

export function UserList() {
  const { data: users, isLoading, error, refetch } = useUsers();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <EmptyState
        title={STRINGS.ERRORS.GENERIC}
        actionLabel={STRINGS.COMMON.RETRY}
        onAction={refetch}
      />
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <UserCard user={item} />}
    />
  );
}
```

### 5. Screen

```tsx
// app/(tabs)/users.tsx
import { View } from 'react-native';
import { UserList } from '@/features/users';
import { Text } from '@/components/ui';

export default function UsersScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-4">
        <Text variant="h1">Users</Text>
      </View>
      <UserList />
    </View>
  );
}
```

---

## Naming Conventions Quick Reference

| Element | Convention | Example |
|---------|------------|---------|
| **Folders** | kebab-case | `user-profile/` |
| **Screen files** | kebab-case.tsx | `user-profile.tsx` |
| **Component files** | PascalCase.tsx | `Button.tsx` |
| **Hook files** | camelCase.ts | `useAuth.ts` |
| **Type files** | camelCase.types.ts | `user.types.ts` |
| **Components** | PascalCase | `function Button()` |
| **Hooks** | use + PascalCase | `useAuth()` |
| **Variables** | camelCase | `const userName` |
| **Booleans** | is/has/should prefix | `isLoading` |
| **Constants** | SCREAMING_SNAKE_CASE | `API_ENDPOINTS` |
| **Entities** | PascalCase | `User` |
| **Request types** | PascalCase + Request | `CreateUserRequest` |
| **Response types** | PascalCase + Response | `UsersListResponse` |
| **Services** | camelCase + Service | `userService` |
| **Stores** | use + Name + Store | `useAuthStore` |

---

## Environment & Configuration

### File Structure

```
project-root/
├── .env.example          # Template (commit this)
├── .env.development      # Dev config
├── .env.staging          # Staging config
├── .env.production       # Production config
└── src/config/
    ├── env.ts            # Type-safe env access
    └── featureFlags.ts   # Feature toggles
```

### Type-Safe Config

```tsx
// src/config/env.ts
import Constants from 'expo-constants';

export const ENV = {
  API_URL: Constants.expoConfig?.extra?.apiUrl,
  ENVIRONMENT: Constants.expoConfig?.extra?.environment,
} as const;
```

### Storage Keys

```tsx
// src/constants/storage-keys.ts
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
} as const;
```

**Rule:** Sensitive data (tokens, keys) → `expo-secure-store`. Preferences → `AsyncStorage`.

---

## Forms & Validation

### Stack: React Hook Form + Zod

```tsx
// src/features/auth/schemas/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
```

### Form Component Pattern

```tsx
// src/features/auth/components/LoginForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/auth.schema';

export function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <Controller
      control={control}
      name="email"
      render={({ field: { onChange, value } }) => (
        <Input value={value} onChangeText={onChange} error={errors.email?.message} />
      )}
    />
  );
}
```

### Schema Location

| Scope | Location |
|-------|----------|
| Feature-specific | `src/features/[name]/schemas/` |
| Reusable validators | `src/lib/validation.ts` |

---

## Assets Organization

```
assets/
├── fonts/
│   ├── Inter-Regular.ttf
│   ├── Inter-Medium.ttf
│   ├── Inter-SemiBold.ttf
│   └── Inter-Bold.ttf
├── images/
│   ├── logo.png
│   ├── logo@2x.png         # Always provide @2x, @3x
│   ├── logo@3x.png
│   └── placeholders/
└── icons/
```

### Asset Constants

```tsx
// src/constants/assets.ts
export const IMAGES = {
  logo: require('@/assets/images/logo.png'),
  placeholders: {
    avatar: require('@/assets/images/placeholders/avatar.png'),
  },
} as const;
```

**Rules:**
- Always provide @2x and @3x image variants
- Use `expo-image` for better performance
- Compress images before adding to project

---

## Barrel Exports

### When to Use

✅ **Use barrels for:**
- UI component libraries (`src/components/ui/index.ts`)
- Feature public APIs (`src/features/auth/index.ts`)
- Constants (`src/constants/index.ts`)

❌ **Don't use barrels for:**
- Screens/routes
- Large directories (50+ files)
- Chaining barrels (barrel → barrel)

### Pattern

```tsx
// src/features/auth/index.ts - Public API only
export { useAuth, useLogin } from './hooks';
export { LoginForm } from './components';
export type { User, AuthState } from './types/auth.types';

// DON'T export: services, internal components
```

### Named Exports (Not `export *`)

```tsx
// ✅ Good - enables tree-shaking
export { Button } from './Button';
export { Input } from './Input';

// ❌ Bad - hurts tree-shaking
export * from './Button';
export * from './Input';
```

---

## Key Architecture Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Folder Structure** | Feature-based + Atomic UI | Scalability + Reusability |
| **Server State** | React Query | Caching, performance, DX |
| **Client State** | Zustand | Simple, performant, no boilerplate |
| **Styling** | NativeWind | Tailwind CSS, great DX |
| **UI Components** | Custom primitives | Full control, minimal bundle |
| **API Layer** | Services | Separation of concerns |
| **Type System** | One types file per feature | Simplicity, less boilerplate |
| **Navigation** | Expo Router | File-based, modern |

---

## Do's and Don'ts

### Architecture Do's

- ✅ Keep screens thin (delegate to feature components)
- ✅ Use feature modules for business domains
- ✅ Separate UI primitives from feature components
- ✅ Use React Query for server state
- ✅ Use Zustand for client state
- ✅ Create service layers for API calls
- ✅ Use one types file per feature (entity + request/response types)
- ✅ Export only public APIs from features
- ✅ Co-locate related code

### Architecture Don'ts

- ❌ Don't put business logic in screens
- ❌ Don't import between features directly
- ❌ Don't mix server and client state
- ❌ Don't put API calls in components
- ❌ Don't create separate DTO and mapper files
- ❌ Don't create deep nesting (max 3-4 levels)
- ❌ Don't over-abstract too early
- ❌ Don't mix styling approaches
