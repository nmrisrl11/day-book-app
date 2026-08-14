# System Instructions

## 1. Project Overview

Build **DayBook**, a local-first birthday tracker that helps users keep track of family and friends' birthdays so they never forget one again.

The application should allow users to:

- View the current birthday celebrant(s).
- View upcoming birthdays.
- View all birthdays organized by month.
- Add birthday records.
- Edit birthday records.
- Delete birthday records.
- Persist birthday data locally.
- Export birthday data as JSON.
- Import birthday data from JSON.
- Adjust application preferences through Settings.
- Use the application in both light and dark themes.

The application should provide a clear, celebratory, personal, and responsive experience across desktop, tablet, and mobile devices.

DayBook is currently a **local-first application**. It does not require a backend, user account, authentication system, or cloud database for this phase.

Refer to the sections below for the required page structure, features, interactions, data behavior, and implementation expectations.

---

# 2. Visual Prototype

The visual prototype is located at:

`docs/day-book-prototype.png`

Use this prototype as a **visual and layout reference** when implementing the application.

The prototype communicates the intended:

- Overall page composition
- Section hierarchy
- Content positioning
- Spacing and proportions
- Happy Birthday section layout
- Upcoming birthday card layout
- Monthly birthday grid layout
- Avatar presentation
- Footer placement
- Overall visual balance and information density

## Prototype Guidelines

The prototype is a **visual reference, not a pixel-perfect specification**.

Use it as the starting point for the visual direction, but improve and adapt the design based on the functional, responsive, accessibility, and interaction requirements defined in this document.

Do not reproduce limitations from the prototype.

The final implementation must support the full requirements described in this document, including:

- User-managed birthday data
- Add, edit, and delete functionality
- Persistent local data
- Import and export functionality
- Multiple birthday celebrants
- Interactive celebrants
- Celebrant information dialogs
- Monthly birthday dialogs
- Birthday management UI
- Settings
- Responsive layouts
- Mobile interactions
- Light and dark themes
- Accessibility
- Dynamic birthday data

When the prototype conflicts with the written requirements in `docs/instructions.md`, **follow the written requirements**.

When making visual decisions that are not explicitly defined in the requirements, use the prototype as the primary visual reference and `docs/brand-guidelines.md` as the brand/design authority.

Do not replace the prototype's visual direction with a generic dashboard, admin interface, or unrelated design aesthetic.

---

# 3. Application Model

DayBook is a **local-first birthday management application**.

Birthday records are no longer static application constants.

Users should manage their birthday data directly through the application UI.

The same birthday data source should power all birthday-related views, including:

- Happy Birthday Section
- Upcoming Birthdays Section
- Birthdays by Month
- Celebrant Modal
- Birthday Management Screen

The application should maintain a **single source of truth** for user birthday records.

Do not maintain separate birthday datasets for individual sections.

Derived views should be generated from the same underlying birthday records.

---

# 4. Data Persistence

Birthday data must persist locally on the user's device.

The data should remain available after:

- Refreshing the application.
- Closing and reopening the browser.
- Restarting the application.

The application should not require an internet connection to access previously saved birthday records.

The exact persistence mechanism is an implementation decision and should follow the project's technical requirements and existing dependencies.

## Data Behavior

When birthday data changes:

- Adding a birthday should immediately update relevant birthday views.
- Editing a birthday should immediately update relevant birthday views.
- Deleting a birthday should immediately update relevant birthday views.
- Changes should persist across application sessions.

The application should not require a manual page refresh after changing birthday data.

---

# 5. Birthday Data Management

Users must be able to manage their birthday records directly through the application.

The application should support:

- Create
- Read
- Update
- Delete

birthday records.

## Birthday Record

Each birthday record should contain:

- Unique identifier
- Celebrant's name
- Celebrant's birthday

An avatar should be generated automatically using the project's configured avatar system.

Users should not be required to provide an avatar to create a birthday record.

---

# 6. New User Experience

When there are no saved birthday records, the application should present a clear **empty state**.

The empty state should:

- Explain that no birthdays have been added yet.
- Provide an obvious action to add a birthday.
- Maintain the DayBook visual identity.
- Work well on desktop and mobile.
- Avoid looking like an error or broken application.

The primary action should guide the user toward creating their first birthday record.

---

# 7. Add Birthday

Users must be able to create a new birthday record.

The add birthday experience should collect the required information:

- Name
- Birthday

## Name

The name field should:

- Be required.
- Clearly communicate that a name is expected.
- Validate empty or invalid input.
- Provide useful feedback when validation fails.

## Birthday

The birthday field should:

- Be required.
- Use an appropriate date picker.
- Provide a clear and intuitive date selection experience.
- Validate the selected date.
- Follow the application's defined birthday data format.
- Work well on desktop and mobile.

## Form Behavior

The form should provide:

