# Pending Changes

## Added

- **Generated Links Management**: Added a new tab in the Manage screen to view, copy, share, and delete previously generated birthday invitation links.
- Implemented variable link expiration support (24 hours, 7 days, or "never") for generated invitations.
- Included Invitation Records into the **Device Sync (P2P)** payload, ensuring generated links transition seamlessly when switching devices.
- Added a dedicated "Invitations Data" backup section in **Settings -> Data Management** for exporting and importing active invitation links as JSON.
- Added an "Import Response" feature to the "Ask for a Birthday" modal, allowing iOS and PWA users to manually paste response links to guarantee data is saved in their installed app's storage rather than an isolated browser tab.

## Improved

- Updated Dashboard empty state CTA buttons to more accurate "Add a Person" and "Import or Sync" copywriting, and correctly routed the import button to the Data Management settings tab.
- Unified the Upcoming Birthdays badges to display a single, natural sentence (e.g. "Turning 28 in 5 days") that calculates future age dynamically.
- Polished the Data Management Settings layout by removing redundant shadows for a cleaner, flatter card aesthetic.
- Completely redesigned the Data Management tab layout to consolidate all import/export features (Birthdays, Calendar, Invitations, Settings) into a single, compact "Manual Backup & Restore" card, replacing the bulky standalone cards and full-width buttons.
- Refactored `BirthdaysDataManagement`, `InvitationsDataManagement`, and `SettingsDataManagement` to render as unified list rows instead of bulky grid cards.
- Refactored `DeleteConfirmationModal` into a highly generic `ActionConfirmationModal`, removing redundant modals (like `reset-settings-modal.tsx`) and centralizing all confirmation dialogs.
- Enhanced the PWA `/install` screen with a dedicated "Browser Installation" fallback state for desktop users to guide them toward manual browser-menu installation.
- Improved the PWA display-mode detection to accurately track installation status across `standalone`, `window-controls-overlay`, and `fullscreen` transitions without state conflicts.
- Updated the interactive Onboarding Tour to include a dedicated step for the new "Invitations" feature.
- Decluttered the top navigation menu by moving the "About" and "Install App" links exclusively to the global footer.
- Enhanced footer navigation links with native scroll restoration to ensure users always land at the top of the content when switching views.
- Replaced `text-balance` with native wrapping on Data Management descriptions to ensure clean list rows.
- The "Reset All Settings" button in the Danger Zone is now styled with a red destructive color to match the "Delete Data" action.
- Separated the "Delete All Data" action in the Danger Zone into distinct "Delete All Birthdays" and "Delete All Invitations" buttons for more granular control.
- Expanded touch target sizes across primary navigation buttons, footer links, and the mobile drawer close button to improve mobile accessibility and prevent mis-taps.

## Fixed

- Fixed the Today's Celebrant modal wording to gracefully say "Now 28 years old" instead of "Turning 28".
- Fixed a layout bug in the "Ask for a Birthday" modal where long response links would stretch the UI out of bounds.
- Fixed a race condition on the `/install` page where the "Install App Now" button would fail to appear (showing "Installation Unavailable" instead) due to timing conflicts between React's render lifecycle and Chrome's `beforeinstallprompt` event.
- Fixed an accessibility issue where the "Ask for Birthday" and "Add Birthday" management buttons lacked proper ARIA labels for screen readers when their text labels collapsed on small screens.
- Fixed an edge case where missing expiration timestamps in legacy invitation tokens could cause type safety issues, safely defaulting them to an infinite expiration limit.

## Changed

- Refactored `DeleteConfirmationModal` into a generic, lazy-loaded component, replacing all native `window.confirm` prompts across the app for better consistency.
- Separated `invitation` UI and hook logic out of the `management` feature folder to strictly enforce domain-driven boundaries.
- Standardized icon sizes across management UI action buttons for tighter visual consistency.
- Documented native telemetry support for `@vercel/analytics` and `@vercel/speed-insights` across architecture docs.

## Removed
