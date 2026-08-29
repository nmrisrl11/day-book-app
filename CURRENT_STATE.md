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
- **UI Components:** Radix UI primitives via shadcn/ui, FullCalendar
- **Animation:** Framer Motion, `@animate-ui`, `react-joyride` (tours)
- **Form & Validation:** React Hook Form, Zod
- **Audio & UI Feedback:** `cuelume`, `goey-toast`
- **Virtualization:** `@tanstack/react-virtual`
- **URL State:** `nuqs`
- **Database (App):** IndexedDB (Dexie.js)
- **P2P Sync:** PeerJS (WebRTC)
- **Testing:** Vitest
- **Analytics & Monitoring:** `@vercel/analytics`, `@vercel/speed-insights`

## 3. Implemented Features Inventory

### Core Birthday & People Management (Fully Implemented)

- **Data Model**: Birthdays act as "Person Cards" with an ID, Name, Date, Avatar (Base64 or external ID), Relationship (Me, Family, Friend, Partner, Colleague, Other), and Notes (up to 5 lightweight string tags). Custom uploaded avatars are intelligently converted and optimized as WebP images to save IndexedDB space. The app natively supports precise age calculation for babies with fractional ages ("months old", "days old", "Newborn").
- **Time Architecture**: A globally synchronized `useCurrentDate` hook acts as the definitive single source of truth for the local date across the entire app. It updates automatically at local midnight in the background, ensuring users never see stale "today" states if they leave the application open overnight.
- **CRUD & Bulk**: Create, Read, Update, Delete functionality for birthdays. Users can select multiple records in the Management screens to assign relationships in bulk (Birthdays only) or perform bulk deletions (both for Birthdays and Invitation Links). The Management lists use virtualization (`@tanstack/react-virtual`) to effortlessly handle thousands of records without freezing.
- **Persistence**: Handled client-side via IndexedDB (Dexie.js) for birthday records, enabling superior performance and massive storage limits. Application settings remain securely in `localStorage` via Zustand `persist`. A one-time backward-compatible data migration automatically upgrades users to IndexedDB.
- **Validation**: Strict validation centralized in `validation-constants.ts` enforced via Zod schemas (`birthday-schema.ts`, `settings-schema.ts`) and native HTML `maxLength`/`minLength` attributes.
- **Invitations / Links**: Fully local-first link sharing system. Users can generate an Invitation link (with variable expiration, e.g. 24h, 7d, or never, using a Base64Url token) to send to friends. Friends fill it out on the `/invite` route and generate a Response link (`/invite/response`), allowing easy data ingestion without a backend. Receivers of the link can select a relationship upon importing. The sharing flow features delightful animated SVG icons representing the current state (Invite, Share, Response, Warning). The generated invitation links are tracked in their own dedicated table in IndexedDB for easy management, tracking, and revocation.

### Dashboard & Views (Fully Implemented)

- **Happy Birthday Section**: Displays today's celebrants with random confetti. Interactive modals for celebrant details.
- **Upcoming Birthdays**: Scrollable list of the next N birthdays (N is configurable in Settings), complete with "days until" indicators.
- **Birthdays by Month**: 12-month grid indicating which months have birthdays. Clickable month modals showing grouped celebrants, alongside a fully interactive FullCalendar month view accessible via a tab toggle on the dashboard.
- **Quick Action Toolbar**: A draggable, edge-dockable floating toolbar on the dashboard providing instant access to Avatar and Main Greeting customizations.
- **Empty States**: Beautiful empty states when no birthdays exist, featuring an animated interactive brand logo (`AnimatedLogo`).
- **Interactive Onboarding**: A route-aware, first-time user tutorial powered by `react-joyride` that gently introduces the app's core value proposition (including Birthdays, Invitations, and Settings). It utilizes a low-friction approach (floating toast hint) rather than a forced auto-start, and safely persists state to `localStorage`. It also features contextual, on-demand educational tours for complex areas like Data Management.
- **Navigation Structure**: The primary header navigation strictly surfaces high-frequency features (Birthdays, Invitations, Settings). Secondary application routes (About, Install App) are deliberately housed in the global footer to prevent cognitive overload.
- **About Page (Product Overview)**: A dedicated `/about` page detailing the app's features, privacy-first principles, open-source architecture, and a user-friendly changelog. Features a dynamic "Line Nav" table of contents that tracks scroll position on desktop and slides in as a mobile drawer via Framer Motion, with smooth scrolling behavior globally enabled.

