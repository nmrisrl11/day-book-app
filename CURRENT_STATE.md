# CURRENT STATE

> **Last Updated**: August 2026

This document is a living snapshot of the DayBook project's current state. It reflects what is actually implemented in the codebase right now.

## 1. Project Status

DayBook is a fully functional, local-first React application. While originally specified as a pure birthday tracker, it has evolved into a relationship-centric "People CRM," storing relationships and notes alongside birthdays. All core features from the original product specification are implemented, with significant additions (custom avatars, sound systems, settings management) beyond the original scope.

## 2. Technology Stack

- **React:** 19.x
- **Vite:** 6.x
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS 4.x
- **State Management:** Zustand 5.x
- **Routing:** React Router DOM 7.x
- **UI Components:** Radix UI primitives via shadcn/ui
- **Animation:** Framer Motion, `@animate-ui`
- **Form & Validation:** React Hook Form, Zod
- **Audio & UI Feedback:** `cuelume`, `goey-toast`
- **Virtualization:** `@tanstack/react-virtual`
- **URL State:** `nuqs`
- **Database (App):** IndexedDB (Dexie.js)
- **Testing:** Vitest

## 3. Implemented Features Inventory

### Core Birthday & People Management (Fully Implemented)

- **Data Model**: Birthdays act as "Person Cards" with an ID, Name, Date, Avatar (Base64 or external ID), Relationship (Me, Family, Friend, Partner, Colleague, Other), and Notes (up to 5 lightweight string tags). Custom uploaded avatars are intelligently converted and optimized as WebP images to save IndexedDB space.
- **CRUD & Bulk**: Create, Read, Update, Delete functionality for birthdays. Users can also select multiple people in the Management screen to assign relationships in bulk. The Management list uses virtualization (`@tanstack/react-virtual`) to effortlessly handle thousands of records without freezing.
- **Persistence**: Handled client-side via IndexedDB (Dexie.js) for birthday records, enabling superior performance and massive storage limits. Application settings remain securely in `localStorage` via Zustand `persist`. A one-time backward-compatible data migration automatically upgrades users to IndexedDB.
- **Validation**: Strict validation centralized in `validation-constants.ts` enforced via Zod schemas (`birthday-schema.ts`, `settings-schema.ts`) and native HTML `maxLength`/`minLength` attributes.
- **Invitations / Links**: Fully local-first link sharing system. Users can generate an Invitation link (24h expiration, Base64Url token) to send to friends. Friends fill it out on the `/invite` route and generate a Response link (`/response`), allowing easy data ingestion without a backend. Receivers of the link can select a relationship upon importing.

### Dashboard & Views (Fully Implemented)

- **Happy Birthday Section**: Displays today's celebrants with random confetti. Interactive modals for celebrant details.
- **Upcoming Birthdays**: Scrollable list of the next N birthdays (N is configurable in Settings), complete with "days until" indicators.
- **Birthdays by Month**: 12-month grid indicating which months have birthdays. Clickable month modals showing grouped celebrants.
- **Empty States**: Beautiful empty states when no birthdays exist, featuring an animated interactive brand logo.
- **About Page (Product Overview)**: A dedicated `/about` page detailing the app's features, privacy-first principles, open-source architecture, and a user-friendly changelog. Features a dynamic "Line Nav" table of contents that tracks scroll position on desktop and slides in as a mobile drawer via Framer Motion, with smooth scrolling behavior globally enabled.

### Settings & Customization (Beyond Original Scope)

Settings has grown into a full `/settings` route with 6 tabs managed by `nuqs` URL state:

1.  **Appearance**: Theme toggle (Light/Dark) and Display settings (Upcoming count limit).
2.  **Main Greeting**: Customize the dashboard "Happy Birthday" text, typography, and color styling (Solid/Gradient).
3.  **Avatar**: Choose between `boring-avatars` (default) and `avvvatars`, and enable/disable custom image uploads.
4.  **Messages & Greetings**: Manage the floating text items and the randomized greeting pool.
5.  **Sound & Feedback**: Configure `cuelume` hover/click/success/error sound mappings and volume. UI feedback notifications use `goey-toast` for playful, premium animations.
6.  **Data Management**: Features a Storage Overview section to monitor browser data usage and enable Persistent Storage protection. Unified virtualized Import Preview Dialog for both JSON and ICS files (handles duplicate reviewing and selective importing smoothly for 1,000+ items). Export Birthdays, Import/Export Settings separately, and Danger Zone (Delete All with export-first safety).

