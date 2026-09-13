# Pending Changes

## Added

- Added special handling for the "Me" relationship type, ensuring only a single "Me" profile can exist, and gracefully falling back duplicates to "Other" during data imports and P2P sync.

- The "Me" profile avatar now appears in the main navigation header (top-right) for quick access.

- Added an intelligent in-app update notification system that detects new app versions and alerts users via the Notification Menu, complete with native OS notifications.

- Clicking on an update notification now seamlessly routes users directly to the "What's New" section on the About page.

- Added a "See It In Action" button to the Dashboard empty state, allowing new users to preview the full DayBook experience using a dynamic DayBook mascot profile.

## Improved

- Redesigned the Dashboard empty state layout to prioritize "Add a Person" and "See It In Action" as the exclusive actions for new users, moving the data management action into the global footer for universal access (now named "Sync Data").

- Enhanced the "See It In Action" preview in the Dashboard to prioritize showing the next upcoming birthday rather than a random existing one.

## Fixed

- Prevented device-specific settings (such as the last seen app version and onboarding status) from inadvertently syncing across devices during P2P sync or JSON exports, ensuring local settings remain local.

- Fixed an issue where OS notifications for updates and birthday reminders would fail to trigger in development environments due to missing service worker registrations.

- Fixed a visual mismatch in the Dashboard's initial loading skeleton where the "See It In Action" button was missing, causing the layout to jump when fully loaded.

- Fixed an issue where the "See It In Action" preview data was not propagating to the FullCalendar tab, resulting in an empty calendar during preview mode.

- Made Upcoming Birthday cards clickable, routing to the person's profile, while ensuring this interaction doesn't conflict with the scroll-drag behavior.

- Fixed an issue where the screen would briefly flash white before loading the dark theme (FOUC).
