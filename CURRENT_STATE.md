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
- **Database (Analytics Only):** Upstash Redis (Serverless)

## 3. Implemented Features Inventory

### Core Birthday & People Management (Fully Implemented)

- **Data Model**: Birthdays act as "Person Cards" with an ID, Name, Date, Avatar (Base64 or external ID), Relationship (Family, Friend, Partner, Colleague, Other), and Notes (up to 5 lightweight string tags).
- **CRUD & Bulk**: Create, Read, Update, Delete functionality for birthdays. Users can also select multiple people in the Management screen to assign relationships in bulk. The Management list uses virtualization (`@tanstack/react-virtual`) to effortlessly handle thousands of records without freezing.
- **Persistence**: Handled entirely client-side via `localStorage` via Zustand `persist`. Backward compatible data migrations handle legacy formats.
- **Validation**: Strict validation centralized in `validation-constants.ts` enforced via Zod schemas (`birthday-schema.ts`, `settings-schema.ts`) and native HTML `maxLength`/`minLength` attributes.
- **Invitations / Links**: Fully local-first link sharing system. Users can generate an Invitation link (24h expiration, Base64Url token) to send to friends. Friends fill it out on the `/invite` route and generate a Response link (`/response`), allowing easy data ingestion without a backend. Receivers of the link can select a relationship upon importing.

### Dashboard & Views (Fully Implemented)

- **Happy Birthday Section**: Displays today's celebrants with random confetti. Interactive modals for celebrant details.
- **Upcoming Birthdays**: Scrollable list of the next N birthdays (N is configurable in Settings).
- **Birthdays by Month**: 12-month grid indicating which months have birthdays. Clickable month modals showing grouped celebrants.
- **Empty States**: Beautiful empty states when no birthdays exist.
- **About Page (Product Overview)**: A dedicated `/about` page detailing the app's features, privacy-first principles, and a user-friendly changelog. Features a dynamic "Line Nav" table of contents that tracks scroll position on desktop and slides in as a mobile drawer via Framer Motion.

### Settings & Customization (Beyond Original Scope)

Settings has grown into a full `/settings` route with 6 tabs managed by `nuqs` URL state:

1.  **Appearance**: Theme toggle (Light/Dark) and Display settings (Upcoming count limit).
2.  **Main Greeting**: Customize the dashboard "Happy Birthday" text, typography, and color styling (Solid/Gradient).
3.  **Avatar**: Choose between `avvvatars` (character/shape), `boring-avatars` (marble/beam/pixel/etc.), and enable/disable custom image uploads.
4.  **Messages & Greetings**: Manage the floating text items and the randomized greeting pool.
5.  **Sound & Feedback**: Configure `cuelume` hover/click/success/error sound mappings and volume. UI feedback notifications use `goey-toast` for playful, premium animations.
6.  **Data Management**: Unified virtualized Import Preview Dialog for both JSON and ICS files (handles duplicate reviewing and selective importing smoothly for 1,000+ items). Export Birthdays, Import/Export Settings separately, and Danger Zone (Delete All with export-first safety).

### System Integrations

- **Calendar**: Google Calendar add-event links and `.ics` file generation and download (`helpers/calendar-export.ts`). ICS Import correctly parses and restores relationships and notes from DayBook exports.
- **Dynamic Open Graph (OG) Previews**: Uses a lightweight Vercel Edge Function (`api/og-rewriter.ts`) and `vercel.json` rewrites to dynamically inject specific social media preview images (Twitter/Facebook cards) when sharing `/invite` or `/response` links.
- **Visitor Tracking**: Public endpoint (`/api/visitors`) using Vercel Edge functions and Upstash Redis. Uses `INCR` and `SET NX EX 86400` for 24-hour unique visitor counting. IP addresses are completely anonymized via one-way SHA-256 hashing _before_ being used as lock keys, guaranteeing no PII is ever stored and maintaining the privacy-first architecture. Local development environments safely bypass this API to preserve limits.
- **Progressive Web App (PWA)**: Installable, offline-capable application built via `vite-plugin-pwa` with Workbox generating the service worker. It includes a custom update prompt for graceful updates, custom iOS install instructions (to bypass Safari limitations), and gooey toast notifications for online/offline status changes.
- **Centralized Branding**: The application brand name, title, description, keywords, and theme colors are strictly centralized in `src/constants/app-info.ts` ensuring a single source of truth that is dynamically injected into the PWA manifest, HTML templates via Vite plugin, and all static UI components.

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
│   ├── helpers/     # Utils (dates, calendar, import/export)
│   ├── hooks/       # Custom React hooks (drag scroll, media query)
│   ├── schema/      # Zod validation schemas
│   ├── store/       # Zustand store definitions
│   └── types/       # Shared TS interfaces
```

### Known Issues & Technical Debt

- **Stale Closures**: Because the settings state is tightly bound to the UI (e.g. debounced color pickers), `updateSettings` calls must frequently fetch the latest state inside the execution block using `useDayBookStore.getState()`. This pattern is established but fragile.

## 5. Current Development Focus

- DayBook is currently in a highly stable, performant state.
- A full performance audit and optimization pass was recently completed (bundle splitting `node_modules`, sorting logic optimization via Schwartzian transform, and asynchronous font loading).
- Ongoing monitoring of PWA behavior across devices.
