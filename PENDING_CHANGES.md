# Pending Changes

## Added

- **Animated Logo Variants**: Introduced new interactive SVG logo components (404, Backup, Crystal Ball, Notification) mapped to the `AnimatedLogo` component for expanded system feedback and empty states.

## Improved

- **Icon Organization**: Restructured the global icons directory by consolidating all SVG logo components into a dedicated `src/components/icons/logos/` folder for better maintainability.

- **About Screen Navigation**: Desktop table of contents (`LineNav`) now gracefully handles long release histories by utilizing a vertically centered layout with a maximum height and elegant custom scrollbar styling.
- **Build Performance**: Optimized Vite `manualChunks` configuration to explicitly isolate heavy dependencies (FullCalendar, Radix UI, PeerJS) into dedicated chunks. This resolved the "chunks larger than 500 kB" warning, reduced the size of the core React vendor chunk by ~72%, and significantly improves caching behavior and initial load times.

## Fixed

## Changed

## Removed
