# Pending Changes

## Added

- Introduced a new "Gift Ideas / Wish List" feature for each person, allowing you to save up to 10 favorite things or gift ideas. This integrates directly with device sync, exports, and the invitation flow.

## Improved

- Redesigned the "Celebrant Modal" and "Birthday Form" interfaces for a more structured, readable presentation of notes and gift ideas, employing dynamic multi-line wrapping badges and scalable layout optimizations for smaller devices.
- Improved the "Import from JSON/ICS" preview screen layout, now dynamically calculating and displaying the count of parsed gift ideas next to notes for a thorough data review.
- Hardened ICS importing to strictly truncate abnormally long notes or gift ideas, protecting the database from malformed or excessive imports.
- Redesigned the Invitation and Response flow screens ("Help remember your birthday", "Your birthday is ready to share!", and "Birthday received!") with a clean, unified elevated card layout to better match the application's premium aesthetic.
- Added a new celebratory confetti animation variant to the Animated Logo, automatically triggered when successfully generating or receiving a birthday link.

## Fixed

- Fixed a bug during ICS export and import where gift ideas weren't being reliably serialized. We now utilize a custom `X-DAYBOOK-GIFTIDEA` iCalendar property, plus fallback regex matching on older descriptions, to guarantee your gift ideas always import perfectly.
- Fixed an issue in the Invitation Response flow where omitting gift ideas in a response link caused strict validation failures, preventing the user from processing valid response links.
- Fixed a UI bug in the person editor where removing a note or gift idea with identical text to another would incorrectly remove all matching items instead of just the selected one.
- Fixed a subtle styling issue where the "Copy Link" button in the shareable link box would jump out of alignment while being clicked.

## Changed

## Removed
