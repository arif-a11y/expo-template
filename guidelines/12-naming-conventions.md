# 12. Naming Conventions & Standards

## Overview

This section defines naming conventions for folders, files, components, hooks, constants, and other code elements to ensure consistency across the codebase.

---

## Folder Naming

### Convention: kebab-case

```
✅ Good
src/
├── components/
├── feature-modules/
├── api-client/
└── user-profile/

❌ Bad
src/
├── Components/
├── featureModules/
├── API_Client/
└── UserProfile/
```

### Rules

- Use lowercase
- Separate words with hyphens
- Be descriptive but concise
- Avoid abbreviations unless universally understood

---

## File Naming

### React Components: PascalCase.tsx

```
✅ Good
Button.tsx
UserCard.tsx
LoginForm.tsx
ProductList.tsx

❌ Bad
button.tsx
userCard.tsx
login-form.tsx
product_list.tsx
```

### Screens (Expo Router): kebab-case.tsx

```
✅ Good
app/
├── index.tsx
├── login.tsx
├── (tabs)/
│   ├── home.tsx
│   ├── profile.tsx
│   └── settings.tsx
├── user-profile.tsx
├── edit-profile.tsx
└── product-detail.tsx

❌ Bad
app/
├── Index.tsx
├── Login.tsx
├── userProfile.tsx
├── EditProfile.tsx
└── ProductDetail.tsx
```

**Why kebab-case for screens?**
- Expo Router uses file-based routing
- URLs are case-insensitive
- Kebab-case is web convention for URLs
- Matches common URL patterns (`/user-profile`, `/edit-profile`)

### Screen Components Export: PascalCase

```tsx
// ✅ Good
// app/user-profile.tsx
export default function UserProfileScreen() {
  return <View>{/* content */}</View>;
}

// OR
export default function UserProfile() {
  return <View>{/* content */}</View>;
}

// ❌ Bad
export default function userProfile() {}
export default function user_profile() {}
```

### Hooks: camelCase.ts

```
✅ Good
useAuth.ts
useDebounce.ts
useLocalStorage.ts

❌ Bad
UseAuth.ts
use-auth.ts
use_debounce.ts
```

### Utilities: camelCase.ts

```
✅ Good
validation.ts
formatters.ts
dateUtils.ts

❌ Bad
Validation.ts
format-utils.ts
date_helpers.ts
```

### Types: camelCase.types.ts

```
✅ Good
user.types.ts
auth.types.ts
api.types.ts

❌ Bad
UserTypes.ts
auth-types.ts
api_types.ts
```

### Constants: SCREAMING_SNAKE_CASE or kebab-case

```
✅ Good (for file names)
routes.ts
api.ts
storage-keys.ts

✅ Good (for exports inside)
export const API_ENDPOINTS = {};
export const STORAGE_KEYS = {};
```

### Tests: *.test.ts or *.spec.ts

```
✅ Good
Button.test.tsx
useAuth.test.ts
validation.spec.ts

❌ Bad
ButtonTests.tsx
use-auth-test.ts
validationTest.ts
```

---

## Screen Naming Details

### Screen File Naming: kebab-case

```
app/
├── index.tsx              # Home/landing page
├── login.tsx              # Login screen
├── register.tsx           # Register screen
├── forgot-password.tsx    # Forgot password screen
├── user-profile.tsx       # User profile screen
├── edit-profile.tsx       # Edit profile screen
├── product-detail.tsx     # Product detail screen
├── order-history.tsx      # Order history screen
└── settings.tsx           # Settings screen
```

### Screen Component Naming: PascalCase + Screen (optional)

```tsx
// ✅ Good - Option 1: With "Screen" suffix
// app/user-profile.tsx
export default function UserProfileScreen() {
  return <UserProfileContent />;
}

// ✅ Good - Option 2: Without suffix
// app/user-profile.tsx
export default function UserProfile() {
  return <UserProfileContent />;
}

// ✅ Good - Option 3: Descriptive name
// app/product-detail.tsx
export default function ProductDetailScreen() {
  return <ProductDetail />;
}
```

