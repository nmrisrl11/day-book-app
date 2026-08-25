# Pending Changes

## Added

- Added the ability to bulk delete multiple birthdays on the Manage Birthdays screen.
- Added the ability to bulk delete multiple invitation links on the Invitation Links screen.

## Improved

- Standardized copy button styling across all components to consistently use a text-based green success state instead of solid background fills.
- Made the floating action bar in Manage Birthdays and Invitation Links screens responsive on mobile devices, including converting text buttons to icon-only variants for better space management.
- Re-styled the "Delete Selected" bulk action button to use a ghost variant by default (turning red only on hover) to prevent it from aggressively drawing attention as the primary action.
- Improved date validation by requiring birthday years to be 1900 or later to prevent accidental entry of invalid historical dates.

## Fixed

- Fixed pluralization wording in bulk action toast notifications and confirmation modals (e.g., properly displaying "1 birthday" instead of "1 birthdays").

## Changed

## Removed
