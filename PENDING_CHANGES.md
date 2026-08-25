# Pending Changes

## Added

- Added an "Import Response" feature to the "Ask for a Birthday" modal, allowing iOS and PWA users to manually paste response links to guarantee data is saved in their installed app's storage rather than an isolated browser tab.

## Improved

- Updated Dashboard empty state CTA buttons to more accurate "Add a Person" and "Import or Sync" copywriting, and correctly routed the import button to the Data Management settings tab.
- Unified the Upcoming Birthdays badges to display a single, natural sentence (e.g. "Turning 28 in 5 days") that calculates future age dynamically.
- Polished the Data Management Settings layout by removing redundant shadows for a cleaner, flatter card aesthetic.
- Enhanced the PWA `/install` screen with a dedicated "Browser Installation" fallback state for desktop users to guide them toward manual browser-menu installation.
- Improved the PWA display-mode detection to accurately track installation status across `standalone`, `window-controls-overlay`, and `fullscreen` transitions without state conflicts.

## Fixed

- Fixed the Today's Celebrant modal wording to gracefully say "Now 28 years old" instead of "Turning 28".
- Fixed a layout bug in the "Ask for a Birthday" modal where long response links would stretch the UI out of bounds.
- Fixed a race condition on the `/install` page where the "Install App Now" button would fail to appear (showing "Installation Unavailable" instead) due to timing conflicts between React's render lifecycle and Chrome's `beforeinstallprompt` event.

## Changed

- Documented native telemetry support for `@vercel/analytics` and `@vercel/speed-insights` across architecture docs.

## Removed
