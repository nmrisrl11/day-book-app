# Development Rules

Follow these rules for all code changes and new implementations.

## Framework

- Use **React with Vite** for the application.
- Use **TypeScript** for all application source files.
- Do not introduce **Next.js** or another application framework.
- Follow the existing Vite project structure and configuration.
- Do not migrate the project to another framework unless explicitly instructed.

## TypeScript

- Use **TypeScript** for all source files.
- Do not use the `any` type.
- Prefer explicit types when they improve readability or type safety.
- Use existing project types when available instead of redefining them.
- Avoid unnecessary type assertions (`as`) unless they are required and safe.

## Variables

- Use `const` for variables that are not reassigned.
- Use `let` only for variables that need to be reassigned.
- Do not use `var`.

## React

- Use **functional components**.
- Use React hooks only when state, effects, refs, or other React functionality is required.
- Avoid unnecessary state and effects.
- Keep components focused and reusable.
- Avoid putting unrelated logic inside components.

## Naming Conventions

### Files and Folders

- Use **kebab-case** for all file and folder names.
- Use lowercase letters and hyphens to separate words.
- Do not use PascalCase, camelCase, or spaces in file and folder names.
- Follow existing framework or library conventions when they require a different naming format.

Examples:

- `birthday-card.tsx`
- `birthday-card-modal.tsx`
- `celebrant-card.tsx`
- `celebrant-modal.tsx`
- `upcoming-birthdays.tsx`
- `monthly-birthday-modal.tsx`
- `birthday-calendar.tsx`

Avoid:

- `BirthdayCard.tsx`
- `BirthdayCardModal.tsx`
- `birthdayCard.tsx`
- `Birthday_Card.tsx`

### React Components

- Use **PascalCase** for React component names.
- The component name should match the purpose of the file.

For example:

- File: `birthday-card.tsx`
- Component: `BirthdayCard`

- File: `birthday-card-modal.tsx`
- Component: `BirthdayCardModal`

- File: `celebrant-card.tsx`
- Component: `CelebrantCard`

### Icons (Lucide)

- When importing icons from `lucide-react`, ALWAYS append the `Icon` suffix to the name if it isn't already there.
- Example: `import { Settings as SettingsIcon, BookUser as BookUserIcon } from "lucide-react";`

### Hooks

- Hook files must use **kebab-case**.
- Hook names must use `use` followed by **PascalCase**.
- Hooks must follow React's hook naming conventions.

Examples:

- File: `use-birthday-data.ts`
- Hook: `useBirthdayData`

- File: `use-confetti.ts`
- Hook: `useConfetti`

### Helper Functions

- Helper files must use **kebab-case**.
- Helper functions should use **camelCase**.
- Keep helper functions focused on a single responsibility.

Examples:

- File: `birthday-utils.ts`
- Function: `getUpcomingBirthdays`

- File: `format-birthday.ts`
- Function: `formatBirthday`

### Types

- Type files must use **kebab-case**.
- Type names must use **PascalCase**.

Examples:

- File: `birthday.ts`
- Type: `Birthday`

- File: `celebrant.ts`
- Type: `Celebrant`

- File: `birthday-types.ts`
- Type: `BirthdayData`

### Constants

- Constant files must use **kebab-case**.
- Constant variables should use **UPPER_SNAKE_CASE** when they represent true application constants.
- Static data collections should have descriptive names.

Examples:

- File: `birthdays.ts`
- Constant: `BIRTHDAYS`

- File: `app-config.ts`
- Constant: `APP_CONFIG`

- File: `site-config.ts`
- Constant: `SITE_CONFIG`

### Variables and Functions

- Use **camelCase** for variables and functions.
- Use descriptive names that clearly communicate their purpose.
- Avoid unnecessary abbreviations.

Examples:

- `upcomingBirthdays`
- `selectedCelebrant`
- `getUpcomingBirthdays`
- `formatBirthday`

### General Naming Rule

Use the following naming conventions consistently:

| Item             | Convention                  | Example                |
| ---------------- | --------------------------- | ---------------------- |
| Files            | kebab-case                  | `birthday-card.tsx`    |
| Folders          | kebab-case                  | `birthday-components/` |
| React Components | PascalCase                  | `BirthdayCard`         |
| Hooks            | camelCase with `use` prefix | `useBirthdayData`      |
| Variables        | camelCase                   | `upcomingBirthdays`    |
| Functions        | camelCase                   | `getUpcomingBirthdays` |
| Types            | PascalCase                  | `Birthday`             |
| Interfaces       | PascalCase                  | `BirthdayProps`        |
| Constants        | UPPER_SNAKE_CASE            | `BIRTHDAYS`            |

---

## Styling

- Use **TailwindCSS** for styling.
- **Strict Canonical Classes**: NEVER use arbitrary pixel or rem values (e.g., `w-[120px]`, `max-h-[300px]`, `-m-[6px]`) when an exact canonical Tailwind scale class exists (e.g., `w-30`, `max-h-75`, `-m-1.5`). You MUST use the canonical class to prevent `tailwindcss(suggestCanonicalClasses)` lint warnings and ensure theme consistency.
  - _Exception_: Third-party UI library components (e.g., `shadcn/ui` in `src/components/ui/`) are exempt. Do not modify these files to fix canonical classes unless explicitly instructed.
- Use **shadcn/ui** components whenever an appropriate component is available.
- Do not use inline styles.
- Do not introduce external UI/component libraries.
- Follow the project's existing design system and component patterns.
- Refer to `docs/brand-guidelines.md` for visual and branding requirements.

## HTML & Accessibility

