# Pending Changes

## Added

- Peer-to-Peer Device Sync (WebRTC): Users can now securely sync their entire DayBook database directly between devices over the local network using a 6-digit connection code, eliminating the need for JSON file transfers or a backend server.
- Quick Action Toolbar on the dashboard for instant Avatar and Greeting customizations (draggable, edge-dockable, and state-persistent).
- Added a "Support the Project" section on the About page to promote upvoting DayBook on App Builders PH.
- New responsive custom SVG icon variants (Invite, Share, Response, Warning) designed specifically for the invitation feature, fully animated.

## Improved

- Improved TypeScript safety by eliminating `any` types in global PWA event listeners and ICS parsing logic.
- Completely redesigned the Data Management section in Settings into a structured Card layout for better visual hierarchy and compactness, highlighting Device Sync as the recommended transfer method.
- Added sound feedback to programmatic logo animations, specifically enhancing the completion of the onboarding tour.
- Improved accessibility of the Quick Action Toolbar's minimized tab by utilizing semantic button elements.
- Redesigned the `/invite` and `/response` states to dynamically feature the new animated SVG icons instead of static text emojis, improving branding and engagement.
- Automated jelly and sparkle animation triggers for important interaction milestones (opening invite links, receiving a birthday, generating a share link).
- Improved overall app accessibility by adding comprehensive ARIA labels, semantic `alt` attributes, and `title` tags to interactive elements and links across all screens.
- Standardized `public/llms.txt` format to comply with `llmstxt.org` specifications and Lighthouse agentic browsing guidelines, adding structural Markdown links and summaries.

## Fixed

- Fixed a timezone bug that prevented users from selecting the current day as a birthday, and ensured that imported data strictly blocks future dates.
- Fixed a visual bug in the Quick Action Toolbar where docking to a new corner would trigger the incorrect exit animation direction.
- Fixed a mobile browser bug where long-pressing the interactive brand logos would unintentionally trigger the native image context menu or highlight surrounding text.

## Changed

- Refactored `RestoreDefaultsButton` into a global reusable component and adapted it for compact icon-only usage in toolbars.
- Extracted and centralized all logo interaction logic (sounds, particle effects, animations) from `InteractiveLogo` into a highly flexible `AnimatedLogo` component supporting multiple variants in `src/components/icons/`.

## Removed

- Deprecated and deleted `interactive-logo.tsx` in favor of the new unified `AnimatedLogo`.