### System Integrations

- **Calendar**: Google Calendar add-event links and `.ics` file generation and download (`helpers/calendar-export.ts`). ICS Import correctly parses and restores relationships and notes from DayBook exports. On mobile devices, ICS exports utilize the Web Share API to invoke the native OS Share Sheet for seamless one-tap calendar importing.
- **Dynamic Open Graph (OG) Previews**: Uses a lightweight Vercel Edge Function (`api/og-rewriter.ts`) and `vercel.json` rewrites to dynamically inject specific social media preview images (Twitter/Facebook cards) when sharing `/invite` or `/response` links.
- **Analytics**: Integrated `@vercel/analytics` and `@vercel/speed-insights` to provide fully anonymized basic usage and performance metrics without needing to collect or hash user IPs.
- **Progressive Web App (PWA)**: Installable, offline-capable application built via `vite-plugin-pwa` with Workbox generating the service worker. It precaches all assets and fonts for complete offline functionality. It features a dedicated `/install` route for managing the installation experience seamlessly across different platforms (including custom iOS manual instructions), and playful gooey toast notifications that alert users when they lose connection or come back online.
- **Centralized Branding**: The application brand name, title, description, keywords, and theme colors are strictly centralized in `src/constants/app-info.ts` ensuring a single source of truth that is dynamically injected into the PWA manifest, HTML templates via Vite plugin, and all static UI components.
- **Open Source Licensing**: The repository is officially licensed under the **MIT License**, permitting unrestricted community adoption, forking, and modification.

## 4. Current Architecture Details

### File Structure

```text
day-book-app/
├── api/             # Vercel serverless functions
├── docs/            # Rules, original instructions, guidelines
├── public/          # Static assets, webmanifest
├── src/
│   ├── components/  # Global components (Layout, UI primitives)
│   ├── constants/   # Default configs, settings boundaries
│   ├── features/    # Domain modules (dashboard, management, settings)
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── today/       # Happy birthday & celebrants UI
│   │   │   │   ├── upcoming/    # Upcoming birthdays list
│   │   │   │   └── calendar/    # Monthly views
│   │   │   └── dashboard.tsx
│   │   └── settings/
│   │       ├── components/
│   │       │   ├── appearance/  # Theme, display settings
│   │       │   ├── messages/    # Greetings, floating text
│   │       │   ├── data/        # DB, imports, storage
│   │       │   └── ...          # other tabs (sound, avatar, main-greeting)
│   │       └── settings-screen.tsx
│   ├── helpers/     # Utils (dates, calendar, import/export)
│   ├── hooks/       # Custom React hooks (drag scroll, media query)
│   ├── schema/      # Zod validation schemas
│   ├── store/       # Zustand store definitions
│   └── types/       # Shared TS interfaces
```

### Known Issues & Technical Debt

- **Stale Closures**: Because the settings state is tightly bound to the UI (e.g. debounced color pickers), `updateSettings` calls must frequently fetch the latest state inside the execution block using `useDayBookStore.getState()`. This pattern is established but fragile.
- **Migration Code Cleanup**: The application currently mounts a `<StorageMigration />` component on initialization to migrate legacy `localStorage` birthday data to IndexedDB. This should be removed in a future release (e.g., v2.0.0) once all users are safely migrated, to reduce initialization overhead.

## 5. Current Development Focus

- DayBook is currently in a highly stable, performant state.
- A full performance audit and optimization pass was recently completed, resulting in near-perfect Lighthouse scores. This included aggressive route-level and component-level (avatar libraries) chunk splitting, semantic heading restructuring, and comprehensive screen-reader ARIA optimizations (labeling and decorative icon hiding) across the entire application, alongside strict PWA static asset pre-caching.
- Ongoing monitoring of PWA behavior across devices.