- Use semantic HTML elements whenever possible.
- Use accessible labels and appropriate ARIA attributes when needed.
- Ensure interactive elements are keyboard accessible.
- Do not use non-interactive elements as buttons or links.
- Do not rely solely on color to communicate important information.
- Ensure dialogs, modals, buttons, links, and other interactive components have appropriate accessible names.
- Respect `prefers-reduced-motion` for animations and decorative motion.

## Code Organization

### Directory Boundaries

- `src/features/`: Domain-driven modules. Each folder here represents a distinct feature area (e.g., `dashboard`, `management`, `settings`). Features should encapsulate their own specific components, hooks, and logic. For complex features, group components into logical subfolders (e.g., `tabs` or `sections`) within the feature's `components/` directory.
- `src/components/`: Global, reusable UI components only. Do not place feature-specific components here.
- `src/components/ui/`: STRICTLY for un-opinionated external UI primitives (e.g., shadcn/ui components, `@animate-ui` wrappers). Do not place custom business logic components here.
- `src/schema/`: Zod schemas for forms, validation, and API boundaries.
- `src/constants/`: Static application configuration, settings boundaries, and default values. Do not put user data here.

### Architecture First

- Before adding a new component or utility, always check if one already exists in `src/components/` or `src/helpers/`.
- Do not add new dependencies without checking if existing tools (e.g., `nuqs`, `zustand`, `lucide-react`, `cuelume`) can handle the requirement.

### General Guidelines

- Keep the code clean, readable, and organized.
- Follow the existing project structure and naming conventions.
- Avoid unnecessary duplication.
- Prefer reusable components and utilities over repeated code.
- Keep components focused on presentation and interaction.
- Keep reusable business logic outside of UI components when appropriate.

## Data Management

- User-managed birthday data must not be stored as static constants.
- Keep user birthday records separate from static application configuration.
- Maintain a single source of truth for user birthday records.
- Do not duplicate birthday records across components or sections.
- Keep data persistence logic separate from presentation components.
- Keep data validation separate from presentation components when practical.
- Keep data transformation and birthday calculations in reusable helpers.
- Reuse shared TypeScript types for birthday records and related data structures.
- All birthday-related views must derive their information from the same birthday data source.
- Do not hardcode user-created birthday records inside UI components.

### Constants

- When creating a static list of items or configuration data, define it in the `constants/` folder and import it where needed.
- Do not duplicate the same static data across multiple components.
- Keep static application data separate from UI components.
- Use constants for static application data such as:
  - Birthday greetings
  - Month definitions
  - Default settings
  - Application configuration
- Do not store user-managed birthday records in the `constants/` folder.
- User-created birthday records must use the application's data persistence layer.

### Persistence

- Keep local data persistence logic separate from UI components.
- User-managed birthday records must persist between application sessions.
- Validate data before saving it.
- Validate imported JSON before modifying existing data.
- Do not silently overwrite valid user data with invalid imported data.
- Keep the persisted data format consistent with the documented data model.
- Prefer simple, reliable persistence approaches that fit the existing application architecture.
- Do not introduce a backend or remote database unless explicitly instructed.

### Import & Export

- Import and export functionality must use the documented birthday data model.
- Exported birthday data should be portable and understandable.
- Imported data must be validated before it is persisted.
- Handle malformed or incompatible JSON safely.
- Do not silently discard invalid records.
- Do not silently overwrite existing data when an import contains conflicts.
- Keep import/export logic separate from UI components.

### Application Settings

- User-adjustable settings must be persisted locally when required by `docs/instructions.md`.
- Keep application settings separate from birthday records.
- Use shared types for settings.
- Provide sensible defaults for settings.
- Do not hardcode user preferences into individual components.

### Helpers

- Place reusable helper/utility functions in the `helpers/` folder.
- Keep helper functions focused on a single responsibility.
- Do not place reusable business logic directly inside UI components when it can be extracted cleanly.

### Types

- Place shared type definitions in the `types/` folder.
- Reuse existing types instead of creating duplicate definitions.
- Component-specific types may remain near the component when they are not shared.
- Do not use `any`.

## Formatting

- Follow the project's existing formatter and linting configuration when available.
- If no formatter configuration exists, use **tabs instead of spaces** for indentation.
- Keep formatting consistent across the project.
- Do not manually introduce formatting that conflicts with the project's formatter configuration.

## Dependencies

- Do not add new dependencies unless they are necessary.
- Do not use external UI libraries.
- Prefer existing project dependencies and utilities.
- Before adding a dependency, check whether the functionality can be implemented using the existing stack.
- Do not add a dependency for functionality that can reasonably be implemented using existing project tools or utilities.

## Project Instructions

- Follow all requirements defined in `docs/instructions.md`.
- Follow all applicable requirements in `docs/brand-guidelines.md`.
- Follow all rules defined in this file.
- When instructions conflict, prioritize the most specific requirement for the current task.
- Do not ignore requirements from `docs/instructions.md` or `docs/brand-guidelines.md` unless they directly conflict with a higher-priority system or project requirement.

## Before Completing a Task

- Check for TypeScript errors.
- Check for linting or formatting issues when applicable.
- Make sure imports are organized and unused imports are removed.
- Verify that the implementation follows the project structure.
- Verify that file and component naming conventions are followed.
- Ensure the implementation is responsive when modifying UI.
- Verify keyboard and touch interactions for interactive components.
- Check that dialogs and modals are accessible.
- Do not leave temporary code, debug statements, console logs, or unused components behind.
- Do not leave unused dependencies or imports.
- Verify that the application still builds successfully when possible.