### Dynamic Routes: [param].tsx

```
✅ Good
app/
├── users/
│   └── [id].tsx           # /users/:id
├── products/
│   └── [slug].tsx         # /products/:slug
└── posts/
    └── [postId]/
        └── edit.tsx       # /posts/:postId/edit

❌ Bad
app/
├── users/
│   └── [userId].tsx       # Too specific, just use [id]
└── products/
    └── [productId].tsx    # Too specific
```

### Dynamic Route Component Naming

```tsx
// ✅ Good
// app/users/[id].tsx
export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  return <View>{/* content */}</View>;
}

// ✅ Also Good
// app/products/[slug].tsx
export default function ProductDetail() {
  const { slug } = useLocalSearchParams();
  return <View>{/* content */}</View>;
}
```

### Route Groups: (groupName)

```
✅ Good
app/
├── (auth)/
│   ├── login.tsx
│   ├── register.tsx
│   └── _layout.tsx
├── (tabs)/
│   ├── home.tsx
│   ├── profile.tsx
│   └── _layout.tsx
└── (modal)/
    └── settings.tsx

❌ Bad
app/
├── Auth/              # Capital letter
├── (TABS)/            # All caps
└── (modal_screens)/   # Underscore
```

### Layout Files: _layout.tsx

```
✅ Good
app/
├── _layout.tsx        # Root layout
├── (tabs)/
│   └── _layout.tsx    # Tab layout
└── (auth)/
    └── _layout.tsx    # Auth layout

❌ Bad
app/
├── layout.tsx         # Missing underscore
├── Layout.tsx         # Wrong case
└── root-layout.tsx    # Don't use custom names
```

### Modal Screens: Prefix or group

```
✅ Good - Option 1: Modal group
app/
└── (modal)/
    ├── confirm-dialog.tsx
    └── user-picker.tsx

✅ Good - Option 2: With "modal" in name
app/
├── modal-confirm.tsx
└── modal-user-picker.tsx

❌ Bad
app/
├── ConfirmModal.tsx     # PascalCase for screen file
└── UserPickerDialog.tsx # PascalCase for screen file
```

---

## Component Naming

### Functional Components: PascalCase

```tsx
✅ Good
export function Button() {}
export function UserCard() {}
export function ProductListItem() {}

❌ Bad
export function button() {}
export function userCard() {}
export function product_list_item() {}
```

### Component Files

```tsx
// ✅ Good: File name matches component name
// Button.tsx
export function Button() {}

// ❌ Bad: Mismatched names
// button-component.tsx
export function Button() {}
```

### Prop Interfaces

```tsx
// ✅ Good: ComponentName + Props
export interface ButtonProps {}
export interface UserCardProps {}

// ❌ Bad
export interface IButtonProps {}
export interface Button_Props {}
export interface PropsForButton {}
```

---

## Hook Naming

### Convention: use + PascalCase

```tsx
✅ Good
export function useAuth() {}
export function useDebounce() {}
export function useLocalStorage() {}
export function useInfiniteScroll() {}

❌ Bad
export function authHook() {}
export function debounce() {}
export function getLocalStorage() {}
export function infiniteScroll() {}
```

### Custom Hook Return Types

```tsx
// ✅ Good: Use + HookName + Return
export interface UseAuthReturn {}
export interface UseDebounceReturn {}

// ❌ Bad
export interface AuthHookReturnType {}
export interface DebounceResult {}
```

---

## Constants Naming

### File-Level Constants: SCREAMING_SNAKE_CASE

```tsx
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/(tabs)/home',
  PROFILE: '/(tabs)/profile',
  SETTINGS: '/settings',
  USER_PROFILE: '/user-profile',
  EDIT_PROFILE: '/edit-profile',
} as const;
```

