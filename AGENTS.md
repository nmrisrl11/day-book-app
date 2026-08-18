# DayBook - AI Agent Operating Guide

Welcome to the DayBook project! This document contains the permanent context, architectural boundaries, and operational rules for any AI agent working on this repository.

**CRITICAL DIRECTIVE**: The actual source code is the ultimate authority. Do not invent project behavior, dependencies, or architectural patterns that cannot be verified from the codebase. Do not document planned functionality as implemented.

## 1. Documentation Hierarchy

When seeking context, prioritize reading in this order:

1.  **`AGENTS.md` (This file)**: Permanent AI operating instructions and deep architectural context.
2.  **`CURRENT_STATE.md`**: Living snapshot of what is actually implemented _right now_, known tech debt, and current focus.
3.  **`docs/rules.md`**: Strict coding conventions, naming rules, and boundaries.
4.  **`docs/instructions.md`**: The original foundational product specification (treat as historical intent, not current reality).
5.  **`docs/brand-guidelines.md`**: Design, typography, and personality rules.

## 2. Project Architecture

DayBook is a local-first, client-side React application built with Vite. It has no traditional backend or user authentication.

### Technology Stack (Actual)

- **Core**: React 19, TypeScript, Vite 6
- **State & Persistence**: Zustand (with `persist` middleware to `localStorage`)
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS (v4)
- **UI Primitives**: shadcn/ui (Radix UI under the hood)
- **Animation & Interactions**: Framer Motion, `@animate-ui`, `cuelume` (for sounds)
- **Forms & Validation**: React Hook Form, Zod
- **URL State Management**: `nuqs`
- **Deployment**: Vercel (Edge Functions used _only_ for the visitor tracker)

### Directory Structure Philosophy

- **`src/features/`**: The core of the app. Domain-driven modules (e.g., `dashboard`, `management`, `settings`, `calendar`). Each feature encapsulates its own components and local logic.
- **`src/components/`**: Global, reusable UI components (e.g., `user-avatar`, `empty-state`, layouts).
- **`src/components/ui/`**: **STRICTLY** for shadcn/ui and external un-opinionated primitives (like `@animate-ui`). Do not put business components here.
- **`src/store/`**: Global state management (Zustand).
- **`src/hooks/`**, **`src/helpers/`**, **`src/constants/`**, **`src/types/`**, **`src/schema/`**: Standard shared utilities.
- **`api/`**: Vercel Serverless/Edge functions (currently only for Redis-backed visitor tracking).

## 3. Core Architectural Patterns

### The Data Layer (Zustand + LocalStorage)

- The single source of truth for all user data (Birthdays, Settings, Greetings, Floating Messages) is the Zustand store (`src/store/day-book-store.ts`).
- **Rule**: When updating state asynchronously or inside debounced functions (e.g., color pickers, settings toggles), **always use `useDayBookStore.getState()`** to get the latest state before spreading/modifying. Stale closures are a known risk in this architecture.
- **Rule**: The `Birthday` type and `Settings` type are the fundamental data structures. See `src/types/`.

### The Presentation Layer

- **Derived Data**: The Dashboard derives `todayCelebrants`, `upcomingBirthdays`, and `birthdaysByMonth` dynamically from the store via `useBirthdayData`. Do not duplicate this logic.
- **Performance**: Use React `lazy` and `Suspense` for heavy or non-immediate routes/modals (e.g., in `settings-screen.tsx` and `App.tsx`).
- **URL State**: Filters, sorting, pagination, and active tabs are frequently managed in the URL using `nuqs` (e.g., `?tab=avatar&page=2`).

### System Integrations

1.  **Avatar System**: Supports `avvvatars` and `boring-avatars`, plus local file uploads (Base64). Managed in `src/components/user-avatar.tsx`.
2.  **Calendar System**: Generates Google Calendar URLs and `.ics` files. See `src/helpers/calendar-export.ts`.
3.  **Sound System**: Uses `cuelume` for hover/click/success feedback based on customizable settings.
4.  **Visitor Tracker**: Uses Upstash Redis via Vercel Edge (`api/visitors.ts`). It employs IP-based locking (`SET NX EX 86400`) to prevent spam/refresh inflation.

## 4. Agent Workflow Rules

1.  **Read Before Writing**: Always read `CURRENT_STATE.md` to understand where the project is before making architectural decisions.
2.  **Verify Assumptions**: If `instructions.md` says "Use Satoshi font", but the codebase uses `@fontsource-variable/geist`, the codebase wins.
3.  **Respect Boundaries**: Do not add dependencies if an existing tool does the job. Do not move feature-specific components into the global `src/components/` folder unless they are actually reused.
4.  **Documentation Maintenance**: If you add a new feature, a new dependency, or change a fundamental pattern, you **MUST** update `CURRENT_STATE.md` and `README.md` (if applicable) before concluding your task.
