# Pending Changes

## Added

## Improved

- Dashboard: Dynamically calculate avatar display limit in `MonthCard` based on available screen width for better responsiveness across devices.
- Person Profile: The page now automatically scrolls to the top when navigating to a person's profile from any section of the app.
- Management Screen: Improved UI copywriting by replacing generic "items" with relationship-centric terminology ("person" / "people").
- Management Screen: Replaced individual action buttons with a cleaner "More Options" dropdown menu (3 dots) on smaller screens to reduce visual noise and improve readability.
- Codebase: Centralized and abstracted the "Me" relationship constraint logic to ensure uniform enforcement across UI dropdowns, file imports, and P2P sync.
- Codebase: Introduced barrel files (`index.ts`) for `constants`, `helpers`, and `hooks` to clean up consumer imports and establish proper public APIs for these layers.
- Testing: Added comprehensive unit tests for the newly abstracted "Me" relationship constraint helpers to ensure edge cases in imports and UI selections are strictly covered.

## Fixed

- Management Screen: Fixed an issue where the mobile "More Options" dropdown menu remained open after clicking an action button by switching to a controlled state.
- Person Profile: Fixed a minor visual jump when navigating between profiles by switching the scroll-to-top logic to a synchronous layout effect.
- Codebase: Refactored the `Footer` component to use a mapped array for cleaner and more maintainable navigation items.
- UI: Fixed mobile overlap issues with the bottom navigation bar by applying dynamic viewport height (`dvh`) and CSS offsets for toast notifications and banners.
- UI: Fixed modal and drawer overflow issues on small devices by enforcing a maximum height constraint (`max-h-[90dvh]`).
- Dashboard: Fixed an issue where floating messages would get clipped on screen edges by tightening positioning logic.
- UI/CSS: Coordinated the mobile and desktop bottom positioning across the Sonner toaster, dashboard banners, and the Bulk Action Bar by using dynamic CSS `:has` selectors, configuring the toaster to display a maximum of one toast at a time, and increasing dynamic clearance offsets to ensure action buttons and persistent notices remain unobscured.
