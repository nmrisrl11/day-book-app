# Pending Changes

## Added
- Introduced an `isLoading` state within the `useBirthdayManagement` hook to ensure the skeleton loading UI persists until the IndexedDB fetch resolves, preventing a jarring flash of the "Empty State" UI on initial load.

## Improved
- Optimized the Settings tab ordering by prioritizing the Avatar configuration (moving it to the second position) and restoring Appearance as the default open tab.
- Enhanced the UI layout of the shareable link displays (in both the Ask Birthday and Invitation Response screens) by explicitly enabling flex item shrinking (`min-w-0`), ensuring long encrypted URLs truncate cleanly via `text-ellipsis` and no longer break the modal layout bounds on narrow viewports.

## Fixed
- Fixed the "flash of empty state" when navigating to the Birthday Management screen by properly tracking Dexie query resolution.

## Changed
- Removed the manual audio-context unlock listener from `App.tsx` as recent interactions handle it natively.

## Removed
- Removed the unused `ScrollToTop` component and associated `useLocation` import from `App.tsx` which was causing a bug with the avatar color randomization.
