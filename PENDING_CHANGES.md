# Pending Changes

## Added

- Integrated `react-helmet-async` for route-specific SEO, dynamic document titles, and client-side Open Graph tag injection.

## Improved

- Added a pulsing notification indicator to the closed Quick Actions tab to make it more noticeable at first glance

## Fixed

- Resolved an issue where the Quick Actions tab pulse indicator wouldn't restart correctly when transitioning to the closed state.
- Prevented search engines from indexing private invitation links by adding `noindex` directives and configuring strict 404 routing for unknown paths.
- Restored fallback metadata tags in `index.html` and removed duplicate title rendering in the document head.

## Changed

## Removed
