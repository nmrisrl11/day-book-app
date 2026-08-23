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

### Core Philosophy: Remember People, Not Just Dates

While originally conceived as a "birthday tracker," the product is evolving into a lightweight "People CRM." A birthday record acts as a **person card**, holding relationship context and small pieces of personal information (notes/tags) to help the user remember the person holistically. All features should reflect this broader relationship-centric context.

### Technology Stack (Actual)

- **Core**: React 19, TypeScript, Vite 6
- **State & Persistence**: Zustand (with `persist` middleware to `localStorage` for settings), IndexedDB (via Dexie.js for birthday records)
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS (v4)
- **UI Primitives**: shadcn/ui (Radix UI under the hood)
- **Animation & Interactions**: Framer Motion, `@animate-ui`, `cuelume` (for sounds)
- **Forms & Validation**: React Hook Form, Zod
- **URL State Management**: `nuqs`
- **Deployment**: Vercel (Edge Functions used for dynamic OG previews)
- **Testing**: Vitest

### Directory Structure Philosophy

- **`src/features/`**: The core of the app. Domain-driven modules (e.g., `dashboard`, `management`, `settings`). Each feature encapsulates its own components and local logic. Complex features further nest their components into logical UI subfolders (e.g., tabs or sections) to prevent component sprawl, keeping shared feature components at the root of their `components/` folder.
- **`src/components/`**: Global, reusable UI components (e.g., `user-avatar`, `interactive-logo`, layouts).
- **`src/components/ui/`**: **STRICTLY** for shadcn/ui and external un-opinionated primitives (like `@animate-ui`). Do not put business components here.
- **`src/store/`**: Global state management (Zustand).
- **`src/hooks/`**, **`src/helpers/`**, **`src/constants/`**, **`src/types/`**, **`src/schema/`**: Standard shared utilities.
- **`api/`**: Vercel Serverless/Edge functions (currently only for Redis-backed visitor tracking).

## 3. Core Architectural Patterns

### The Data Layer (IndexedDB + Zustand)

- The single source of truth for all user data is IndexedDB (Birthdays) and the Zustand store (Settings, Greetings, Floating Messages).
- **Rule**: When updating state asynchronously or inside debounced functions (e.g., color pickers, settings toggles), **always use `useDayBookStore.getState()`** to get the latest state before spreading/modifying. Stale closures are a known risk in this architecture.
- **Rule**: Components querying birthday data must use `useLiveQuery` coupled with `BirthdayRepository`. Direct database access should be avoided.
- **Rule**: The `Birthday` type and `Settings` type are the fundamental data structures. See `src/types/`.

### The Presentation Layer

- **Derived Data**: The Dashboard derives `todayCelebrants`, `upcomingBirthdays`, and `birthdaysByMonth` dynamically from the store via `useBirthdayData`. Do not duplicate this logic.
- **Performance**: Use React `lazy` and `Suspense` for heavy or non-immediate routes/modals (e.g., in `settings-screen.tsx` and `App.tsx`).
- **URL State**: Filters, sorting, pagination, and active tabs are frequently managed in the URL using `nuqs` (e.g., `?tab=avatar&page=2`).

### System Integrations

1.  **Avatar System**: Supports `avvvatars` and `boring-avatars`, plus local file uploads (Base64). Managed in `src/components/user-avatar.tsx`.
2.  **Calendar System**: Generates Google Calendar URLs and `.ics` files. See `src/helpers/calendar-export.ts`.
3.  **Sound System**: Uses `cuelume` for hover/click/success feedback based on customizable settings.
4.  **Analytics & Performance**: Uses `@vercel/analytics` and `@vercel/speed-insights` for basic usage and performance telemetry. All telemetry is anonymized by Vercel and completely external to the application itself.
5.  **Birthday Links & Data Ingestion**: Client-side parsing of Base64Url JSON tokens (`helpers/invitation-token.ts`) enables users to request and respond to birthday invites without a backend. Parse functions gracefully tolerate missing optional fields.
6.  **Dynamic Open Graph (OG) Previews**: Utilizes a Vercel Edge Function (`api/og-rewriter.ts`) alongside `vercel.json` rewrites to intercept `/invite(.*)` and `/response(.*)` to inject tailored preview images for social sharing.
7.  **Branding & Meta**: All application branding (name, title, description, keywords, theme colors) is centralized in `src/constants/app-info.ts`. This single source of truth is injected dynamically into the Vite PWA manifest, HTML meta tags, and React components.

## 4. Agent Workflow Rules

1.  **Read Before Writing**: Always read `CURRENT_STATE.md` to understand where the project is before making architectural decisions. Read `PENDING_CHANGES.md` to understand unreleased work.
2.  **Verify Assumptions**: If `instructions.md` says "Use Satoshi font", but the codebase uses `@fontsource-variable/fredoka`, the codebase wins.
3.  **Respect Boundaries**: Do not add dependencies if an existing tool does the job. Do not move feature-specific components into the global `src/components/` folder unless they are actually reused.
4.  **Documentation Maintenance**: Update `CURRENT_STATE.md` **only** when the implementation state or architecture has materially changed. Do not update it for every minor bug fix.

## 5. Changelog, Versioning & Development Workflow

To ensure product changes are consistently recorded, all AI agents must follow this development lifecycle:

### The Lifecycle

1. **Development**: Implement features/fixes.
2. **Pending**: Record user-facing changes immediately in `PENDING_CHANGES.md` under categories (`Added`, `Improved`, `Fixed`, `Changed`, `Removed`). Do this before finishing your task.
3. **Release**: When intentionally releasing an update:
   - Group related pending changes into concise product features.
   - Write polished, App Store-friendly copy (user-focused, non-technical). Example: "Remember more about the people you love" instead of "Added relationship to schema".
   - Select an appropriate semantic version bump based on the accumulated changes.
   - Update `package.json` with the new version.
   - Add the release entry to `src/data/changelog.ts` with the new version, today's date (YYYY-MM-DD), and the grouped changes.
   - Clear or archive the released entries from `PENDING_CHANGES.md`.

### Copywriting Rules

- **Never write developer commit logs**. The changelog answers "What does this mean for the user?", not "What did the developer change?".
- Always check project constants (e.g., `src/constants/app-info.ts`) to use exact existing product terminology.

### Source of Truth Hierarchy

- **Codebase**: Source of truth for actual implementation.
- **`PENDING_CHANGES.md`**: Source of truth for _unreleased_ user-facing changes.
- **`src/data/changelog.ts`**: Source of truth for _released_ user-facing changes.
- **`CURRENT_STATE.md`**: Source of truth for current product/architecture state.
- **`package.json`**: Source of truth for the active application version.
