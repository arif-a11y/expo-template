# 6. Styling & Responsiveness

## Overview

This section defines a strict styling strategy for React Native applications, covering responsiveness, theming, design tokens, and dark mode support. **No inline styles or raw CSS-like styling is allowed** - all styling must follow the patterns defined here.

---

## Styling Approach: NativeWind (Recommended)

### Why NativeWind?

NativeWind brings Tailwind CSS to React Native, providing:
- Consistent design system out of the box
- Responsive utilities
- Theme support via CSS variables
- Excellent DX with IntelliSense
- No inline styles needed

### Setup

```bash
npm install nativewind tailwindcss
npx tailwindcss init
```

```js
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Use CSS variables - NativeWind supports them natively
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        destructive: 'var(--color-destructive)',
        'destructive-foreground': 'var(--color-destructive-foreground)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
      },
      fontFamily: {
        inter: ['Inter'],
        'inter-medium': ['Inter-Medium'],
        'inter-semibold': ['Inter-SemiBold'],
        'inter-bold': ['Inter-Bold'],
      },
    },
  },
  plugins: [],
};
```

> **Note:** NativeWind disables `textOpacity`, `borderOpacity`, and `backgroundOpacity` plugins for performance. Use direct colors instead of opacity modifiers like `bg-primary/50`.

---

## Design Tokens & Theming System

### CSS Variables for Theme

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Colors - Light Theme */
  --color-primary: #3b82f6; /* blue-500 */
  --color-secondary: #64748b; /* slate-500 */
  --color-background: #ffffff;
  --color-foreground: #0f172a; /* slate-900 */
  --color-muted: #f1f5f9; /* slate-100 */
  --color-muted-foreground: #64748b; /* slate-500 */
  --color-accent: #f59e0b; /* amber-500 */
  --color-accent-foreground: #ffffff;
  --color-destructive: #ef4444; /* red-500 */
  --color-destructive-foreground: #ffffff;
  --color-border: #e2e8f0; /* slate-200 */
  --color-input: #e2e8f0; /* slate-200 */
  --color-ring: #3b82f6; /* blue-500 */
}

.dark {
  --color-primary: #60a5fa; /* blue-400 */
  --color-secondary: #94a3b8; /* slate-400 */
  --color-background: #0f172a; /* slate-900 */
  --color-foreground: #f1f5f9; /* slate-100 */
  --color-muted: #1e293b; /* slate-800 */
  --color-muted-foreground: #94a3b8; /* slate-400 */
  --color-accent: #fbbf24; /* amber-400 */
  --color-accent-foreground: #0f172a; /* slate-900 */
  --color-destructive: #f87171; /* red-400 */
  --color-destructive-foreground: #0f172a; /* slate-900 */
  --color-border: #334155; /* slate-700 */
  --color-input: #334155; /* slate-700 */
  --color-ring: #60a5fa; /* blue-400 */
}
```

### Theme Provider

```tsx
// src/providers/ThemeProvider.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  activeTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');

  const activeTheme = theme === 'system' ? (systemTheme ?? 'light') : theme;

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) setThemeState(saved as Theme);
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, activeTheme, setTheme }}>
      <View className={activeTheme === 'dark' ? 'dark' : ''} style={{ flex: 1 }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---

## The `cn()` Utility

### Implementation

```tsx
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes intelligently
 * Handles conditional classes and resolves conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Usage

```tsx
import { cn } from '@/lib/utils';
import { View, Text } from 'react-native';

const cardVariants = {
  base: 'rounded-lg p-4',
  variants: {
    variant: {
      default: 'bg-background border border-border shadow-md',
      outline: 'border-2 border-primary bg-transparent',
      ghost: 'bg-transparent',
    },
  },
};

interface CardProps {
  variant?: keyof typeof cardVariants.variants.variant;
  className?: string;
  children: React.ReactNode;
}

export function Card({ variant = 'default', className, children }: CardProps) {
  return (
    <View
      className={cn(
        cardVariants.base,
        cardVariants.variants.variant[variant],
        className
      )}
    >
      {children}
    </View>
  );
}

// Usage
<Card variant="outline" className="mt-4 mx-2">
  <Text className="text-foreground">Content</Text>
</Card>
```

---

## Component Variant Pattern

```tsx
// src/components/ui/Button.tsx
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { cn } from '@/lib/utils';

const buttonVariants = {
  base: 'rounded-lg flex-row items-center justify-center active:opacity-80',
  variants: {
    variant: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      outline: 'border-2 border-primary bg-transparent',
      ghost: 'bg-transparent',
      destructive: 'bg-destructive',
    },
    size: {
      sm: 'px-3 py-2 min-h-[36px]',
      md: 'px-4 py-3 min-h-[44px]',
      lg: 'px-6 py-4 min-h-[52px]',
    },
  },
};

