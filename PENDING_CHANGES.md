# Pending Changes

## Added

- Added a "See It In Action" button to the Dashboard empty state, allowing new users to preview the full DayBook experience using a dynamic DayBook mascot profile.

## Improved

- Redesigned the Dashboard empty state layout to prioritize "Add a Person" and "See It In Action" as the exclusive actions for new users, moving the data management action into the global footer for universal access (now named "Sync Data").

- Enhanced the "See It In Action" preview in the Dashboard to prioritize showing the next upcoming birthday rather than a random existing one.

## Fixed

- Fixed a visual mismatch in the Dashboard's initial loading skeleton where the "See It In Action" button was missing, causing the layout to jump when fully loaded.

- Fixed an issue where the "See It In Action" preview data was not propagating to the FullCalendar tab, resulting in an empty calendar during preview mode.

- Made Upcoming Birthday cards clickable, routing to the person's profile, while ensuring this interaction doesn't conflict with the scroll-drag behavior.

- Fixed an issue where the screen would briefly flash white before loading the dark theme (FOUC).
