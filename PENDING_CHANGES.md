# Pending Changes

## Added

## Improved

- **Performance**: Integrated the React Compiler (`babel-plugin-react-compiler`) to automatically memoize components and hooks, eliminating manual `useMemo` and `useCallback` boilerplate in selected migrated hooks and components, and improving rendering efficiency.
- **Accessibility**: Enhanced the P2P device sync interface with `aria-live="polite"` to dynamically announce connection status changes to screen readers. Resolved multiple WCAG compliance findings, including adding a "Skip to main content" link for keyboard navigation, enforcing proper semantic heading (`<h1>`) hierarchy on the Dashboard and Settings, increasing footer touch targets to 44x44px minimums, and improving text color contrast in Light mode.
- **Tooling**: Migrated codebase formatting and linting to Oxc (`oxfmt` and `oxlint`) for significantly faster and more robust code validation.

## Fixed

## Changed

## Removed
