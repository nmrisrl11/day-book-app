# Pending Changes

## Added

- **Backup Reminders**: Implemented a contextual, non-intrusive backup reminder banner on the Dashboard. It dynamically prompts users with significant data to export their records if they haven't backed up in the last 30 days, while gracefully yielding to the welcome tour. This backup schedule is strictly isolated per-device and does not overwrite other devices during P2P Sync or Settings Import.

## Improved

- **Performance**: Integrated the React Compiler (`babel-plugin-react-compiler`) to automatically memoize components and hooks, eliminating manual `useMemo` and `useCallback` boilerplate across core hooks (like `useBirthdayData`) to improve rendering efficiency. Additionally, optimized heavy date-parsing loops by implementing a lightweight in-memory cache, drastically reducing CPU overhead during large list renders.
- **Accessibility**: Enhanced the P2P device sync interface with `aria-live="polite"` to dynamically announce connection status changes to screen readers. Resolved multiple WCAG compliance findings, including adding a "Skip to main content" link for keyboard navigation, enforcing proper semantic heading (`<h1>`) hierarchy on the Dashboard and Settings, increasing footer touch targets to 44x44px minimums, and improving text color contrast in Light mode.
- **Privacy & Security**:
  - Mitigated risks around unencrypted URL response tokens by shortening their lifetime from 24 hours to 12 hours, and added an explicit warning to the UI advising users not to post these convenience links publicly.
  - Obfuscated predictable `localStorage` keys (e.g., `daybook-storage` to base64 hashes) to prevent automated discovery by third-party scripts, including an automatic backward-compatible migration strategy.
- **Tooling**: Migrated codebase formatting and linting to Oxc (`oxfmt` and `oxlint`) for significantly faster and more robust code validation.

## Fixed

- **Timezone Robustness**: Fixed an edge-case where displayed birthdays might shift across calendar boundaries if a user traveled between timezones while the app remained open. The internal date parsing cache now dynamically adapts to the current runtime timezone.
- **Backup Banner State**: Fixed the dashboard backup reminder banner so its visibility actively recalculates and triggers automatically without requiring a full page reload if the 30-day deadline expires while the application is open.

## Changed

## Removed
