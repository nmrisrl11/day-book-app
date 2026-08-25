# Pending Changes

## Added

- **Generated Links Management**: Added a new tab in the Manage screen to view, copy, share, and delete previously generated birthday invitation links.
- Implemented variable link expiration support (24 hours, 7 days, 30 days, or "never") for generated invitations.
- Included Invitation Records into the **Device Sync (P2P)** payload, ensuring generated links transition seamlessly when switching devices.
- Added a dedicated "Invitations Data" backup section in **Settings -> Data Management** for exporting and importing active invitation links as JSON.
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

- Refactored `DeleteConfirmationModal` into a generic, lazy-loaded component, replacing all native `window.confirm` prompts across the app for better consistency.
- Separated `invitation` UI and hook logic out of the `management` feature folder to strictly enforce domain-driven boundaries.
- Standardized icon sizes across management UI action buttons for tighter visual consistency.
- Documented native telemetry support for `@vercel/analytics` and `@vercel/speed-insights` across architecture docs.

## Removed
