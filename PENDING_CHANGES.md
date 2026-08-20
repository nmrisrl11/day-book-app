# Pending Changes

## Added

- **Offline Status Notifications** — The app will now instantly notify you with a beautiful toast when you lose connection, and celebrate when you are back online.
- **iOS PWA Install Instructions** — iPhone and iPad users will now receive a helpful, tailored prompt instructing them exactly how to install DayBook to their home screen using the Share menu.
- **"Me" Relationship** — Added "Me" to the relationship options so users can easily track their own birthdays.
- **Days Until Indicator** — Upcoming birthdays now display precisely how many days are left (e.g., "Today", "Tomorrow", "In 4 days") alongside the age.

## Improved

- **JSON Imports** — You can now preview, review duplicates, and hand-select which birthdays to import from a JSON file, matching the calendar import experience. Large imports are now significantly faster.
- **Massive Performance Boosts** — The Manage Birthdays page and Import previews now use advanced virtualization. This means even if you have thousands of records, the app stays buttery smooth and lag-free.
- **Playful Feedback** — We've upgraded all notifications (like successful imports) to use delightful, gooey animations that feel native and premium.
- **Mobile Calendar Export UX** — On mobile devices (iOS and Android), exporting to `.ics` now utilizes the native Web Share API to directly open the OS Share Sheet instead of silently downloading a file.
- **PWA Offline Fonts** — Google fonts and external font assets are now strictly precached via Workbox, ensuring the app remains perfectly styled even when completely offline.
- **Default Avatars** — `boring-avatars` (beam variant) is now the default avatar library for a cleaner, modern look out of the box.