- Clear labels
- Validation feedback
- Save action
- Cancel action where appropriate
- Accessible keyboard interaction
- Comfortable mobile touch interactions

After successfully saving a birthday:

- The record should be persisted locally.
- The relevant birthday views should update.
- The user should receive appropriate visual feedback.
- The user should return to the appropriate application context.

---

# 8. Existing User Experience

When birthday records already exist, users should be able to access a dedicated birthday management experience.

The management experience should display the user's saved birthday records.

Each record should provide access to:

- View
- Edit
- Delete

The list should remain easy to scan and responsive across desktop, tablet, and mobile devices.

---

# 9. Birthday Management Screen

Provide a dedicated screen or view for managing birthday records.

The management screen should include:

- List of saved birthdays
- Add birthday action
- Edit birthday action
- Delete birthday action
- Appropriate empty state

Each birthday item should clearly display:

- Avatar
- Celebrant's name
- Birthday

The layout should remain clean and compact without feeling like a generic administrative interface.

The management screen should follow the DayBook visual identity.

---

# 10. Edit Birthday

Users must be able to edit an existing birthday record.

The edit experience should:

- Load the existing birthday information.
- Allow the user to modify the name.
- Allow the user to modify the birthday.
- Validate updated values.
- Preserve the existing record identifier.
- Save the updated record locally.

After editing:

- All birthday-related views should reflect the updated information immediately.
- If the birthday changes, upcoming and monthly birthday calculations should update accordingly.

---

# 11. Delete Birthday

Users must be able to delete an existing birthday record.

Deleting a record should:

- Remove the record from local data.
- Update all birthday-related views immediately.
- Remove the record from upcoming birthday calculations.
- Remove the record from monthly birthday views.

The deletion experience should prevent accidental deletion where appropriate.

The confirmation interaction should remain consistent with the DayBook visual language.

---

# 12. Import & Export

DayBook should support exporting and importing birthday data as JSON.

This allows users to manually move their birthday data between devices.

## Export

Users should be able to export their saved birthday records as a JSON file.

The exported data should:

- Follow the documented birthday data model.
- Contain only the data necessary to restore birthday records.
- Be portable between compatible DayBook installations.
- Be easy to understand and inspect.

Export should not require a backend or external service.

## Import

Users should be able to import a previously exported DayBook JSON file.

The application should:

- Allow the user to select a JSON file.
- Validate the imported data.
- Reject invalid or malformed data safely.
- Preserve valid birthday records.
- Provide clear feedback when import succeeds or fails.

The import process should not silently corrupt or partially replace existing data.

The exact behavior when imported records conflict with existing records should be defined before implementation.

The application should clearly communicate what will happen before modifying existing data.

---

# 13. Settings

Provide a Settings dialog or modal for application preferences and data actions.

The Settings interface should include:

- Upcoming birthday display count
- Light/Dark theme
- Export data

Import functionality should also be accessible from an appropriate data-management area.

The Settings UI should remain simple and focused.

Avoid turning Settings into a large administrative dashboard.

---

# 14. Upcoming Birthday Display Setting

Users should be able to control how many upcoming birthday cards are displayed.

The setting should determine the number of upcoming birthdays shown in the Upcoming Birthdays section.

The setting should:

- Have sensible minimum and maximum values.
- Persist locally.
- Update the Upcoming Birthdays section without requiring a page refresh.
- Work correctly across desktop and mobile.

The default value should provide a useful experience without making the section unnecessarily large.

---

# 15. Theme Setting

DayBook should support:

- Light mode
- Dark mode

The selected theme should persist locally.

Changing the theme should update the application without requiring a page reload.

Both themes must follow `docs/brand-guidelines.md`.

The light and dark themes should feel like the same DayBook product rather than two unrelated designs.

---

# 16. Happy Birthday Section

This section is the **main focus of the page** and should feel more visually engaging, impactful, and celebratory than the current prototype.

The section should prominently display the current birthday celebrant(s).

Add **randomly triggered confetti animations** to make the section feel dynamic and exciting.

## Multiple Celebrants

The application must support one or multiple birthday celebrants.

The UI should automatically adapt based on the number of current celebrants.

Consider:

- Layout and spacing
- Visual hierarchy
- Avatar sizing
- Text placement
- Number of celebrants
- Overall visual balance
- Avoiding a cluttered appearance

## Interactive Celebrants

Each birthday celebrant should be clickable/tappable.

When a user clicks or taps a celebrant, open a dialog/modal containing:

- Celebrant's avatar
- Celebrant's name
- Birthday
- A short birthday greeting/message

The modal should feel:

- Clean
- Modern
- Celebratory
- Visually engaging
- Easy to read

Use subtle animations or transitions when appropriate.

---

# 17. Confetti

The Happy Birthday section should include randomly triggered confetti.

