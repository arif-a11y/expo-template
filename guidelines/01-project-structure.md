# 1. Project Architecture & Folder Structure

## Overview

This guide covers folder organization strategies for scalable React Native applications. The recommended approach is a **Feature-based + Atomic Design hybrid** that balances modularity with shared UI primitives.

---

## Architecture Comparison

### Feature-Based Architecture

Organizes code by business domain/feature.

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── profile/
│   └── settings/
```

**Pros:**
- High cohesion - related code lives together
- Easy to understand feature boundaries
- Facilitates team ownership of features
- Easier to remove/refactor entire features
- Scales well with team size

**Cons:**
- Can lead to code duplication across features
- Shared utilities need careful placement
- May have unclear boundaries for cross-cutting concerns

**Best for:** Medium-to-large apps, multiple developers, domain-driven design

---

### Layer-Based Architecture

Organizes code by technical responsibility.

```
src/
├── components/
├── screens/
├── services/
├── hooks/
├── utils/
└── types/
```

**Pros:**
- Simple and familiar structure
- Easy to find code by type
- Works well for small teams
- Less initial setup

**Cons:**
- Becomes unwieldy as app grows
- Related code scattered across folders
- Harder to understand feature boundaries
- Difficult to remove features cleanly

**Best for:** Small apps, solo developers, rapid prototypes

---

### Atomic Design

Organizes UI components by complexity level.

```
src/
├── components/
│   ├── atoms/       # Button, Text, Icon
│   ├── molecules/   # SearchInput, Card
│   ├── organisms/   # Header, UserProfile
│   ├── templates/   # PageLayout, AuthLayout
│   └── pages/       # HomeScreen, ProfileScreen
```

**Pros:**
- Clear component hierarchy
- Encourages reusability
- Design system friendly
- Consistent component abstraction levels

**Cons:**
- Subjective categorization (is this a molecule or organism?)
- Doesn't address non-UI code
- Can feel over-engineered for simple apps
- Extra cognitive load for categorization

**Best for:** Design system development, large UI component libraries

---

## Recommended: Hybrid Approach

Combines feature-based organization with atomic UI primitives.

```
project-root/
├── app/                          # Expo Router - file-based routing
│   ├── (auth)/                   # Auth route group
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── home.tsx
│   │   ├── profile.tsx
│   │   └── _layout.tsx
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry redirect
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Atomic primitives (atoms/molecules)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Text.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts          # Barrel export
│   │   └── shared/               # Shared organisms (multi-feature)
│   │       ├── Header.tsx
│   │       ├── TabBar.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── features/                 # Feature modules
│   │   ├── auth/
│   │   │   ├── components/       # Feature-specific components
│   │   │   ├── hooks/            # Feature-specific hooks
│   │   │   ├── schemas/          # Zod validation schemas
│   │   │   ├── services/         # API calls for feature
│   │   │   ├── store/            # Feature state (Zustand slice)
│   │   │   ├── types/            # Feature types
│   │   │   └── index.ts          # Public API
│   │   ├── profile/
│   │   └── settings/
│   │
│   ├── hooks/                    # Global shared hooks
│   │   ├── useDebounce.ts
│   │   └── useKeyboard.ts
│   │
│   ├── services/                 # Global services
│   │   ├── api/
│   │   │   ├── client.ts         # Axios/fetch instance
│   │   │   └── interceptors.ts
│   │   └── storage/
│   │       └── secureStorage.ts
│   │
│   ├── store/                    # Global state (Zustand)
│   │   ├── appStore.ts           # App-wide settings
│   │   └── authStore.ts          # Auth state (if global)
│   │
│   ├── providers/                # Context providers
│   │   ├── ThemeProvider.tsx
│   │   ├── AuthProvider.tsx
│   │   └── QueryProvider.tsx
│   │
│   ├── constants/                # App-wide constants
│   │   ├── routes.ts             # Navigation route names
│   │   ├── api.ts                # API endpoint URLs
│   │   ├── strings.ts            # UI strings (labels, messages)
│   │   └── storage-keys.ts       # Secure storage keys
│   │
│   ├── lib/                      # Utilities and helpers
│   │   ├── utils.ts              # cn() and general utils
│   │   └── validation.ts
│   │
│   ├── types/                    # Global shared types
│   │   ├── api.ts
│   │   ├── navigation.ts
│   │   └── common.ts
│   │
│   └── config/                   # App configuration
│       ├── env.ts
│       └── featureFlags.ts
│
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
│
├── __tests__/                    # Test files (mirror src structure)
│
├── app.json
├── tailwind.config.js
├── global.css
├── tsconfig.json
└── package.json
```

---

## Folder Responsibilities

### `app/` - Expo Router Screens

File-based routing. Each file becomes a route.

```tsx
// app/(tabs)/home.tsx
export default function HomeScreen() {
  return <HomeFeature />;
}
```

**Rules:**
- Keep screens thin - delegate to feature components
- Use route groups `(groupName)/` for shared layouts
- `_layout.tsx` for navigation configuration

---

### `src/components/ui/` - UI Primitives

Reusable, stateless building blocks.

```tsx
// src/components/ui/Button.tsx
export function Button({ variant, size, children, ...props }) {
  return (
    <Pressable className={cn(styles.base, styles.variants[variant])}>
      {children}
    </Pressable>
  );
}
```

**Rules:**
- No business logic
- Fully controlled via props
- Themeable via design tokens
- Export from barrel file

---

### `src/components/shared/` - Shared Organisms

Complex components used across multiple features.

```tsx
// src/components/shared/Header.tsx
export function Header({ title, showBack, onBack }) {
  // May use UI primitives + some layout logic
}
```

**Rules:**
- Composed from UI primitives
- May have limited internal state (UI only)
- No feature-specific business logic

---

### `src/features/` - Feature Modules

Self-contained business domains.

```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── hooks/
│   ├── useLogin.ts
│   └── useAuth.ts
├── schemas/
│   └── auth.schema.ts    # Zod validation schemas
├── services/
│   └── authService.ts
├── store/
│   └── authStore.tsx
├── types/
│   └── auth.types.ts
└── index.ts              # Public exports
```

**Rules:**
- Each feature is a mini-application
- Features must be isolated. Direct imports between feature modules are not allowed. Shared logic must live in shared layers (components, hooks, services, lib, or types).
- Expose public API via `index.ts`
- Private implementation details stay internal

---

### `src/hooks/` - Global Hooks

Shared hooks used across multiple features.

```tsx
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  // ...
}
```

**Rules:**
- Generic, reusable functionality
- No feature-specific logic
- Well-documented with examples

---

### `src/services/` - Global Services

Shared infrastructure code.

```tsx
// src/services/api/client.ts
export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
});
```

**Rules:**
- API client configuration
- Storage utilities
- Third-party integrations

---

### `src/store/` - Global State

Zustand stores for app-wide client state.

```tsx
// src/store/appStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  language: 'en' | 'es' | 'fr';
  isOnboarded: boolean;
  setLanguage: (language: AppState['language']) => void;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      isOnboarded: false,
      setLanguage: (language) => set({ language }),
      completeOnboarding: () => set({ isOnboarded: true }),
    }),
    {
      name: 'app-state',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

**Rules:**
- App-wide configuration (language, theme, notifications)
- Cross-cutting concerns (network status, app lifecycle)
- Feature-specific state goes in `src/features/[name]/store/`

**See:** File 02-state-management.md for Global vs Feature store decision matrix

---

### `src/lib/` - Utilities

Pure functions and helpers.

```tsx
// src/lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Rules:**
- No React hooks (put those in `hooks/`)
- Pure functions preferred
- Well-tested utilities

---

### `src/constants/` - App-Wide Constants

Centralized location for all magic strings and constant values.

```tsx
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/(tabs)/home',
  PROFILE: '/(tabs)/profile',
  SETTINGS: '/settings',
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
} as const;
```

```tsx
// src/constants/api.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
  },
} as const;
```

```tsx
// src/constants/strings.ts
export const STRINGS = {
  AUTH: {
    LOGIN_TITLE: 'Welcome Back',
    LOGIN_SUBTITLE: 'Sign in to continue',
    EMAIL_PLACEHOLDER: 'Email address',
    PASSWORD_PLACEHOLDER: 'Password',
    LOGIN_BUTTON: 'Sign In',
    REGISTER_LINK: "Don't have an account? Sign up",
  },
  ERRORS: {
    NETWORK: 'Network error. Please check your connection.',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
    GENERIC: 'Something went wrong. Please try again.',
  },
  COMMON: {
    LOADING: 'Loading...',
    RETRY: 'Retry',
    CANCEL: 'Cancel',
    SAVE: 'Save',
    DELETE: 'Delete',
    CONFIRM: 'Confirm',
  },
} as const;
```

```tsx
// src/constants/storage-keys.ts
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;
```

**Rules:**
- Use `as const` for type safety
- Group related constants in nested objects
- Use SCREAMING_SNAKE_CASE for top-level exports
- Never hardcode strings in components - import from here

---

## Decision Table: Where Does Code Go?

| Code Type | Location | Example |
|-----------|----------|---------|
| Route/Screen | `app/` | `app/(tabs)/home.tsx` |
| Primitive UI | `src/components/ui/` | Button, Input, Text |
| Shared layout | `src/components/shared/` | Header, Footer |
| Feature-specific UI | `src/features/[name]/components/` | LoginForm |
| API calls | `src/features/[name]/services/` | `authService.ts` |
| Global API setup | `src/services/api/` | `client.ts` |
| Global hooks | `src/hooks/` | `useDebounce.ts` |
| Feature hooks | `src/features/[name]/hooks/` | `useAuth.ts` |
| Validation schemas | `src/features/[name]/schemas/` | `auth.schema.ts` |
| Global state | `src/store/` | `appStore.ts` |
| Feature state | `src/features/[name]/store/` | `authStore.ts` |
| Global types | `src/types/` | `api.ts`, `common.ts` |
| Feature types | `src/features/[name]/types/` | `auth.types.ts` |
| Utilities | `src/lib/` | `utils.ts`, `validation.ts` |
| Route Names | `src/constants/routes.ts` | Navigation route constants |
| API URLs | `src/constants/api.ts` | Endpoint URL constants |
| UI Strings | `src/constants/strings.ts` | Labels, messages, errors |
| Storage Keys | `src/constants/storage-keys.ts` | AsyncStorage/SecureStore keys |
| Config | `src/config/` | `env.ts`, `featureFlags.ts` |

---

## When to Create a New Feature Module

Create a new feature when:
- Code represents a distinct business domain
- Multiple screens/components are related
- Feature has its own API endpoints
- Feature could theoretically be removed independently

Don't create a feature for:
- Single utility components
- One-off screens without much logic
- Cross-cutting concerns (use `shared/` or `hooks/`)

---

## Do's and Don'ts

### Do's

- Keep feature modules self-contained
- Use barrel exports for clean imports
- Mirror folder structure in tests
- Document folder purposes in README
- Use path aliases (`@/`, `@components/`)

### Don'ts

- Don't import between feature modules directly
- Don't put business logic in UI primitives
- Don't create deep nesting (max 3-4 levels)
- Don't mix concerns in a single file
- Don't create folders for single files
