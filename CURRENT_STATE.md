# CURRENT STATE

> **Last Updated**: August 2026

This document is a living snapshot of the DayBook project's current state. It reflects what is actually implemented in the codebase right now.

## 1. Project Status

DayBook is a fully functional, local-first birthday tracking application. All core features from the original product specification are implemented. Several significant features (custom avatars, sound systems, settings management) have been added beyond the original scope.

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
- **Audio Feedback:** `cuelume`
- **URL State:** `nuqs`
- **Database (Analytics Only):** Upstash Redis (Serverless)

## 3. Implemented Features Inventory

### Core Birthday Management (Fully Implemented)

- **Data Model**: Birthdays have ID, Name, Date, Avatar (Base64 or external ID).
- **CRUD**: Create, Read, Update, Delete functionality for birthdays.
- **Persistence**: Handled entirely client-side via `localStorage` via Zustand `persist`.
- **Validation**: Zod schema prevents empty names, handles bad dates, and limits Base64 upload sizes.

### Dashboard & Views (Fully Implemented)

- **Happy Birthday Section**: Displays today's celebrants with random confetti. Interactive modals for celebrant details.
- **Upcoming Birthdays**: Scrollable list of the next N birthdays (N is configurable in Settings).
- **Birthdays by Month**: 12-month grid indicating which months have birthdays. Clickable month modals showing grouped celebrants.
- **Empty States**: Beautiful empty states when no birthdays exist.

### Settings & Customization (Beyond Original Scope)

Settings has grown into a full `/settings` route with 6 tabs managed by `nuqs` URL state:

1.  **Appearance**: Theme toggle (Light/Dark) and Display settings (Upcoming count limit).
2.  **Main Greeting**: Customize the dashboard "Happy Birthday" text, typography, and color styling (Solid/Gradient).
3.  **Avatar**: Choose between `avvvatars` (character/shape), `boring-avatars` (marble/beam/pixel/etc.), and enable/disable custom image uploads.
4.  **Messages & Greetings**: Manage the floating text items and the randomized greeting pool.
5.  **Sound & Feedback**: Configure `cuelume` hover/click/success/error sound mappings and volume.
6.  **Data Management**: Import/Export Birthdays, Import/Export Settings separately, and Danger Zone (Delete All with export-first safety).

### System Integrations

- **Calendar**: Google Calendar add-event links and `.ics` file generation and download (`helpers/calendar-export.ts`).
- **Visitor Tracking**: Public endpoint (`/api/visitors`) using Vercel Edge functions and Upstash Redis. Uses `INCR` and `SET NX EX 86400` for 24-hour IP-based unique visitor counting.

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
- **PWA Completeness**: `public/site.webmanifest` exists, but there is no Service Worker registration. The app is not fully installable or offline-capable yet.
- **React Scan**: `<script crossorigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js"></script>` is currently hardcoded in `index.html` for performance debugging.

## 5. Current Development Focus

- Documentation audit and reorganization (AGENTS.md, CURRENT_STATE.md).
- Future: Complete PWA implementation (Service Worker, offline caching, install prompts).
- Future: Form migration (some legacy forms might still need converting to `react-hook-form`).
