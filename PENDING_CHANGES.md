# Pending Changes

## Added

- Introduced the **Person Detail View**: a dedicated profile screen for each person to view their upcoming birthday, current age, relationship, and any saved notes or gift ideas. Click a person from the management list or the celebrant modal to view their profile.
- Integrated `react-helmet-async` for route-specific SEO, dynamic document titles, and client-side Open Graph tag injection.
- Added an audio feedback confirmation upon successful P2P device synchronization.

## Improved

- Refactored large form components (`birthday-form-modal.tsx` and `import-preview-dialog.tsx`) to improve readability and maintainability without sacrificing performance.
- Added a pulsing notification indicator to the closed Quick Actions tab to make it more noticeable at first glance
- Lazy loaded modals in the Person Detail View for better performance

## Fixed

- Resolved an issue where the Quick Actions tab pulse indicator wouldn't restart correctly when transitioning to the closed state.
- Prevented search engines from indexing private invitation links and person profiles by adding `noindex` directives and configuring strict 404 routing for unknown paths.
- Added SPA rewrite rules in `vercel.json` for the Person Detail View to prevent 404s on direct navigation.
- Restored fallback metadata tags in `index.html` and removed duplicate title rendering in the document head.

## Changed

## Removed