```tsx
// src/constants/api.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
  },
} as const;
```

```tsx
// src/constants/strings.ts
export const STRINGS = {
  AUTH: {
    LOGIN_TITLE: 'Welcome Back',
    EMAIL_PLACEHOLDER: 'Email address',
  },
  ERRORS: {
    NETWORK: 'Network error',
    GENERIC: 'Something went wrong',
  },
} as const;
```

### Local Constants: camelCase or SCREAMING_SNAKE_CASE

```tsx
// ✅ Good: camelCase for local constants
const maxRetries = 3;
const defaultTimeout = 5000;

// ✅ Also Good: SCREAMING_SNAKE_CASE for important constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const API_VERSION = 'v1';
```

---

## Type and Interface Naming

### Interfaces: PascalCase

```tsx
✅ Good
export interface User {}
export interface AuthState {}
export interface ApiResponse<T> {}

❌ Bad
export interface IUser {}
export interface user {}
export interface auth_state {}
```

### Types: PascalCase

```tsx
✅ Good
export type UserId = string;
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
export type Nullable<T> = T | null;

❌ Bad
export type user_id = string;
export type asyncStatus = 'idle' | 'loading';
export type nullable<T> = T | null;
```

### Request/Response Types: PascalCase + Request/Response

```tsx
✅ Good
export interface CreateUserRequest {}
export interface UpdateUserRequest {}
export interface LoginRequest {}
export interface AuthResponse {}
export interface UsersListResponse {}

❌ Bad
export interface CreateUserDTO {}
export interface userRequest {}
export interface create_user_request {}
```

---

## Variable Naming

### Variables: camelCase

```tsx
✅ Good
const userName = 'John';
const isLoading = false;
const userList = [];

❌ Bad
const UserName = 'John';
const is_loading = false;
const user_list = [];
```

### Boolean Variables: Prefix with is/has/should

```tsx
✅ Good
const isLoading = false;
const hasError = true;
const shouldRetry = true;
const canEdit = false;
const didMount = false;

❌ Bad
const loading = false;
const error = true;
const retry = true;
```

---

## Function Naming

### Functions: camelCase + Verb

```tsx
✅ Good
function getUser() {}
function createUser() {}
function updateProfile() {}
function deleteComment() {}
function validateEmail() {}
function formatDate() {}

❌ Bad
function User() {}
function user_create() {}
function profile() {}
function email() {}
```

### Event Handlers: handle + Action

```tsx
✅ Good
const handlePress = () => {};
const handleSubmit = () => {};
const handleChange = () => {};
const handleScroll = () => {};

❌ Bad
const onPress = () => {}; // Reserve 'on' prefix for props
const press = () => {};
const clicked = () => {};
```

### Event Props: on + Action

```tsx
✅ Good
<Button onPress={handlePress} />
<Input onChange={handleChange} />
<Form onSubmit={handleSubmit} />

❌ Bad
<Button handlePress={handlePress} />
<Input change={handleChange} />
<Form submit={handleSubmit} />
```

---

## Service Naming

### Service Objects: camelCase + Service

```tsx
// ✅ Good
export const authService = {};
export const userService = {};
export const apiClient = {};

// ❌ Bad
export const AuthService = {};
export const auth_service = {};
export const API = {};
```

### Service Methods: Verb + Noun

```tsx
export const userService = {
  // ✅ Good
  getAll: () => {},
  getById: (id: string) => {},
  create: (data) => {},
  update: (id, data) => {},
  delete: (id) => {},

  // ❌ Bad
  users: () => {},
  user: (id) => {},
  new: (data) => {},
};
```

---

## Store/State Naming

### Zustand Stores: use + Name + Store

```tsx
// ✅ Good
export const useAuthStore = create(() => ({}));
export const useCartStore = create(() => ({}));
export const useThemeStore = create(() => ({}));

// ❌ Bad
export const authStore = create(() => ({}));
export const useAuth = create(() => ({}));
export const AuthStore = create(() => ({}));
```

