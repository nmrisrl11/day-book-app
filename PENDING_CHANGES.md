# Pending Changes

## Added

- **Open Source Section** — Added a dedicated Open Source section to the About page and moved the GitHub link from the footer to the main navigation for better discoverability.
- **Offline Status Notifications** — The app will now instantly notify you with a beautiful toast when you lose connection, and celebrate when you are back online.
- **iOS PWA Install Instructions** — iPhone and iPad users will now receive a helpful, tailored prompt instructing them exactly how to install DayBook to their home screen using the Share menu.
- **"Me" Relationship** — Added "Me" to the relationship options so users can easily track their own birthdays.
- **Days Until Indicator** — Upcoming birthdays now display precisely how many days are left (e.g., "Today", "Tomorrow", "In 4 days") alongside the age.

## Improved

- **Smooth Navigation** — Clicking "About" from the footer now automatically scrolls you perfectly to the top of the page.
- **In-Page Anchor Links** — Clicking sections in the "On this page" menu now uses a beautiful smooth-scroll animation instead of instantly jumping.
- **Updated Logo** — Swapped out the old logo for a crisper, shadow-free updated design that integrates seamlessly with the About page.

- **JSON Imports** — You can now preview, review duplicates, and hand-select which birthdays to import from a JSON file, matching the calendar import experience. Large imports are now significantly faster.
- **Massive Performance Boosts** — The Manage Birthdays page and Import previews now use advanced virtualization. This means even if you have thousands of records, the app stays buttery smooth and lag-free.
- **Playful Feedback** — We've upgraded all notifications (like successful imports) to use delightful, gooey animations that feel native and premium.
- **Mobile Calendar Export UX** — On mobile devices (iOS and Android), exporting to `.ics` now utilizes the native Web Share API to directly open the OS Share Sheet instead of silently downloading a file.
- **PWA Offline Fonts** — Google fonts and external font assets are now strictly precached via Workbox, ensuring the app remains perfectly styled even when completely offline.
- **Default Avatars** — `boring-avatars` (beam variant) is now the default avatar library for a cleaner, modern look out of the box.
- **Lighthouse Audit Optimizations** — Achieved massive bundle size reductions (and lowered main-thread execution time) by dynamically chunking heavy libraries like avatars. Improved semantic heading accessibility and SVG screen-reader compliance across the dashboard.
- **About Page Skeleton** — Added a layout-accurate, dedicated skeleton loader for the `/about` screen to ensure a perfectly seamless visual transition while the page lazy-loads.