## Behavior

- Confetti should appear at random intervals rather than continuously.
- The animation should feel celebratory without becoming distracting.
- Avoid excessive confetti.
- Confetti should not interfere with user interaction.
- Confetti should respect `prefers-reduced-motion`.
- Avoid triggering multiple confetti animations simultaneously.
- Clean up animation resources appropriately.

The exact implementation and timing are implementation details.

---

# 18. Celebrant Greeting

Birthday greetings should be selected randomly from a predefined list of greetings stored in the `constants/` folder.

Greetings should:

- Feel warm.
- Feel friendly.
- Feel celebratory.
- Be appropriate for different celebrants.
- Be reusable.
- Support the celebrant's name where appropriate.

Do not store the greeting inside the birthday record.

The greeting list should remain easy to customize.

---

# 19. Upcoming Birthdays Section

This section should display a scrollable list of upcoming birthdays derived from the user's saved birthday records.

Requirements:

- Display the configured number of upcoming birthdays.
- Use the user's saved birthday data.
- Display birthdays in chronological order.
- Start with the next upcoming birthday.
- Each birthday item should display:
  - Celebrant's avatar
  - Celebrant's name
  - Birthday/date
- Make the list scrollable when necessary.
- Do not allow the section to grow indefinitely.
- Maintain consistent spacing and alignment.
- Update automatically when birthday data changes.
- Remain responsive across desktop, tablet, and mobile devices.

---

# 20. Birthdays by Month

This section should display an overview of all saved birthdays organized by month.

Requirements:

- Display all 12 months as individual month cards.
- Indicate whether birthdays exist during each month.
- Make each month card clickable/tappable.
- Open a monthly birthday dialog when a month is selected.
- Display all birthdays for the selected month.
- Group multiple celebrants sharing the same date appropriately.
- Update automatically when birthday records change.

A calendar-style view is preferred if it improves usability.

---

# 21. Monthly Birthday Modal

When a user selects a month:

1. Open the monthly birthday dialog.
2. Display the selected month.
3. Display all celebrants with birthdays in that month.
4. Allow the content to scroll when necessary.

The monthly view should display:

- Celebrant's avatar
- Celebrant's name
- Birthday/date

## Empty Months

If a month has no birthdays:

- Clearly communicate that there are no birthdays for that month.
- Maintain the DayBook visual identity.
- Do not display a broken-looking or empty interface.

## Multiple Birthdays

If multiple celebrants share the same date:

- Group them appropriately.
- Avoid unnecessary repeated date labels.
- Make each celebrant easy to distinguish.

---

# 22. Responsive Requirements

The application must be mobile-first and fully responsive.

## Desktop

- Use available screen space effectively.
- Maintain clear visual hierarchy.
- Support multiple celebrants.
- Provide comfortable management interfaces.

## Tablet

- Adapt widths and spacing appropriately.
- Maintain readable typography.
- Maintain comfortable touch targets.
- Ensure dialogs and lists remain usable.

## Mobile

- Prioritize readability and touch interaction.
- Stack or reorganize content where necessary.
- Avoid horizontal overflow.
- Ensure controls have comfortable touch targets.
- Ensure forms work naturally with mobile input.
- Ensure dialogs fit within the viewport.
- Make long lists scrollable.
- Do not rely on hover interactions for important functionality.

All screens must remain visually consistent with the DayBook brand.

---

# 23. Data Model

The birthday data model should represent a user-managed birthday record.

Each record should contain:

- `id`: Unique identifier.
- `name`: Celebrant's display name.
- `birthday`: Celebrant's birth date in `YYYY-MM-DD` format.
- `avatar`: Optional avatar/image source.

If no custom avatar is provided, generate an avatar using Avvvatars.

For now, use:

- https://avvvatars.com
- https://github.com/nusu/avvvatars

Use the **shapes variant**.

The avatar system should remain isolated so that it can be replaced later without requiring significant changes to birthday-related components.

---

# 24. Data Validation

All user-provided birthday records must be validated before being saved.

Validation should ensure:

- Required fields are present.
- Name is not empty.
- Birthday is a valid date.
- Birthday follows the expected data format.
- Imported JSON follows the expected data model.

Validation errors should be clear and understandable to users.

Invalid imported data must never silently overwrite valid existing data.

---

# 25. Data Import/Export Compatibility

The JSON data format should be treated as a portable data format.

The application should maintain a clear and stable data structure so users can:

- Export data from one device.
- Import it on another device.
- Restore their birthday records.

The exported format should remain documented and easy to understand.

Future changes to the data model should consider backward compatibility with previously exported files.

---

# 26. Data & Business Logic

Keep birthday data separate from UI components.

The application should have one source of truth for birthday records.

Derive:

- Current celebrants
- Upcoming birthdays
- Monthly birthday groups

from the same birthday data.