### Store Files: camelCase + Store.ts

```
✅ Good
authStore.ts
cartStore.ts
userStore.ts

❌ Bad
auth-store.ts
AuthStore.ts
storeAuth.ts
```

---

## Query Key Naming

### Query Keys: SCREAMING_SNAKE_CASE

```tsx
// src/constants/query-keys.ts
export const QUERY_KEYS = {
  USERS: 'users',
  USER_DETAIL: 'user-detail',
  PRODUCTS: 'products',
  AUTH_USER: 'auth-user',
} as const;
```

---

## Quick Reference Table

| Element | Convention | Example |
|---------|-----------|---------|
| **Folders** | kebab-case | `user-profile/` |
| **Screen files** | kebab-case.tsx | `user-profile.tsx` |
| **Screen components** | PascalCase + Screen (optional) | `UserProfileScreen()` |
| **Dynamic routes** | [param].tsx | `[id].tsx`, `[slug].tsx` |
| **Route groups** | (groupName) | `(tabs)/`, `(auth)/` |
| **Layout files** | _layout.tsx | `_layout.tsx` |
| **Component files** | PascalCase.tsx | `Button.tsx` |
| **Hook files** | camelCase.ts | `useAuth.ts` |
| **Utility files** | camelCase.ts | `validation.ts` |
| **Type files** | camelCase.types.ts | `user.types.ts` |
| **Test files** | *.test.tsx | `Button.test.tsx` |
| **Components** | PascalCase | `function Button()` |
| **Props** | PascalCase + Props | `ButtonProps` |
| **Hooks** | use + PascalCase | `useAuth()` |
| **Variables** | camelCase | `const userName` |
| **Booleans** | is/has/should + camelCase | `isLoading` |
| **Functions** | camelCase + verb | `getUser()` |
| **Handlers** | handle + Action | `handlePress` |
| **Props callbacks** | on + Action | `onPress` |
| **Constants** | SCREAMING_SNAKE_CASE | `API_URL` |
| **Entities** | PascalCase | `User` |
| **Request types** | PascalCase + Request | `CreateUserRequest` |
| **Response types** | PascalCase + Response | `UsersListResponse` |
| **Services** | camelCase + Service | `userService` |
| **Stores** | use + Name + Store | `useAuthStore` |

---

## Do's and Don'ts

### Do's

- ✅ Use kebab-case for screen files (Expo Router convention)
- ✅ Use PascalCase for screen component exports
- ✅ Use [param].tsx for dynamic routes
- ✅ Use (groupName) for route groups
- ✅ Use _layout.tsx for layout files
- ✅ Be consistent with naming across the codebase
- ✅ Use descriptive names that reveal intent
- ✅ Follow TypeScript/JavaScript community conventions
- ✅ Use PascalCase for components and types
- ✅ Use camelCase for variables and functions
- ✅ Use SCREAMING_SNAKE_CASE for file-level constants
- ✅ Prefix booleans with is/has/should
- ✅ Prefix hooks with 'use'
- ✅ Suffix request types with 'Request'
- ✅ Suffix response types with 'Response'
- ✅ Suffix props with 'Props'

### Don'ts

- ❌ Don't use PascalCase for screen files
- ❌ Don't use custom names for layout files (must be _layout.tsx)
- ❌ Don't use overly specific dynamic route names ([userId] → [id])
- ❌ Don't use Hungarian notation (strName, intAge)
- ❌ Don't use abbreviations unless universally known
- ❌ Don't use `I` prefix for interfaces (IUser)
- ❌ Don't mix naming conventions
- ❌ Don't use snake_case for JavaScript/TypeScript
- ❌ Don't use generic names (data, info, temp)
- ❌ Don't use single letters (except in loops: i, j, k)
- ❌ Don't name files differently from their exports
