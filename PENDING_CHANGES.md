# Pending Changes

## Added

- **Backup Reminders**: Implemented a contextual, non-intrusive backup reminder banner on the Dashboard. It dynamically prompts users with significant data to export their records if they haven't backed up in the last 30 days, while gracefully yielding to the welcome tour. This backup schedule is strictly isolated per-device and does not overwrite other devices during P2P Sync or Settings Import.

## Improved

- **Performance**: Integrated the React Compiler (`babel-plugin-react-compiler`) to automatically memoize components and hooks, eliminating manual `useMemo` and `useCallback` boilerplate across core hooks (like `useBirthdayData`) to improve rendering efficiency. Additionally, optimized heavy date-parsing loops by implementing a lightweight in-memory cache, drastically reducing CPU overhead during large list renders.
- **Accessibility**: Enhanced the P2P device sync interface with `aria-live="polite"` to dynamically announce connection status changes to screen readers. Resolved multiple WCAG compliance findings, including adding a "Skip to main content" link for keyboard navigation, enforcing proper semantic heading (`<h1>`) hierarchy on the Dashboard and Settings, increasing footer touch targets to 44x44px minimums, and improving text color contrast in Light mode.
- **Tooling**: Migrated codebase formatting and linting to Oxc (`oxfmt` and `oxlint`) for significantly faster and more robust code validation.

## Fixed

## Changed

## Removed
