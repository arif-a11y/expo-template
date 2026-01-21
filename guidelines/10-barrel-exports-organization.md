# 10. Barrel Exports & Code Organization

## Overview

This section covers when and how to use barrel exports (index files), their performance implications, and best practices for organizing code exports.

> **Quick Reference:** For folder structure and barrel export locations, see `14-final-architecture.md`.

---

## What Are Barrel Exports?

Barrel exports are `index.ts` or `index.js` files that re-export code from multiple files in a directory, providing a single import point.

### Example

```tsx
// src/components/ui/Button.tsx
export function Button() {}

// src/components/ui/Input.tsx
export function Input() {}

// src/components/ui/index.ts (Barrel export)
export { Button } from './Button';
export { Input } from './Input';

// Usage
import { Button, Input } from '@/components/ui';
```

---

## When to Use Barrel Exports

### ✅ Good Use Cases

#### 1. UI Component Libraries

```tsx
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Text } from './Text';
export { Card } from './Card';

// Clean imports
import { Button, Input, Card } from '@/components/ui';
```

#### 2. Feature Public API

```tsx
// src/features/auth/index.ts
export { useAuth, useLogin, useRegister } from './hooks';
export { LoginForm, RegisterForm } from './components';
export type { User, AuthState } from './types/auth.types';

// External features import from public API only
import { useAuth, LoginForm } from '@/features/auth';
```

#### 3. Constants and Utilities

```tsx
// src/constants/index.ts
export { ROUTES } from './routes';
export { API_ENDPOINTS } from './api';
export { STRINGS } from './strings';
export { STORAGE_KEYS } from './storage-keys';

// Clean imports
import { ROUTES, API_ENDPOINTS, STRINGS } from '@/constants';
```

---

## When NOT to Use Barrel Exports

### ❌ Bad Use Cases

#### 1. Large Directories with Many Files

```tsx
// ❌ Bad: Barrel for 50+ component files
// src/components/index.ts
export * from './Header';
export * from './Footer';
export * from './Sidebar';
// ... 50 more exports

// Problem: Imports EVERYTHING, hurts tree-shaking and performance
```

#### 2. Deep Nesting

```tsx
// ❌ Bad: Nested barrels
// src/features/index.ts
export * from './auth';
export * from './users';
export * from './products';

// Each feature has its own barrel, creating a chain
// Problem: Confusing imports, hard to trace, poor performance
```

#### 3. Screens/Pages

```tsx
// ❌ Bad: Barrel for screens
// app/index.ts
export * from './home';
export * from './profile';
export * from './settings';

// Problem: Screens are route-based, not imported modules
```

---

## Performance Implications

### Tree-Shaking Issues

#### ❌ Bad: `export *` prevents tree-shaking

```tsx
// src/components/ui/index.ts
export * from './Button';
export * from './Input';
export * from './Card';
// ... 20 more components

// Importing ONE component may bundle ALL components
import { Button } from '@/components/ui';
```

#### ✅ Good: Named exports enable tree-shaking

```tsx
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// Only Button is bundled
import { Button } from '@/components/ui';
```

### Bundle Size Impact

| Pattern | Bundle Impact | Tree-Shaking |
|---------|--------------|--------------|
| `export *` | ❌ Poor | Limited |
| `export { Named }` | ✅ Good | Works well |
| Direct imports | ✅ Best | Perfect |

---

## Recommended Patterns

### Pattern 1: Feature Public API

```tsx
// src/features/auth/index.ts
// Only export what other features need

// Hooks
export { useAuth } from './hooks/useAuth';
export { useLogin } from './hooks/useLogin';

// Components (only public ones)
export { LoginForm } from './components/LoginForm';

// Types (only public interfaces)
export type { User, AuthState } from './types/auth.types';

// DON'T export internal implementation details
// ❌ Don't export: services, internal components
```

### Pattern 2: UI Primitives

```tsx
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Text } from './Text';
export { Card } from './Card';
export { Badge } from './Badge';

// Usage
import { Button, Input, Text } from '@/components/ui';
```

### Pattern 3: Constants

```tsx
// src/constants/index.ts
export { ROUTES } from './routes';
export { API_ENDPOINTS } from './api';
export { STRINGS } from './strings';
export { STORAGE_KEYS } from './storage-keys';
export { QUERY_KEYS } from './query-keys';

// Usage
import { ROUTES, API_ENDPOINTS } from '@/constants';
```

---

## File Organization Examples

### Good: Flat Structure with Barrels

```
src/components/ui/
├── Button.tsx
├── Input.tsx
├── Text.tsx
├── Card.tsx
└── index.ts              # Barrel export
```

