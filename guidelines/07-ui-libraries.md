# 7. UI Libraries

## Recommendation

**Use custom components with NativeWind** for maximum control and minimal bundle size.

> For component implementation patterns, see `06-styling-responsiveness.md`.

---

## When to Consider a Library

Only consider a UI library for **complex interactions** that are time-consuming to build:

| Component | Build Custom | Consider Library |
|-----------|--------------|------------------|
| Button, Text, Input, Card | ✅ Custom | ❌ |
| Modal, Actionsheet | ✅ Custom (simple) | ⚠️ Maybe |
| Select/Dropdown | ⚠️ Complex | ✅ Library |
| Date/Time Picker | ❌ Don't build | ✅ Library |
| Autocomplete | ⚠️ Complex | ✅ Library |

---

## Library Options (if needed)

| Library | Best For |
|---------|----------|
| **Gluestack UI** | Accessible components, works with NativeWind |
| **React Native Paper** | Material Design apps |
| **Tamagui** | Performance-critical, cross-platform (web + native) |

### Example: Selective Library Usage

```tsx
// Custom primitives (most components)
import { Button, Text, Input, Card } from '@/components/ui';

// Library for complex components only
import { Select } from '@gluestack-ui/themed';
```

---

## Do's and Don'ts

### Do's

- ✅ Build custom for frequently used components (Button, Text, Input)
- ✅ Use library only for genuinely complex interactions
- ✅ Import selectively (tree-shake)

### Don'ts

- ❌ Don't use a library for simple components
- ❌ Don't import entire library (`import * from 'library'`)
- ❌ Don't mix multiple UI libraries
