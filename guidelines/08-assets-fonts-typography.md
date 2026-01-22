# 8. Assets & Fonts

## Overview

This section covers best practices for managing assets (fonts, images, icons, SVGs) in React Native applications, including loading strategies, optimization, and naming conventions.

> **Note:** For typography styling (Text component, font sizes), see `06-styling-responsiveness.md`.

---

## Font Loading

### Font Files Organization

```
assets/
├── fonts/
│   ├── Inter-Regular.ttf
│   ├── Inter-Medium.ttf
│   ├── Inter-SemiBold.ttf
│   ├── Inter-Bold.ttf
│   └── Inter-Black.ttf
```

### Loading Fonts with Expo

```tsx
// app/_layout.tsx
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Black': require('../assets/fonts/Inter-Black.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    // Your app layout
  );
}
```

### Font Configuration in Tailwind

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter'],
        'inter-medium': ['Inter-Medium'],
        'inter-semibold': ['Inter-SemiBold'],
        'inter-bold': ['Inter-Bold'],
        'inter-black': ['Inter-Black'],
      },
    },
  },
};
```

### Using Fonts

```tsx
<Text className="font-inter text-base">Regular text</Text>
<Text className="font-inter-medium text-lg">Medium text</Text>
<Text className="font-inter-semibold text-xl">Semibold text</Text>
<Text className="font-inter-bold text-2xl">Bold text</Text>
```

---

> **Note:** For Text component implementation with variants, see `06-styling-responsiveness.md`. Use Tailwind's built-in `text-sm`, `text-lg`, etc. classes - no separate typography constants file needed.

---

## Icon Management

### Icon Strategy Options

#### Option 1: React Native Vector Icons (Most Common)

```bash
npm install react-native-vector-icons
```

```tsx
// src/components/ui/Icon.tsx
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

type IconProps = ComponentProps<typeof MaterialCommunityIcons>;

export function Icon(props: IconProps) {
  return <MaterialCommunityIcons {...props} />;
}

// Usage
<Icon name="account" size={24} color="#000" />
```

#### Option 2: Expo Icons

```tsx
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="home" size={24} color="black" />
```

#### Option 3: Custom SVG Icons

```bash
npm install react-native-svg
```

```tsx
// src/components/icons/HomeIcon.tsx
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function HomeIcon({ size = 24, color = '#000' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
```

### Icon Component Wrapper

```tsx
// src/components/ui/Icon.tsx
import { View } from 'react-native';
import { cn } from '@/lib/utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({ name, size = 24, color, className }: IconProps) {
  return (
    <View className={cn('items-center justify-center', className)}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </View>
  );
}
```

---

## Images

### Image Organization

```
assets/
├── images/
│   ├── logo.png
│   ├── logo@2x.png
│   ├── logo@3x.png
│   ├── onboarding/
│   │   ├── welcome.png
│   │   ├── welcome@2x.png
│   │   └── welcome@3x.png
│   └── placeholders/
│       ├── avatar.png
│       └── product.png
```

### Image Component

```tsx
// src/components/ui/Image.tsx
import { Image as RNImage, type ImageProps as RNImageProps } from 'react-native';
import { cn } from '@/lib/utils';

interface ImageProps extends RNImageProps {
  className?: string;
}

export function Image({ className, ...props }: ImageProps) {
  return <RNImage className={cn('w-full h-full', className)} {...props} />;
}
```

### Optimized Images with Expo Image

```bash
npx expo install expo-image
```

```tsx
// src/components/ui/OptimizedImage.tsx
import { Image } from 'expo-image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  source: string | { uri: string };
  placeholder?: string;
  className?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export function OptimizedImage({
  source,
  placeholder,
  className,
  contentFit = 'cover',
}: OptimizedImageProps) {
  return (
    <Image
      source={source}
      placeholder={placeholder}
      contentFit={contentFit}
      transition={200}
      className={cn('w-full h-full', className)}
    />
  );
}
```

### Image Constants

```tsx
// src/constants/images.ts
export const IMAGES = {
  logo: require('@/assets/images/logo.png'),
  onboarding: {
    welcome: require('@/assets/images/onboarding/welcome.png'),
    features: require('@/assets/images/onboarding/features.png'),
  },
  placeholders: {
    avatar: require('@/assets/images/placeholders/avatar.png'),
    product: require('@/assets/images/placeholders/product.png'),
  },
} as const;

// Usage
import { IMAGES } from '@/constants/images';

<Image source={IMAGES.logo} />
```

---

## SVG Management

### SVG as Components (Recommended)

```bash
npm install react-native-svg
```

```tsx
// src/components/icons/Logo.tsx
import Svg, { Path, Circle } from 'react-native-svg';

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export function Logo({ width = 100, height = 100, color = '#3B82F6' }: LogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="40" fill={color} />
      <Path d="M30 50 L50 30 L70 50 L50 70 Z" fill="white" />
    </Svg>
  );
}
```

### SVG from Files

```bash
npm install react-native-svg-transformer
```

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();
```

```tsx
// Usage
import Logo from '@/assets/images/logo.svg';

<Logo width={100} height={100} />
```

---

## Asset Naming Conventions

### Files

| Asset Type | Convention | Example |
|------------|-----------|---------|
| **Fonts** | PascalCase-Weight | `Inter-Bold.ttf` |
| **Images** | kebab-case | `user-avatar.png` |
| **Icons (SVG)** | PascalCase | `HomeIcon.svg` |
| **Logos** | kebab-case | `company-logo.png` |
| **Illustrations** | kebab-case | `onboarding-welcome.png` |

### Image Resolutions

Always provide @2x and @3x versions for images:

```
logo.png          // 1x (baseline)
logo@2x.png       // 2x (most iPhones)
logo@3x.png       // 3x (iPhone Plus, Pro Max)
```

React Native automatically selects the correct resolution.

---

## Asset Optimization

### Image Optimization

1. **Use WebP format when possible** (smaller file size)
2. **Compress images** before adding to project
3. **Lazy load images** that aren't immediately visible
4. **Use appropriate resolutions** (don't use 4K images for thumbnails)

### Tools

- **TinyPNG**: https://tinypng.com (PNG/JPEG compression)
- **ImageOptim**: https://imageoptim.com (Mac app)
- **Squoosh**: https://squoosh.app (Web-based)

### Lazy Loading Images

```tsx
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Image } from 'expo-image';

export function LazyImage({ source }: { source: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <View className="relative">
      {loading && (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator />
        </View>
      )}
      <Image
        source={source}
        onLoadEnd={() => setLoading(false)}
        className="w-full h-full"
      />
    </View>
  );
}
```

---

## Do's and Don'ts

### Do's

- ✅ Provide @2x and @3x image variants
- ✅ Use WebP format for smaller file sizes
- ✅ Compress images before adding to project
- ✅ Use vector icons (react-native-vector-icons) for scalability
- ✅ Define font weights in tailwind.config.js
- ✅ Create asset constants file for easy imports
- ✅ Use expo-image for better performance
- ✅ Lazy load images outside viewport
- ✅ Use consistent naming conventions

### Don'ts

- ❌ Don't add uncompressed images to the project
- ❌ Don't use PNG for photos (use JPEG or WebP)
- ❌ Don't forget to load fonts before rendering
- ❌ Don't hardcode asset paths throughout the app
- ❌ Don't use custom fonts excessively (increases bundle size)
- ❌ Don't skip @2x/@3x variants (blurry on high-res devices)
- ❌ Don't load all images upfront (lazy load when possible)

