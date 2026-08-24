# Pending Changes

## Added

- Quick Action Toolbar on the dashboard for instant Avatar and Greeting customizations (draggable, edge-dockable, and state-persistent).
- Added a "Support the Project" section on the About page to promote upvoting DayBook on App Builders PH.

## Improved

- Improved TypeScript safety by eliminating `any` types in global PWA event listeners and ICS parsing logic.
- Added sound feedback to programmatic logo animations, specifically enhancing the completion of the onboarding tour.
- Improved accessibility of the Quick Action Toolbar's minimized tab by utilizing semantic button elements.

## Fixed

- Fixed a visual bug in the Quick Action Toolbar where docking to a new corner would trigger the incorrect exit animation direction.

## Changed

- Refactored `RestoreDefaultsButton` into a global reusable component and adapted it for compact icon-only usage in toolbars.

## Removed