const textVariants = {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-primary',
      ghost: 'text-primary',
      destructive: 'text-destructive-foreground',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
};

export interface ButtonProps {
  variant?: keyof typeof buttonVariants.variants.variant;
  size?: keyof typeof buttonVariants.variants.size;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  onPress?: () => void;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  className,
  children,
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        buttonVariants.base,
        buttonVariants.variants.variant[variant],
        buttonVariants.variants.size[size],
        (disabled || loading) && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text
          className={cn(
            'font-inter-semibold',
            textVariants.variants.variant[variant],
            textVariants.variants.size[size]
          )}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
```

---

## Responsiveness

> **Important:** Tailwind's default breakpoints (`sm: 640px`, `md: 768px`, etc.) are designed for web and won't trigger on most phones (typically under 430px wide). For mobile apps, use the `useResponsive` hook below or customize breakpoints for tablets.

### Screen Dimensions

```tsx
// src/lib/responsive.ts
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isTablet: Platform.OS === 'ios' ? Platform.isPad : SCREEN_WIDTH >= breakpoints.tablet,
  isPhone: Platform.OS === 'ios' ? !Platform.isPad : SCREEN_WIDTH < breakpoints.tablet,
};
```

### Responsive Hook

```tsx
// src/hooks/useResponsive.ts
import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';
import { breakpoints } from '@/lib/responsive';

export function useResponsive() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isTablet = Platform.OS === 'ios'
    ? Platform.isPad
    : dimensions.width >= breakpoints.tablet;

  return {
    width: dimensions.width,
    height: dimensions.height,
    isPhone: !isTablet,
    isTablet,
  };
}
```

### Responsive Components

```tsx
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const gridVariants = {
  base: 'flex-row flex-wrap',
  layout: {
    phone: 'gap-2',
    tablet: 'gap-4',
  },
};

const gridItemVariants = {
  layout: {
    phone: 'w-full',
    tablet: 'w-[48%]',
  },
};

export function ResponsiveGrid() {
  const { isTablet } = useResponsive();
  const layout = isTablet ? 'tablet' : 'phone';

  return (
    <View className={cn(gridVariants.base, gridVariants.layout[layout])}>
      {items.map((item) => (
        <View key={item.id} className={gridItemVariants.layout[layout]}>
          {/* Item content */}
        </View>
      ))}
    </View>
  );
}
```

---

## Font Scaling & Accessibility

### Respecting User Font Size Preferences

```tsx
// src/components/ui/Text.tsx
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cn } from '@/lib/utils';

const textVariants = {
  variant: {
    h1: 'text-4xl font-inter-bold',
    h2: 'text-3xl font-inter-bold',
    h3: 'text-2xl font-inter-semibold',
    body: 'text-base font-inter',
    caption: 'text-sm font-inter text-muted-foreground',
  },
};

interface TextProps extends RNTextProps {
  variant?: keyof typeof textVariants.variant;
  className?: string;
}