### Settings & Customization (Beyond Original Scope)

Settings has grown into a full `/settings` route with 6 tabs managed by `nuqs` URL state, featuring a modern, cohesive, and fully responsive layout across all sections:

1.  **Appearance**: Theme toggle (Light/Dark) and Display settings (Upcoming count limit, animations, quick actions).
2.  **Main Greeting**: Customize the dashboard "Happy Birthday" text, typography, and color styling (Solid/Gradient).
3.  **Avatar**: Choose between `boring-avatars` (default) and `avvvatars`, and enable/disable custom image uploads.
4.  **Messages & Greetings**: Manage floating text items, enable custom greetings, and define personalized greeting messages for birthdays.
5.  **Sound & Feedback**: Configure `cuelume` hover/click/success/error sound mappings and volume. UI feedback notifications use `goey-toast` for playful, premium animations.
6.  **Data Management**: Features a Storage Overview section to monitor browser data usage and enable Persistent Storage protection. **Device Sync (P2P)** enables direct, secure local network synchronization of the entire database (birthdays, invitations, settings) via WebRTC (using PeerJS Cloud for connection signaling and public TURN servers for traversal). All Import/Export functions (Birthdays, Calendar, Invitations, Settings) are consolidated into a compact list layout. The virtualized Import Preview Dialog handles duplicate reviewing and selective importing smoothly for 1,000+ items. **Settings Import Preview** allows users to visually diff incoming settings against current settings before applying them. Finally, the Danger Zone provides explicitly separated destructive actions (Delete All Birthdays, Delete All Invitations, Reset All Settings) each guarded by a generic ActionConfirmationModal and export-first safety hints.

### System Integrations

- **Calendar**: Google Calendar add-event links and `.ics` file generation and download (`helpers/calendar-export.ts`). ICS Import correctly parses and restores relationships and notes from DayBook exports. On mobile devices, ICS exports utilize the Web Share API to invoke the native OS Share Sheet for seamless one-tap calendar importing.
- **Dynamic Open Graph (OG) Previews**: Uses a lightweight Vercel Edge Function (`api/og-rewriter.ts`) and `vercel.json` rewrites to dynamically inject specific social media preview images (Twitter/Facebook cards) when sharing `/invite` or `/response` links.
- **Analytics**: Integrated `@vercel/analytics` and `@vercel/speed-insights` to provide fully anonymized basic usage and performance metrics without needing to collect or hash user IPs.
- **Progressive Web App (PWA)**: Installable, offline-capable application built via `vite-plugin-pwa` with Workbox generating the service worker. It precaches all assets and fonts for complete offline functionality. It features a dedicated `/install` route for managing the installation experience seamlessly across different platforms (including custom iOS manual instructions), and playful gooey toast notifications that alert users when they lose connection or come back online.
- **Centralized Branding**: The application brand name, title, description, keywords, and theme colors are strictly centralized in `src/constants/app-info.ts` ensuring a single source of truth that is dynamically injected into the PWA manifest, HTML templates via Vite plugin, and all static UI components.
- **Agentic Browsing**: Includes a structured `llms.txt` file built to `llmstxt.org` specifications, providing web-crawling LLMs and AI agents with precise access to architecture docs and official resources.
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
│   │   ├── icons/   # AnimatedLogo and other global icons
│   │   │   ├── logos/ # Individual SVG React components for logos
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

## 5. Current Development Focus

- DayBook is currently in a highly stable, performant state.
- A full performance audit and optimization pass was recently completed, resulting in near-perfect Lighthouse scores. This included aggressive route-level and component-level (avatar libraries) chunk splitting, semantic heading restructuring, and comprehensive screen-reader ARIA optimizations (labeling and decorative icon hiding) across the entire application, alongside strict PWA static asset pre-caching. The build configuration (`vite.config.ts`) has also been precisely tuned to isolate heavy dependencies (FullCalendar, Radix UI) and prevent oversized chunk warnings.
- Ongoing monitoring of PWA behavior across devices.
