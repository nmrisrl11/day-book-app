# Pending Changes

## Added

- Introduced a new "Gift Ideas / Wish List" feature for each person, allowing you to save up to 10 favorite things or gift ideas. This integrates directly with device sync, exports, and the invitation flow.

## Improved

- Redesigned the "Celebrant Modal" and "Birthday Form" interfaces for a more structured, readable presentation of notes and gift ideas, employing dynamic multi-line wrapping badges and scalable layout optimizations for smaller devices.
- Improved the "Import from JSON/ICS" preview screen layout, now dynamically calculating and displaying the count of parsed gift ideas next to notes for a thorough data review.

## Fixed

- Fixed a bug during ICS export and import where gift ideas weren't being reliably serialized. We now utilize a custom `X-DAYBOOK-GIFTIDEA` iCalendar property, plus fallback regex matching on older descriptions, to guarantee your gift ideas always import perfectly.
- Fixed an issue in the Invitation Response flow where omitting gift ideas in a response link caused strict validation failures, preventing the user from processing valid response links.

## Changed

## Removed
