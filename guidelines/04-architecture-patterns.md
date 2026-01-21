# 4. Architecture Patterns: Modern React
### React Query + Hooks Pattern

```tsx
// Service Layer - src/features/users/services/userService.ts
import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants/api';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.USERS.LIST);
    return data;
  },
  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(API_ENDPOINTS.USERS.DETAIL(id));
    return data;
  },
};

// Query Hook - src/features/users/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { userService } from '../services/userService';

export function useUsers() {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: userService.getAll,
  });
}

// Component - src/features/users/components/UserList.tsx
import { useUsers } from '../hooks/useUsers';
import { STRINGS } from '@/constants/strings';

export function UserList() {
  const { data: users, isLoading, error, refetch } = useUsers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={STRINGS.ERRORS.GENERIC} onRetry={refetch} />;

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <UserCard user={item} />}
    />
  );
}
```

### How Hooks will work

| Loading state | `isLoading` from React Query |
| Error state | `error` from React Query |
| Data state | `data` from React Query |
| Fetch method | Automatic + `refetch()` |
| Cache | Built into React Query |
| Derived state | `useMemo` |
| Side effects | `useEffect` |


## Recommended Architecture

### Layer Structure

```
┌─────────────────────────────────────────────────┐
│                  Components                      │
│         (UI rendering, user interaction)         │
├─────────────────────────────────────────────────┤
│                    Hooks                         │
│      (useUsers, useAuth, useCreateUser)          │
├─────────────────────────────────────────────────┤
│                  Services                        │
│           (API calls, business logic)            │
├─────────────────────────────────────────────────┤
│                Constants/Config                  │
│      (API URLs, strings, storage keys)           │
└─────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → Component → Hook → Service → API
                ↑                           ↓
                └───────── Response ────────┘
```

---

## Complete Feature Example

```
src/features/users/
├── components/
│   ├── UserList.tsx
│   ├── UserCard.tsx
│   └── CreateUserForm.tsx
├── hooks/
│   ├── useUsers.ts
│   └── useCreateUser.ts
├── services/
│   └── userService.ts
├── types/
│   └── user.types.ts
└── index.ts
```

### Service Layer

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

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DETAIL(id));
  },
};
```

### Query Hooks

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

### Component Layer

```tsx
// src/features/users/components/UserList.tsx
import { FlatList } from 'react-native';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import { UserCard } from './UserCard';
import { EmptyState } from '@/components/shared';
import { STRINGS } from '@/constants/strings';

export function UserList() {
  const { data: users, isLoading, error, refetch } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();

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

  if (!users?.length) {
    return (
      <EmptyState
        title={STRINGS.USERS.EMPTY_TITLE}
        description={STRINGS.USERS.EMPTY_DESCRIPTION}
      />
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserCard user={item} onDelete={() => deleteUser(item.id)} />
      )}
    />
  );
}
```

---

## Do's and Don'ts

### Do's

- Use React Query for server state
- Create service layers for API abstraction
- Use custom hooks to encapsulate logic
- Keep components focused on rendering
- Import all strings from `@/constants/strings`
- Import all API endpoints from `@/constants/api`

### Don'ts

- Don't create manual loading/error state management
- Don't put API calls directly in components
- Don't reinvent caching mechanisms
- Don't create class-based ViewModels
- Don't hardcode API endpoints or strings