export function Text({ variant = 'body', className, ...props }: TextProps) {
  return (
    <RNText
      maxFontSizeMultiplier={1.3}
      className={cn(textVariants.variant[variant], className)}
      {...props}
    />
  );
}
```

### Typography Scale

```tsx
// Use in tailwind.config.js
fontSize: {
  xs: ['12px', { lineHeight: '16px' }],
  sm: ['14px', { lineHeight: '20px' }],
  base: ['16px', { lineHeight: '24px' }],
  lg: ['18px', { lineHeight: '28px' }],
  xl: ['20px', { lineHeight: '28px' }],
  '2xl': ['24px', { lineHeight: '32px' }],
  '3xl': ['30px', { lineHeight: '36px' }],
  '4xl': ['36px', { lineHeight: '40px' }],
}
```

---

## Dark Mode Support

### Automatic Dark Mode

```tsx
// Components automatically adapt to theme
<View className="bg-background">
  <Text className="text-foreground">
    This text adapts to light/dark mode
  </Text>
  <View className="border border-border bg-muted">
    <Text className="text-muted-foreground">Secondary text</Text>
  </View>
</View>
```

### Manual Theme Toggle

```tsx
// src/components/shared/ThemeToggle.tsx
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

const themeButtonVariants = {
  base: 'px-4 py-2 rounded-lg',
  state: {
    active: 'bg-primary',
    inactive: 'bg-muted',
  },
};

const themeTextVariants = {
  state: {
    active: 'text-white',
    inactive: 'text-foreground',
  },
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const renderButton = (value: 'light' | 'dark' | 'system', label: string) => {
    const state = theme === value ? 'active' : 'inactive';

    return (
      <Pressable
        onPress={() => setTheme(value)}
        className={cn(themeButtonVariants.base, themeButtonVariants.state[state])}
      >
        <Text className={themeTextVariants.state[state]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View className="flex-row gap-2">
      {renderButton('light', 'Light')}
      {renderButton('dark', 'Dark')}
      {renderButton('system', 'System')}
    </View>
  );
}
```

---

## Platform-Specific Styling

### Shadows

NativeWind handles shadows cross-platform automatically. Just use shadow classes:

```tsx
<View className="bg-background rounded-lg shadow-md">
  {/* Works on both iOS and Android */}
</View>
```

### Platform Variants

Use NativeWind's platform modifiers for platform-specific styles:

```tsx
<View className="ios:pt-12 android:pt-8">
  {/* Different padding per platform */}
</View>

<Text className="ios:font-inter android:font-roboto">
  Platform-specific font
</Text>
```

---

## Safe Area Handling

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {children}
    </SafeAreaView>
  );
}

// Custom safe area with useSafeAreaInsets
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-background"
    >
      {/* Content */}
    </View>
  );
}
```

---

## Styling Decision Matrix

| Scenario | Approach | Example |
|----------|----------|---------|
| **Static styles** | Tailwind classes | `className="p-4 bg-background"` |
| **Component variants** | Variant objects + `cn()` | See Button example |
| **Responsive (phone/tablet)** | `useResponsive` hook | See ResponsiveGrid example |
| **Theme-aware** | CSS variable colors | `className="bg-background text-foreground"` |
| **Platform-specific** | NativeWind modifiers | `className="ios:pt-12 android:pt-8"` |
| **Shadows** | NativeWind shadow classes | `className="shadow-md"` (cross-platform) |

---

## Do's and Don'ts

### Do's

- ✅ Use NativeWind Tailwind classes for all styling
- ✅ Define color tokens in `global.css` using CSS variables
- ✅ Use semantic color names (background, foreground, primary, etc.)
- ✅ Use variant objects for component styling
- ✅ Use the `cn()` utility for merging classes
- ✅ Use `useResponsive` hook for phone/tablet layouts
- ✅ Handle safe areas properly with SafeAreaView
- ✅ Support dark mode from day one
- ✅ Use NativeWind platform modifiers (`ios:`, `android:`)

### Don'ts

- ❌ Don't use inline conditional styles - use variant objects
- ❌ Don't hardcode colors - use theme colors
- ❌ Don't rely on Tailwind breakpoints (`sm:`, `md:`) for phones
- ❌ Don't forget safe area insets
- ❌ Don't mix multiple styling approaches
- ❌ Don't create styles that don't adapt to dark mode
