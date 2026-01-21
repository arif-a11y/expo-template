# Expo Template

A production-ready Expo/React Native template following architectural best practices.

## Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**:
  - React Query (TanStack Query) for server state
  - Zustand for client state
- **Forms**: React Hook Form + Zod
- **Storage**: AsyncStorage + Expo SecureStore
- **HTTP**: Axios
- **Language**: TypeScript (strict mode)

## Features

✓ Complete folder structure (Feature-based + Atomic UI hybrid)
✓ Custom UI primitives with NativeWind
✓ Dark mode support out of the box
✓ Type-safe configuration and constants
✓ Path aliases configured (`@/`, `@components/`, etc.)
✓ React Query + Zustand setup
✓ Storage wrappers (secure and regular)
✓ Responsive design utilities

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd expo-template
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server
```bash
npx expo start
```

5. Run on your device
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app

## Project Structure

```
expo-template/
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Home screen
├── src/
│   ├── components/
│   │   ├── ui/            # UI Primitives (Button, Input, Text, Card)
│   │   └── shared/        # Shared components
│   ├── features/          # Feature modules (self-contained)
│   ├── hooks/             # Global hooks (useDebounce, useResponsive)
│   ├── services/          # API client, storage wrappers
│   ├── providers/         # React context providers
│   ├── constants/         # App-wide constants (routes, strings, etc.)
│   ├── lib/               # Utilities (cn function, helpers)
│   ├── types/             # Global TypeScript types
│   └── config/            # Environment and feature flags
├── assets/
│   └── fonts/             # Inter font family
├── global.css             # Tailwind/NativeWind theme
└── tailwind.config.js     # Tailwind configuration
```

## Key Patterns

### Styling
- Use NativeWind `className` prop for all styling
- Object-based variant maps (not inline conditional styles)
- `cn()` utility for class merging
- CSS variables for colors (supports dark mode)

### Constants
- All strings in `@/constants/strings`
- All routes in `@/constants/routes`
- All API endpoints in `@/constants/api`
- All storage keys in `@/constants/storage-keys`
- Never hardcode these values

### State Management
- **Server data**: React Query
- **Client state**: Zustand
- **Form state**: React Hook Form + Zod
- **Local state**: useState/useReducer

### File Naming
- Screens: `kebab-case.tsx`
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` (use prefix)
- Types: `camelCase.types.ts`

## Available Scripts

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type check
npx tsc --noEmit

# Build for production
eas build --platform ios
eas build --platform android
```

## Adding New Features

1. Create feature folder: `src/features/my-feature/`
2. Add components: `src/features/my-feature/components/`
3. Add hooks: `src/features/my-feature/hooks/`
4. Add services: `src/features/my-feature/services/`
5. Add types: `src/features/my-feature/types/`
6. Export public API: `src/features/my-feature/index.ts`

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `API_URL`: Backend API base URL
- `API_TIMEOUT`: Request timeout in milliseconds
- `ENABLE_ANALYTICS`: Enable/disable analytics
- `ENABLE_PUSH_NOTIFICATIONS`: Enable/disable push notifications

## Architecture Decisions

- **Feature-based structure**: Features are self-contained modules
- **Atomic UI**: Reusable primitives composed into complex components
- **Type safety**: Strict TypeScript, no `any` types
- **No hardcoded values**: All strings, routes, endpoints in constants
- **Single responsibility**: Each component/function does one thing well

## Documentation

See the `guidelines/` folder for complete architectural documentation:
- Project structure
- State management strategy
- Component design patterns
- Styling and theming
- Forms and validation
- And more...

## License

MIT
