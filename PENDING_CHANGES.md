# Pending Changes

## Added

- Added standard open-source MIT License to the repository to explicitly clarify open-source distribution and encourage community adoption. Added proper authorship metadata to `package.json`.
- Introduced a dedicated `/install` route and screen to manually manage the Progressive Web App (PWA) installation experience across different platforms, including providing clear manual instructions for iOS Safari where programmatic installation is unsupported.
- Introduced an `isLoading` state within the `useBirthdayManagement` and `useBirthdayData` hooks to ensure the skeleton loading UI persists until the IndexedDB fetch resolves, preventing a jarring flash of the "Empty State" UI on initial load across the Management and Dashboard screens.

## Improved

- Eliminated the unnecessary skeleton loading screen for completely empty databases by instantly rendering the Empty State, ensuring zero layout shift on initial application load. Empty state buttons are gracefully disabled until the route chunk finishes downloading.
- Abstracted and cleanly co-located Empty State components (`DashboardEmptyState`, `ManageEmptyState`) into their respective feature directories to improve architectural modularity.
- Added a playful, lightweight micro-interaction to the DayBook logo across the app (About, Install, and Empty Dashboard screens) featuring a subtle jelly bounce and particle effect on click, while gracefully respecting reduced motion preferences.
- Relocated the "Install App" link from the primary navigation header to the footer for a cleaner primary UI while maintaining PWA discoverability.
- Consolidated navigation link buttons in the Page Layout to utilize the central `buttonVariants` for a single source of truth in styling.
- Optimized the Settings tab ordering by prioritizing the Avatar configuration (moving it to the second position) and restoring Appearance as the default open tab.
- Enhanced the UI layout of the shareable link displays (in both the Ask Birthday and Invitation Response screens) by explicitly enabling flex item shrinking (`min-w-0`), ensuring long encrypted URLs truncate cleanly via `text-ellipsis` and no longer break the modal layout bounds on narrow viewports.

## Fixed

- Patched a memory leak within the JSON and ICS file import flow where large parsed datasets would persist in memory indefinitely if the preview dialog was cancelled.

- Fixed a TypeScript build error by removing the unused `SettingsImport` local type in `settings-schema.ts`.
- Fixed the "flash of empty state" when navigating to the Birthday Management screen and the Dashboard by properly tracking Dexie query resolution.
- Fixed a race condition where the `beforeinstallprompt` event could be missed due to lazy-loaded routes by capturing the event globally on the `window` object in `main.tsx`/`App.tsx`.

## Changed

- Clarified privacy disclosures across the app (About screen, README, llms.txt) to reflect that while core data is local, invitation links encode birthday data, and route-level telemetry filtering is actively enforced.
- Removed the manual audio-context unlock listener from `App.tsx` as recent interactions handle it natively.

## Removed

- Removed the legacy `<StorageMigration />` component and checking logic from the initial application load, as backward compatibility for transferring legacy `localStorage` birthday records is no longer required.
- Removed the unused `ScrollToTop` component and associated `useLocation` import from `App.tsx` which was causing a bug with the avatar color randomization.
- Removed unused `ui/avatar.tsx` component and unused export definitions across `changelog.ts`, `settings-schema.ts`, `use-is-in-view.ts`, and `db.ts` to keep the codebase lean and resolve static analysis warnings.