Do not duplicate derived birthday data.

Keep reusable birthday and date calculations in appropriate helpers.

User data persistence and data transformation should remain separate from presentation components.

---

# 27. Constants

Static application data and configuration should remain in the `constants/` folder.

Examples include:

- Birthday greetings
- Month definitions
- Default application settings
- Static configuration

User-managed birthday records must **not** be treated as static constants.

Do not place user-created birthday records in `constants/`.

---

# 28. Helpers

Use the `helpers/` folder for reusable functions such as:

- Date formatting
- Determining upcoming birthdays
- Grouping birthdays by month
- Sorting birthdays
- Determining current celebrants
- Birthday validation
- Import data validation
- Export data preparation
- Selecting birthday greetings

Keep helpers focused on a single responsibility.

---

# 29. Types

Use reusable TypeScript types for:

- Birthday records
- Birthday data
- Application settings
- Imported data
- Exported data
- Related UI state where appropriate

Avoid duplicate type definitions.

Do not use `any`.

---

# 30. Implementation Guidelines

## Component Architecture

Keep components small, focused, and reusable.

Separate:

- Presentation
- User interaction
- Birthday business logic
- Data persistence
- Data validation

Do not place large amounts of business logic directly inside page components.

Avoid unnecessary abstractions.

## UI

- Use shadcn/ui where appropriate.
- Use TailwindCSS for styling.
- Do not introduce additional UI libraries.
- Do not use inline styles.
- Follow `docs/brand-guidelines.md`.

## Forms

Forms should be:

- Accessible
- Responsive
- Properly validated
- Keyboard accessible
- Comfortable on mobile
- Clear about validation errors

## Dialogs

Use accessible dialogs for:

- Celebrant information
- Monthly birthdays
- Settings
- Confirmation interactions where appropriate

Dialogs should work on desktop and mobile.

---

# 31. Accessibility

The application must:

- Use semantic HTML.
- Provide accessible labels.
- Ensure interactive elements are keyboard accessible.
- Provide visible focus states.
- Ensure dialogs are accessible.
- Ensure forms provide useful validation feedback.
- Not rely solely on color.
- Respect `prefers-reduced-motion`.
- Provide comfortable touch targets.
- Avoid hover-only functionality.

---

# 32. Performance

Avoid unnecessary:

- Re-renders
- State
- Effects
- Data duplication
- Expensive calculations

Birthday-derived data should be calculated efficiently.

Animation resources, event listeners, and other temporary resources must be cleaned up appropriately.

---

# 33. Application States

The application should intentionally handle:

- No birthday records
- One birthday record
- Multiple birthday records
- Multiple birthdays on the same date
- Empty months
- Long birthday lists
- Invalid form input
- Invalid imported JSON
- Import failures
- Export actions
- Delete confirmation
- Theme changes
- Settings changes

Do not allow any of these states to result in a broken or confusing interface.

---

# 34. Rules

Follow all development rules defined in `docs/rules.md`.

The `docs/rules.md` file is the source of truth for:

- TypeScript usage
- Variable declarations
- React conventions
- Naming conventions
- TailwindCSS
- shadcn/ui
- Component structure
- Constants
- Helpers
- Types
- Data persistence
- Accessibility
- Code formatting
- Dependencies
- Code organization

---

# 35. Brand Guidelines

Follow `docs/brand-guidelines.md` for all branding and visual design decisions.

Do not override brand guidelines unless explicitly instructed to do so.

When implementing the UI:

1. Follow this document for functionality and behavior.
2. Follow `docs/brand-guidelines.md` for visual design and branding.
3. Follow `docs/rules.md` for implementation and coding conventions.

---

# 36. General Agent Behavior

Before implementing a feature:

- Inspect the existing project structure.
- Inspect the current implementation.
- Reuse existing components and utilities where appropriate.
- Check whether required functionality already exists.
- Avoid creating duplicate components or utilities.
- Follow existing naming conventions.
- Do not introduce unnecessary dependencies.

When modifying existing code:

- Preserve existing functionality unless requirements explicitly change it.
- Make the smallest reasonable change required.
- Do not rewrite unrelated parts of the project.

When implementing the local-data pivot:

- Do not retain static birthday records as the primary source of truth.
- Do not duplicate birthday data.
- Do not create separate datasets for different sections.
- Do not hardcode user data into components.
- Keep persistence separate from presentation.
- Ensure existing birthday views continue to work with user-managed data.

Before completing the task:

- Check for TypeScript errors.
- Check for linting and formatting issues.
- Remove unused imports and variables.
- Remove debugging code.
- Verify responsive behavior.
- Verify keyboard and touch interactions.
- Verify dialogs and modals.
- Verify form validation.
- Verify local persistence.
- Verify import/export behavior.
- Verify settings behavior.
- Verify the application still builds successfully.
