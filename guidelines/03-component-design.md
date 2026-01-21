# 3. Component Design Guidelines

## Overview

Components in React Native are organized into layers based on their responsibility and reusability:

| Layer | Location | Responsibility | Example |
|-------|----------|----------------|---------|
| **UI Primitives** | `src/components/ui/` | Base building blocks | Button, Input, Text |
| **Shared Components** | `src/components/shared/` | Multi-feature organisms | Header, Modal, EmptyState |
| **Feature Components** | `src/features/[name]/components/` | Feature-specific UI | LoginForm, ProfileCard |
| **Screen Components** | `app/` | Route entry points | HomeScreen, ProfileScreen |

---

## UI Primitives (Atoms/Molecules)

Stateless, reusable building blocks with no business logic.

```tsx
// src/components/ui/Button.tsx
import { Pressable, PressableProps } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from './Text';

const styles = {
  base: 'flex-row items-center justify-center gap-2 rounded-lg',
  disabled: 'opacity-50',
  variants: {
    primary: 'bg-primary active:bg-primary/80',
    secondary: 'bg-secondary active:bg-secondary/80',
    destructive: 'bg-destructive active:bg-destructive/80',
    outline: 'border border-border bg-transparent active:bg-muted',
    ghost: 'bg-transparent active:bg-muted',
  },
  sizes: {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  },
} as const;

export interface ButtonProps extends PressableProps {
  variant?: keyof typeof styles.variants;
  size?: keyof typeof styles.sizes;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        styles.base,
        styles.variants[variant],
        styles.sizes[size],
        disabled && styles.disabled,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </Pressable>
  );
}
```

### UI Primitive Rules

- **No business logic** - only visual/interaction logic
- **Fully controlled** - state managed via props
- **Themeable** - use design tokens, not hardcoded colors
- **No data fetching** - never fetch data in primitives
- **No constants** - accept text via props, caller uses constants

---

## Shared Components (Organisms)

Complex components used across multiple features.

```tsx
// src/components/shared/Header.tsx
import { View } from 'react-native';
import { Text, Button } from '@/components/ui';
import { ChevronLeft } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  showBack,
  onBack,
  rightAction,
  className,
}: HeaderProps) {
  return (
    <View className={cn('flex-row items-center justify-between px-4 py-3', className)}>
      <View className="flex-row items-center gap-2">
        {showBack && (
          <Button variant="ghost" size="sm" onPress={onBack}>
            <ChevronLeft size={20} />
          </Button>
        )}
        <Text className="text-xl font-semibold">{title}</Text>
      </View>
      {rightAction}
    </View>
  );
}
```

```tsx
// src/components/shared/EmptyState.tsx
import { View } from 'react-native';
import { Text, Button } from '@/components/ui';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-xl font-semibold text-center">{title}</Text>
      {description && (
        <Text className="text-muted-foreground text-center mt-2">{description}</Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction} className="mt-6">
          <Text className="text-primary-foreground">{actionLabel}</Text>
        </Button>
      )}
    </View>
  );
}
```

### Shared Component Rules

- Composed from UI primitives
- May have limited internal UI state (open/closed, etc.)
- No feature-specific business logic
- Accept text via props (caller imports from constants)
- Can be used in any feature

---

## Feature Components

Components specific to a business domain.

```tsx
// src/features/auth/components/LoginForm.tsx
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text, Button, Input } from '@/components/ui';
import { STRINGS } from '@/constants/strings';
import { useLogin } from '../hooks/useLogin';

const loginSchema = z.object({
  email: z.string().email(STRINGS.ERRORS.INVALID_EMAIL),
  password: z.string().min(8, STRINGS.ERRORS.PASSWORD_MIN_LENGTH),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <View className="gap-4">
      <View>
        <Text className="text-2xl font-bold">{STRINGS.AUTH.LOGIN_TITLE}</Text>
        <Text className="text-muted-foreground">{STRINGS.AUTH.LOGIN_SUBTITLE}</Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder={STRINGS.AUTH.EMAIL_PLACEHOLDER}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry
          />
        )}
      />

      <Button onPress={handleSubmit(onSubmit)} disabled={isPending}>
        <Text className="text-primary-foreground font-medium">
          {isPending ? STRINGS.COMMON.LOADING : STRINGS.AUTH.LOGIN_BUTTON}
        </Text>
      </Button>
    </View>
  );
}
```

