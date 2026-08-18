# DayBook

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo/daybook-logo-dark.svg">
    <img src="public/logo/daybook-logo-light.svg" alt="DayBook Logo" width="120" />
  </picture>
</div>

DayBook is a stylish, lightweight, local-first birthday tracker designed to help you keep track of family and friends' birthdays so you never forget one again. 🎉🎂

## Features

- 🔒 **Privacy First**: All your birthday and settings data stays on your device (`localStorage`). Visitor analytics (unique visitor counting) use the `/api/visitors` flow with IP-based counting backed by Upstash Redis.
- 📱 **Installable PWA**: Install DayBook on your phone or desktop! Works offline, loads instantly, and detects updates in the background, applying them safely only after you confirm.
- ✨ **Beautiful Dashboard**: Celebratory "Happy Birthday" section with confetti, upcoming birthdays list, and an interactive 12-month calendar grid.
- 🎨 **Rich Customization**:
  - 🌓 Theme toggling (Light/Dark).
  - 🅰️ Main greeting typography and gradient styling.
  - 💬 Floating messages and personalized greeting pools.
  - 🖼️ Two integrated avatar systems (`avvvatars` and `boring-avatars`) plus custom photo uploads.
- 🎵 **Sound Feedback**: Satisfying, configurable audio feedback for interactions using the `cuelume` library.
- 📅 **Calendar Integration**: Export your birthdays to `.ics` files or add them directly to Google Calendar.
- 💾 **Data Portability**: Full JSON export and import for both your birthday data and your application settings.
- 📊 **Visitor Analytics**: Edge-hosted unique visitor tracking using Upstash Redis.

## Technology Stack

- ⚡ **Framework**: React 19 + Vite 6
- 📱 **PWA**: vite-plugin-pwa + Workbox
- 📘 **Language**: TypeScript
- 🎨 **Styling**: Tailwind CSS 4
- 🐻 **State Management**: Zustand 5
- 🛣️ **Routing**: React Router v7
- 🧱 **UI Components**: Radix UI (via shadcn/ui)
- ✨ **Animation**: Framer Motion, `@animate-ui`
- ✅ **Validation**: Zod + React Hook Form
- 🔗 **URL State**: `nuqs`

## AI Agent Documentation

If you are an AI agent or a developer looking to contribute to this project, please consult the project documentation in the following order:

1. **`AGENTS.md`**: Permanent AI operating instructions and deep architectural context.
2. **`CURRENT_STATE.md`**: Living snapshot of what is actually implemented _right now_, known tech debt, and current focus.
3. **`docs/rules.md`**: Strict coding conventions, naming rules, and boundaries.
4. **`docs/instructions.md`**: The original foundational product specification.
5. **`docs/brand-guidelines.md`**: Design, typography, and personality rules.

## Local Development

### Prerequisites

- Node.js (v18+)
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/nmrisrl11/day-book-app.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

For the visitor tracking API to function locally, you will need a Vercel Upstash Redis database and the following variables in a `.env.local` file:

```env
KV_REST_API_URL="your-upstash-url"
KV_REST_API_TOKEN="your-upstash-token"
```

## Available Scripts

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the app for production.
- `npm run lint` - Lints the codebase using Oxlint.
- `npm run preview` - Previews the production build locally.
