# Pending Changes

## Added

- **Animated Logo Variants**: Introduced new interactive SVG logo components (404, Backup, Crystal Ball, Notification) mapped to the `AnimatedLogo` component for expanded system feedback and empty states.

## Improved

- **Icon Organization**: Restructured the global icons directory by consolidating all SVG logo components into a dedicated `src/components/icons/logos/` folder for better maintainability.
- **Code Maintainability**: Refactored the main `BirthdayManagementScreen` component, extracting its complex filtering, floating bulk action bar, and modal orchestration logic into dedicated, reusable sub-components and a custom `useModalManager` hook. Additionally, centralized PWA TypeScript declarations to prevent code duplication.
- **Architecture**: Unified the repository pattern for consistency (converted `InvitationRepository` to a plain object literal). Eliminated reliance on external date parsing libraries (`date-fns` `parse()`) in favor of strict, native local Date instantiation to prevent timezone boundary fragmentation. Fortified the Zustand state rehydration with a robust `deepMerge` utility to prevent settings data loss on future updates.

- **About Screen Navigation**: Desktop table of contents (`LineNav`) now gracefully handles long release histories by utilizing a vertically centered layout with a maximum height and elegant custom scrollbar styling.
- **Build Performance**: Optimized Vite `manualChunks` configuration to explicitly isolate heavy dependencies (FullCalendar, Radix UI, PeerJS) into dedicated chunks. This resolved the "chunks larger than 500 kB" warning, reduced the size of the core React vendor chunk by ~72%, and significantly improves caching behavior and initial load times.

## Fixed

## Changed

## Removed
