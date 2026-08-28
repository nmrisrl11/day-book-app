# Pending Changes

## Added

## Improved

- **Build Performance**: Optimized Vite `manualChunks` configuration to explicitly isolate heavy dependencies (FullCalendar, Radix UI, PeerJS) into dedicated chunks. This resolved the "chunks larger than 500 kB" warning, reduced the size of the core React vendor chunk by ~72%, and significantly improves caching behavior and initial load times.

## Fixed

## Changed

## Removed
