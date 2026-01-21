# React Native Architecture Guidelines

A comprehensive reference architecture and onboarding guide for building scalable, maintainable, and production-ready React Native applications.

---

## Purpose

This documentation provides:
- **Architectural decisions** and their rationale
- **Best practices** for medium-to-large React Native applications
- **Decision frameworks** for choosing between competing approaches
- **Code examples** demonstrating recommended patterns
- **Do's and Don'ts** for common scenarios

---

## Table of Contents

| # | Section | Description |
|---|---------|-------------|
| 1 | [Project Structure](./01-project-structure.md) | Folder organization, feature-based vs layer-based architecture |
| 2 | [State Management](./02-state-management.md) | Redux, React Query, Zustand - when to use each |
| 3 | [Component Design](./03-component-design.md) | UI primitives, feature components, smart vs dumb patterns |
| 4 | [Architecture Patterns](./04-architecture-patterns.md) | MVVM vs hooks-based patterns in modern React Native |
| 5 | [Types & Contracts](./05-types-and-contracts.md) | TypeScript best practices, type organization |
| 6 | [Styling & Responsiveness](./06-styling-responsiveness.md) | NativeWind, theming, responsive design |
| 7 | [UI Libraries](./07-ui-libraries.md) | Comparing Gluestack, Tamagui, Paper, custom systems |
| 8 | [Assets, Fonts & Typography](./08-assets-fonts-typography.md) | Font loading, icons, images, SVGs |
| 9 | [Hooks, Utils & Shared Logic](./09-hooks-utils-shared-logic.md) | Custom hooks, utilities, avoiding over-abstraction |
| 10 | [Barrel Exports & Organization](./10-barrel-exports-organization.md) | Index files, performance implications |
| 11 | [Configuration & Environment](./11-configuration-environment.md) | Env management, feature flags, secure storage |
| 12 | [Naming Conventions](./12-naming-conventions.md) | Files, folders, components, hooks, constants |
| 13 | [Forms & Validation](./13-forms-validation.md) | React Hook Form + Zod patterns, schemas, error handling |
| 14 | [Final Architecture](./14-final-architecture.md) | Complete recommended structure with examples |

---

## Quick Start

### This Project's Structure

```
expo-template/
├── app/                    # Expo Router screens (file-based routing)
│   └── _layout.tsx         # Root layout with providers
├── src/
│   ├── components/
│   │   └── ui/             # Reusable UI primitives (Button, Text, Card, etc.)
│   ├── lib/                # Utilities (cn, colors)
│   └── providers/          # Context providers (ThemeProvider)
├── assets/
│   └── fonts/              # Custom fonts (Inter family)
├── global.css              # CSS variables for theming
├── tailwind.config.js      # NativeWind/Tailwind configuration
└── guidelines/             # This documentation
```

### Key Patterns Used

| Pattern | Implementation |
|---------|---------------|
| **Styling** | NativeWind (Tailwind CSS for React Native) |
| **Theming** | CSS variables in `global.css` |
| **Class Merging** | `cn()` utility with clsx + tailwind-merge |
| **Component Variants** | Object-based style maps with TypeScript |
| **Routing** | Expo Router (file-based) |
| **Path Aliases** | `@/` → `src/`, `@components/` → `src/components/` |

---

## Decision Framework

When faced with architectural decisions, use this priority order:

1. **Simplicity** - Choose the simplest solution that meets requirements
2. **Maintainability** - Prefer patterns that are easy to understand and modify
3. **Consistency** - Follow established patterns in the codebase
4. **Scalability** - Consider future growth, but don't over-engineer
5. **Performance** - Optimize only when measured, not prematurely

---

## Core Architecture Decisions

| Area | Recommendation |
|------|----------------|
| Folder Structure | Feature-based + Atomic hybrid |
| Server State | React Query (TanStack Query) |
| Client State | Zustand |
| Styling | NativeWind + CSS variables |
| UI Library | Gluestack UI or custom primitives |
| Navigation | Expo Router (file-based) |

---

## Getting Started

1. **New to the project?** Start with [Project Structure](./01-project-structure.md) and [Component Design](./03-component-design.md)
2. **Setting up state?** Read [State Management](./02-state-management.md)
3. **Building UI?** Check [Styling](./06-styling-responsiveness.md) and [UI Libraries](./07-ui-libraries.md)
4. **Writing types?** See [Types & Contracts](./05-types-and-contracts.md)
5. **Need the full picture?** Jump to [Final Architecture](./14-final-architecture.md)
