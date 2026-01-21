# 13. Forms & Validation

## Overview

Form handling using React Hook Form + Zod for type-safe validation.

| Aspect | Solution |
|--------|----------|
| **Form State** | React Hook Form |
| **Validation** | Zod schemas |
| **Integration** | @hookform/resolvers/zod |
| **Error Display** | Controller component |

---

## Why React Hook Form + Zod?

| Feature | React Hook Form + Zod | Formik | Plain useState |
|---------|------------------------|--------|----------------|
| Bundle Size | ~8KB + 12KB | ~15KB | 0KB |
| Type Safety | Excellent | Good | Manual |
| Performance | Uncontrolled (fast) | Controlled | Controlled |
| Re-renders | Minimal | More | Most |

**Recommendation:** React Hook Form + Zod for forms with validation

---

## Basic Form Pattern

```tsx
// src/features/auth/components/LoginForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { STRINGS } from '@/constants/strings';

// 1. Define schema
const loginSchema = z.object({
  email: z.string().email(STRINGS.ERRORS.INVALID_EMAIL),
  password: z.string().min(8, STRINGS.ERRORS.PASSWORD_MIN_LENGTH),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // Handle submission
  };

  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
            keyboardType="email-address"
          />
        )}
      />

      <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {STRINGS.AUTH.LOGIN_BUTTON}
      </Button>
    </View>
  );
}
```

---

## Zod Schema Location

**Where schemas go:**

| Scope | Location | Example |
|-------|----------|---------|
| Feature-specific | `src/features/[name]/schemas/` | `auth.schema.ts` |
| Reusable validators | `src/lib/validation.ts` | Email, phone helpers |
| Global schemas | `src/schemas/` (rare) | Common validation rules |

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── schemas/
│   └── auth.schema.ts       # Zod schemas for auth forms
├── hooks/
│   └── useLogin.ts
└── services/
    └── authService.ts
```

---

## Form Submission with React Query

```tsx
// src/features/auth/hooks/useLogin.ts
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/auth.schema';
import { authService } from '../services/authService';

export function useLogin() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authService.login,
    onError: (error: ApiError) => {
      // Map server errors to form fields
      if (error.field) {
        form.setError(error.field, { message: error.message });
      }
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
  };
}

// Component usage
export function LoginForm() {
  const { form, onSubmit, isLoading } = useLogin();

  return (
    <Controller
      control={form.control}
      name="email"
      render={({ field }) => <Input {...field} />}
    />
  );
}
```

---

## Common Validation Patterns

### Reusable Validators

```tsx
// src/lib/validation.ts
import { z } from 'zod';

export const validators = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  nonEmpty: (message: string) => z.string().min(1, message),
};

// Use in feature schemas
// src/features/auth/schemas/auth.schema.ts
import { validators } from '@/lib/validation';

export const loginSchema = z.object({
  email: validators.email,
  password: validators.password,
});
```

### Schema Refinements

```tsx
// Password confirmation
export const registerSchema = z
  .object({
    email: validators.email,
    password: validators.password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
```

---

## Dynamic Fields (Arrays)

```tsx
import { useFieldArray } from 'react-hook-form';

export function ExperienceForm() {
  const { control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  });

  return (
    <>
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          control={control}
          name={`experiences.${index}.company`}
          render={({ field }) => <Input {...field} />}
        />
      ))}
      <Button onPress={() => append({ company: '' })}>Add</Button>
    </>
  );
}
```

---

## Multi-Step Forms

```tsx
export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const form = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const nextStep = async () => {
    // Validate current step fields only
    const isValid = await form.trigger(['email', 'password']);
    if (isValid) setStep(2);
  };

  return (
    <>
      {step === 1 && <Step1 control={form.control} />}
      {step === 2 && <Step2 control={form.control} />}
      <Button onPress={nextStep}>Next</Button>
    </>
  );
}
```

---

## Error Handling

### Server-Side Errors

```tsx
// In mutation onError
onError: (error: ApiError) => {
  if (error.field) {
    form.setError(error.field, {
      type: 'server',
      message: error.message,
    });
  } else {
    form.setError('root', { message: error.message });
  }
}

// Display root error
{form.formState.errors.root && (
  <Text className="text-destructive">
    {form.formState.errors.root.message}
  </Text>
)}
```

---

## Performance

### Reduce Re-renders

```tsx
// ✅ Good - Each field independent
<Controller name="email" control={control} render={EmailField} />
<Controller name="password" control={control} render={PasswordField} />

// ❌ Bad - watch() causes re-renders on every keystroke
const allValues = watch();
```

### Debounced Validation

```tsx
const username = useWatch({ control, name: 'username' });
const debouncedUsername = useDebounce(username, 500);

// Check availability after debounce
const { data: isAvailable } = useQuery({
  queryKey: ['check-username', debouncedUsername],
  queryFn: () => authService.checkUsername(debouncedUsername),
  enabled: !!debouncedUsername,
});
```

---

## Do's and Don'ts

### Do's

- ✅ Use Zod schemas in `schemas/` folder
- ✅ Import error strings from `@/constants/strings`
- ✅ Use Controller for React Native inputs
- ✅ Handle server errors with `setError()`
- ✅ Set `defaultValues` to prevent warnings
- ✅ Use `mode: 'onTouched'` for better UX

### Don'ts

- ❌ Don't use `watch()` for entire form
- ❌ Don't hardcode validation messages
- ❌ Don't store form state in Zustand
- ❌ Don't forget accessibility labels
- ❌ Don't validate on every keystroke
- ❌ Don't mix controlled/uncontrolled inputs

---

## Decision Table

| Question | Answer |
|----------|--------|
| Where do schemas go? | `src/features/[name]/schemas/` |
| Where is form submission logic? | `src/features/[name]/hooks/` |
| How to handle server errors? | `form.setError()` in mutation `onError` |
| How to validate part of form? | `form.trigger(['field1', 'field2'])` |
| How to reset form after success? | `form.reset()` or `form.reset(newData)` |
| Where are reusable validators? | `src/lib/validation.ts` |