```tsx
// index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Text } from './Text';
export { Card } from './Card';
```

### Good: Feature with Selective Exports

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── PasswordInput.tsx     # Internal, not exported
├── hooks/
│   ├── useAuth.ts
│   ├── useLogin.ts
│   └── index.ts              # Barrel for hooks
├── services/
│   └── authService.ts        # NOT exported (internal)
├── types/
│   └── auth.types.ts
└── index.ts                  # Public API
```

```tsx
// src/features/auth/index.ts
export { useAuth, useLogin } from './hooks';
export { LoginForm, RegisterForm } from './components';
export type { User, AuthState } from './types/auth.types';

// Notice: services, PasswordInput, and internal hooks are NOT exported
```

---

## Direct Imports vs Barrel Exports

### When to Use Direct Imports

```tsx
// ✅ Good: Direct import for single-use
import { Button } from '@/components/ui/Button';

// Use when:
// - Importing only one item
// - Performance is critical
// - Tree-shaking must be guaranteed
```

### When to Use Barrel Imports

```tsx
// ✅ Good: Barrel import for multiple items
import { Button, Input, Text, Card } from '@/components/ui';

// Use when:
// - Importing multiple items from same directory
// - Clean imports matter
// - Tree-shaking is working correctly
```

---

## Barrel Export Best Practices

### ✅ Do's

1. **Use named exports, not `export *`**

```tsx
// ✅ Good
export { Button } from './Button';
export { Input } from './Input';

// ❌ Bad
export * from './Button';
export * from './Input';
```

2. **Export only public API**

```tsx
// ✅ Good: Only export what others need
export { useAuth } from './hooks/useAuth';

// ❌ Bad: Don't export internal helpers
export { parseToken } from './utils/tokenParser'; // Internal utility
```

3. **Document what's public vs private**

```tsx
// src/features/auth/index.ts
/**
 * Public API for auth feature
 * Internal services and utilities are not exported
 */
export { useAuth, useLogin } from './hooks';
export { LoginForm } from './components';
export type { User } from './types/auth.types';
```

4. **Keep barrels flat (avoid nesting)**

```tsx
// ✅ Good: Flat barrel
// src/components/ui/index.ts
export { Button } from './Button';

// ❌ Bad: Nested barrel
// src/components/index.ts
export * from './ui'; // Don't chain barrels
```

### ❌ Don'ts

1. **Don't use barrels for everything**
2. **Don't chain barrels** (barrel exporting another barrel)
3. **Don't use `export *` for large directories**
4. **Don't export internal implementation details**

---

## Index File Patterns

### Pattern 1: Component Library

```tsx
// src/components/ui/index.ts
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Text, type TextProps } from './Text';
```

### Pattern 2: Feature Module

```tsx
// src/features/users/index.ts
// Hooks
export { useUsers, useUser, useCreateUser, useDeleteUser } from './hooks';

// Components
export { UserList, UserCard } from './components';

// Types
export type {
  User,
  CreateUserData,
  UpdateUserData,
} from './types/user.types';
```

### Pattern 3: Utilities

```tsx
// src/lib/index.ts
export { cn, capitalize, truncate } from './utils';
export { formatDate, getRelativeTime } from './date';
export { isValidEmail, isStrongPassword } from './validation';
```

---

## Testing with Barrels

Barrel exports make testing easier:

```tsx
// src/components/ui/__tests__/Button.test.tsx
import { Button } from '../Button'; // Direct import for testing

// OR from barrel
import { Button } from '../index';
```

---

## Migration Strategy

If you have existing code without barrels:

### Phase 1: Add barrels to new features

```
Create index.ts for new features as you build them
```

### Phase 2: Add barrels to high-traffic imports

```
Add barrels to frequently imported directories (UI components, hooks)
```

### Phase 3: Gradually refactor other areas

```
Add barrels to other areas as you touch that code
```

---

## Do's and Don'ts Summary

### Do's

- ✅ Use barrels for UI component libraries
- ✅ Use barrels for feature public APIs
- ✅ Use named exports (not `export *`)
- ✅ Export only public interfaces
- ✅ Keep barrels flat (no nesting)
- ✅ Test tree-shaking with bundle analyzer

### Don'ts

- ❌ Don't use `export *` (hurts tree-shaking)
- ❌ Don't chain barrels (barrel → barrel)
- ❌ Don't export internal implementation details
- ❌ Don't create barrels for screens/routes
- ❌ Don't use barrels for large directories (50+ files)
- ❌ Don't over-use barrels when direct imports are clearer
