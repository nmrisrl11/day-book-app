# Pending Changes

## Added

- Global Search (Command Palette) accessible via `Ctrl+K` or `⌘K` for quick navigation to pages, settings, and people.
- Global Search shortcut button in the main navigation header.
- Complete birthday notification feature set: in-app birthday reminders, notification settings, notification menu actions, and native OS push support via the service worker (delivered while the app is running).
- Mobile Bottom Navigation Bar: Implemented a responsive bottom tab bar for mobile devices to prevent header crowding, seamlessly integrated with the Joyride onboarding system via synchronous media queries.
- Quick Action Toolbar: Added dynamic bottom offsets on mobile to prevent overlapping with the new bottom navigation bar.

## Improved

- Grouped person profile views in analytics to prevent dashboard clutter and improve aggregated tracking
- Replaced hardcoded "DayBook" strings with dynamic branding constants (`APP_INFO`).

## Fixed

- Fixed a bug where the Monthly Calendar view wouldn't sync with the toolbar state when navigating months.
- Fixed an issue where SVG avatars were rendered inconsistently in Global Search compared to other locations.

## Changed

## Removed