### Feature Component Rules

- Contains business logic specific to the feature
- Uses feature hooks for data fetching
- Imports strings from `@/constants/strings`
- Only exported via feature's `index.ts`
- Should not be imported by other features

---

## Screen Components

Thin wrappers that compose feature components.

```tsx
// app/(auth)/login.tsx
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from '@/features/auth';
import { Text } from '@/components/ui';
import { STRINGS } from '@/constants/strings';
import { ROUTES } from '@/constants/routes';
import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6"
          keyboardShouldPersistTaps="handled"
        >
          <LoginForm />

          <View className="mt-6 items-center">
            <Link href={ROUTES.REGISTER}>
              <Text className="text-primary">{STRINGS.AUTH.REGISTER_LINK}</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

### Screen Component Rules

- Minimal logic - delegate to feature components
- Handle layout (SafeAreaView, ScrollView, KeyboardAvoidingView)
- Wire up navigation
- Import routes from `@/constants/routes`
- One default export per file (Expo Router requirement)

---

## Smart vs Dumb Components

### Dumb Components (Presentational)

- Receive data via props
- No data fetching
- No business logic
- Highly reusable

```tsx
// Dumb - receives everything via props
function UserCard({ name, avatar, onPress }: UserCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Avatar source={avatar} />
      <Text>{name}</Text>
    </Pressable>
  );
}
```

### Smart Components (Container)

- Fetch data using hooks
- Contain business logic
- Handle state management
- Feature-specific

```tsx
// Smart - fetches and manages data
function UserList() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <LoadingSpinner />;

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <UserCard
          name={item.name}
          avatar={item.avatar}
          onPress={() => handleUserPress(item.id)}
        />
      )}
    />
  );
}
```

### Where Should Logic Live?

| Logic Type | Location |
|------------|----------|
| Data fetching | Feature hooks (`useUsers`, `useLogin`) |
| Business rules | Feature hooks or services |
| Form validation | Zod schema in feature components |
| Navigation | Screen components |
| UI state (modal open) | Local component state |
| Shared UI state | Zustand store |

---

## Container vs Presentational in Modern React Native

The traditional container/presentational split is less relevant with hooks. Instead:

### Modern Approach

```tsx
// Feature hook handles data logic
// src/features/users/hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: userService.getAll,
  });
}

// Feature component uses the hook
// src/features/users/components/UserList.tsx
export function UserList() {
  const { data, isLoading, error } = useUsers();
  // ... render logic
}
```

### Should Screens Be Dumb?

**Yes, mostly.** Screens should:
- Compose feature components
- Handle navigation setup
- Provide layout structure

Screens should NOT:
- Fetch data directly
- Contain business logic
- Have complex state

---

## Component Composition Example

```
LoginScreen (app/(auth)/login.tsx)
├── SafeAreaView
├── KeyboardAvoidingView
└── ScrollView
    ├── LoginForm (feature component)
    │   ├── Text (UI primitive)
    │   ├── Input (UI primitive)
    │   ├── Input (UI primitive)
    │   └── Button (UI primitive)
    └── Link (navigation)
```

---

## Do's and Don'ts

### Do's

- Keep screens thin, delegate to feature components
- Use hooks for data fetching, not components
- Pass text via props for reusable components
- Import constants in feature components and screens
- Use `cn()` for conditional styling
- Make primitives fully controlled

### Don'ts

- Don't fetch data in UI primitives
- Don't hardcode strings in any component
- Don't import feature components across features
- Don't put navigation logic in feature components
- Don't over-abstract - 3 uses before extracting
- Don't create "god components" with 500+ lines
