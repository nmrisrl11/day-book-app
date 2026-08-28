# Pending Changes

## Added

- **Birthday Calendar View**: Added a fully interactive, month-based calendar view on the dashboard powered by FullCalendar, allowing users to see celebrants directly on their respective dates.
- **Settings Import Preview**: Review and compare incoming settings against current configurations in a categorized, visual diff layout before applying them.
- **Empty States**: Added helpful empty states to the Quick Action Toolbar and global Settings when there are no birthdays available to customize greetings for.
- **Granular Age Display**: Enhanced the age display to support fractional ages for babies ("months old", "days old", and "Newborn").
- **Import Preview Enhancements**: The Import Preview dialog for JSON and Calendar (.ics) files now displays the person's current age alongside their birthday.

## Improved

- **Calendar Components Structure**: Refactored the birthday section to use lazy-loaded Suspense boundaries and dynamic imports for the heavy Calendar view and Modals to ensure optimal dashboard loading performance.
- **Settings Management**: Improved UX and memory management when importing settings, ensuring graceful cancellation without memory leaks.
- **Data Management UX**: Replaced inline import error messages with elegant toast notifications, resolving layout shifting issues and preventing screen clutter.
- **Tailwind CSS Consistency**: Removed arbitrary Tailwind CSS values in favor of canonical classes across recent UI components.
- **Device Sync (P2P)**: Disabled autocomplete and autofill on the receive-code input to prevent keyboard suggestions from interfering with code entry.

## Fixed

- **Dashboard Loading State**: Fixed an issue where the dashboard would incorrectly display an empty state fallback instead of a skeleton loading state after receiving data via Device Sync (P2P).
- **Device Sync (P2P)**: Fixed an issue where the data existence hint was not correctly refreshed immediately after importing data, ensuring the app recognizes new data on subsequent renders.

## Changed
