# Pending Changes

## Added

## Improved

- Dashboard: Dynamically calculate avatar display limit in `MonthCard` based on available screen width for better responsiveness across devices.
- Person Profile: The page now automatically scrolls to the top when navigating to a person's profile from any section of the app.
- Management Screen: Improved UI copywriting by replacing generic "items" with relationship-centric terminology ("person" / "people").
- Management Screen: Replaced individual action buttons with a cleaner "More Options" dropdown menu (3 dots) on smaller screens to reduce visual noise and improve readability.

## Fixed

- Management Screen: Fixed an issue where the mobile "More Options" dropdown menu remained open after clicking an action button by switching to a controlled state.
- Person Profile: Fixed a minor visual jump when navigating between profiles by switching the scroll-to-top logic to a synchronous layout effect.
- Codebase: Refactored the `Footer` component to use a mapped array for cleaner and more maintainable navigation items.
