# 5. Types & Contracts

## Overview

This section defines TypeScript best practices for React Native applications, covering type organization, API contracts, and naming conventions.

---

## Where TypeScript Types Should Live

### Decision Matrix: Type Location

| Type Category | Location | Example |
|---------------|----------|---------|
| **Feature-specific types** | `src/features/[feature]/types/` | `src/features/auth/types/auth.types.ts` |
| **Global shared types** | `src/types/` | `src/types/common.ts`, `src/types/api.ts` |
| **Component prop types** | Co-located with component | In same file as component |
| **Navigation types** | `src/types/navigation.ts` | Screen params, route names |
| **Store types** | Co-located with store | `src/features/auth/store/authStore.ts` |

---

## Feature-Scoped Types vs Shared/Global Types

### Feature-Scoped Types

Types that belong to a specific business domain should live within the feature folder. **One types file per feature** containing the entity plus any request/response types.

```tsx
// src/features/auth/types/auth.types.ts

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
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Response types (if different from entity)
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// State types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**When to use:**
- Types specific to one feature
- Domain models for a business concept
- Request/response types for API calls
- Feature-specific enums or unions
- Internal feature state shapes

---

### Shared/Global Types

Types used across multiple features should live in `src/types/`.

```tsx
// src/types/common.ts
export type ID = string;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Timestamp = string; // ISO 8601

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;      // User-friendly message from backend
  code: string;         // Error code (e.g., "EMAIL_TAKEN")
  statusCode: number;   // HTTP status
  field?: string;       // Which form field caused error (optional)
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T, E = ApiError> {
  data: T | null;
  status: AsyncStatus;
  error: E | null;
}
```

```tsx
// src/types/api.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

**When to use:**
- Utility types used across features
- API response wrappers
- Common data structures
- Navigation types
- Global configuration types

---

## Types File Pattern

### One Types File Per Feature

Each feature has a single `*.types.ts` file containing all related types: entity, request types, and response types.

```tsx
// src/features/users/types/user.types.ts

// Entity
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

// Request types
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

### Naming Convention

| Type | Convention | Example |
|------|------------|---------|
| Entity | PascalCase | `User` |
| Create payload | PascalCase + Request | `CreateUserRequest` |
| Update payload | PascalCase + Request | `UpdateUserRequest` |
| List response | PascalCase + Response | `UsersListResponse` |

### Service Example (Direct Usage)

Services use types directly - no mapping layer needed when API returns camelCase.

```tsx
// src/features/users/services/userService.ts
import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import type { User, CreateUserRequest } from '../types/user.types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
    return data;  // Use directly, no mapping
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(id));
    return data;
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    const { data } = await apiClient.post<User>(API_ENDPOINTS.USERS.LIST, userData);
    return data;
  },
};
```

---

## Naming Conventions for Types and Interfaces

### General Rules

```tsx
// ✅ Good: PascalCase for types and interfaces
export interface User {}
export type UserId = string;
export type UserRole = 'admin' | 'user' | 'guest';

// ❌ Bad: camelCase or snake_case
export interface user {}
export type user_id = string;
```

### Suffixes and Prefixes

| Pattern | Usage | Example |
|---------|-------|---------|
| `*Request` | API request payloads | `CreateUserRequest`, `LoginRequest` |
| `*Response` | API responses (if different from entity) | `AuthResponse`, `UsersListResponse` |
| `*Props` | Component props | `ButtonProps`, `UserCardProps` |
| `*State` | State shape | `AuthState`, `FormState<T>` |
| `*Config` | Configuration objects | `ApiConfig`, `ThemeConfig` |
| `*Options` | Function options | `FetchOptions`, `QueryOptions` |
| `I*` prefix | ❌ **Don't use** - unnecessary in TS | ~~`IUser`~~ → `User` |

### Naming Examples

```tsx
// Entities
export interface User {}
export interface Product {}
export interface Order {}

// Request Types
export interface CreateUserRequest {}
export interface UpdateUserRequest {}
export interface LoginRequest {}

// Response Types
export interface AuthResponse {}
export interface UsersListResponse {}

// Component Props
export interface ButtonProps {}
export interface UserCardProps {}
export interface FormInputProps {}

// State
export interface AuthState {}
export interface FormState<T> {}
export interface AsyncState<T> {}

// Config
export interface ApiConfig {}
export interface ThemeConfig {}
export interface AppConfig {}

// Utility Types
export type UserId = string;
export type Nullable<T> = T | null;
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
```

---

## Type vs Interface

### When to Use Each

| Use Case | Type | Interface |
|----------|------|-----------|
| Object shapes | ✅ Either | ✅ Either |
| Extending/merging | ❌ No | ✅ Yes |
| Unions | ✅ Yes | ❌ No |
| Tuples | ✅ Yes | ❌ No |
| Primitives | ✅ Yes | ❌ No |
| Function signatures | ✅ Either | ✅ Either |

### Practical Guidelines

```tsx
// ✅ Use interface for object shapes (can be extended)
export interface User {
  id: string;
  name: string;
}

// ✅ Use type for unions
export type UserRole = 'admin' | 'user' | 'guest';
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

// ✅ Use type for primitives and aliases
export type ID = string;
export type Timestamp = number;

// ✅ Use type for utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// ✅ Use interface for component props (can be extended by consumers)
export interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
}

// ✅ Use type for complex intersections
export type AdminUser = User & {
  role: 'admin';
  permissions: string[];
};
```

---

## Generic Types

### Common Generic Patterns

```tsx
// src/types/common.ts

// Async data state
export interface AsyncData<T, E = Error> {
  data: T | null;
  loading: boolean;
  error: E | null;
}

// Form state
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Paginated data
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

---

## Do's and Don'ts

### Do's

- ✅ Use one types file per feature containing entity + request/response types
- ✅ Use PascalCase for types and interfaces
- ✅ Keep feature types in feature folders, shared types in `src/types/`
- ✅ Use explicit suffixes (`Request`, `Response`, `Props`, `State`) for clarity
- ✅ Use `interface` for object shapes, `type` for unions/primitives
- ✅ Co-locate types with their usage when feature-specific

### Don'ts

- ❌ Don't use `I` prefix for interfaces (`IUser` → `User`)
- ❌ Don't use `any` - prefer `unknown` and type guards
- ❌ Don't duplicate type definitions across features
- ❌ Don't put all types in one giant file
- ❌ Don't use enums - prefer string literal unions
- ❌ Don't create separate DTO files - keep types in one file per feature
