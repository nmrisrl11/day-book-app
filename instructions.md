# System Instructions

## 1. Project Overview

Build a **birthday tracker** that displays:

- The current birthday celebrant(s)
- Upcoming birthdays
- All birthdays organized by month

The page should provide a clear, celebratory, and responsive experience across desktop, tablet, and mobile devices.

Refer to the **Page Structure** section for the required page sections and their behavior.

---

## Visual Prototype

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

### Prototype Guidelines

The prototype is a **visual reference, not a pixel-perfect specification**.

Use it as the starting point for the visual direction, but improve and adapt the design based on the functional, responsive, accessibility, and interaction requirements defined in this document.

Do not reproduce limitations from the prototype. The final implementation must support the full requirements described in this document, including:

- Multiple birthday celebrants
- Interactive celebrants
- Celebrant information dialogs
- Monthly birthday dialogs
- Responsive layouts
- Mobile interactions
- Light and dark themes
- Accessibility
- Dynamic birthday data

When the prototype conflicts with the written requirements in `instructions.md`, **follow the written requirements**.

When making visual decisions that are not explicitly defined in the requirements, use the prototype as the primary visual reference and `brand-guidelines.md` as the brand/design authority.

Do not replace the prototype's visual direction with a generic dashboard, admin interface, or unrelated design aesthetic.

---

# 2. Page Structure

## 2.1 Happy Birthday Section

### Main Focus

This section is the **main focus of the page** and should feel more visually engaging, impactful, and celebratory than the current prototype.

The section should prominently display the current birthday celebrant(s).

Add **randomly triggered confetti animations** to make the section feel dynamic and exciting.

### Multiple Celebrants

The application must support **one or multiple birthday celebrants**.

The current prototype only demonstrates a single celebrant, but the implementation must handle multiple celebrants gracefully.

Consider:

- Layout and spacing
- Visual hierarchy
- Avatar sizing
- Text placement
- Number of celebrants
- Overall visual balance
- Avoiding a cluttered appearance

The UI should adapt automatically based on the number of current celebrants.

### Interactive Celebrants

Each birthday celebrant should be **clickable/tappable**.

When a user clicks or taps a celebrant, open a **dialog/modal** containing additional information about that person.

The modal should display:

- Celebrant's avatar/image
- Celebrant's name
- Birthday
- A short birthday greeting/message

The modal should feel:

- Clean
- Modern
- Celebratory
- Visually engaging
- Easy to read

Use subtle animations or transitions when opening and closing the modal where appropriate.

### Responsive Design

The section must be fully responsive.

Ensure that:

- The celebrant layout adapts to different screen sizes.
- Multiple celebrants remain easy to view and interact with.
- Avatars maintain appropriate sizing.
- Text remains readable.
- The modal works well on desktop, tablet, and mobile.
- Touch targets are comfortable on mobile devices.
- The layout remains visually balanced at all screen sizes.

---

## 2.2 Upcoming Birthdays Section

This section should display a **scrollable list of upcoming birthdays**.

### Requirements

- Display at least **5–6 upcoming birthdays** by default.
- Display birthdays in chronological order, starting with the next upcoming birthday.
- Each birthday item should display:
  - Celebrant's avatar
  - Celebrant's name
  - Birthday/date
- Keep the layout compact and easy to scan.
- Make the list scrollable when there are more birthdays than can comfortably fit within the section.
- Do not allow the section to grow indefinitely because of a large number of birthdays.
- Maintain consistent spacing and alignment between entries.
- The section must be responsive across desktop, tablet, and mobile devices.

---

## 2.3 Birthdays Section

This section should display an overview of **all celebrants' birthdays organized by month**.

### Requirements

- Display all **12 months** as individual month cards.
- Each month card should indicate whether birthdays exist during that month.
- Each month card must be clickable/tappable.
- Clicking a month should open a **dialog/modal** containing the birthdays for that month.
- A **calendar-style view** is preferred if it improves usability and makes the birthdays easier to understand.

### Monthly Birthday View

The monthly view should display:

- Celebrant's avatar
- Celebrant's name
- Birthday/date

If multiple celebrants share the same date, group them together appropriately.

### Modal Design

The monthly birthday modal should:

- Clearly identify the selected month.
- Display all celebrants with birthdays in that month.
- Support scrolling when there are many birthdays.
- Use a clean and visually engaging layout.
- Work well on desktop and mobile.
- Open and close with smooth, subtle transitions.

### Responsive Design

The entire section must be responsive across:

- Desktop
- Tablet
- Mobile

Month cards, calendar views, birthday lists, and modals must adapt appropriately to different screen sizes.

---

# 3. Features & Interactions

## 3.1 Confetti

The Happy Birthday section should include **randomly triggered confetti**.

### Behavior

- Confetti should appear at random intervals rather than continuously.
- The animation should feel celebratory without becoming distracting.
- Avoid excessive confetti that could negatively affect readability or performance.
- Confetti should remain within the visual context of the Happy Birthday section when possible.
- The animation should not interfere with user interaction.
- Respect `prefers-reduced-motion` and reduce or disable decorative animations when the user has requested reduced motion.

### Timing

- Confetti should trigger infrequently and unpredictably.
- Do not trigger confetti continuously or on every render.
- Avoid triggering multiple confetti animations simultaneously.
- The exact timing is an implementation detail, but the result should feel occasional and spontaneous.

### Performance

- Avoid creating unnecessary DOM elements for each animation.
- Clean up animation resources when the component is unmounted.
- Do not allow repeated animations to accumulate over time.

---

## 3.2 Celebrant Modal

Each current birthday celebrant should be interactive.

### Opening

When a celebrant is clicked or tapped:

1. Open the celebrant dialog/modal.
2. Display the selected celebrant's information.
3. Preserve the context of the selected celebrant.
4. Provide a clear way to close the modal.

### Content

The modal should display:

- Avatar
- Name
- Birthday
- Birthday greeting/message

### Birthday Greeting

The birthday greeting should be selected randomly from a predefined list of greetings stored in the `constants/` folder.

The greeting should:

- Feel warm, friendly, and celebratory.
- Be appropriate for a birthday.
- Be reusable across different celebrants.
- Support the celebrant's name when appropriate.

Do not store the greeting directly in the birthday data model.

The greeting list should be easy to customize by editing a single constant data source.

### Interaction

The modal should:

- Be keyboard accessible.
- Support closing through the close button.
- Support the standard dialog close interaction.
- Prevent interaction with the underlying content while open.
- Return focus appropriately when closed.
- Work correctly on touch devices.

Use the existing **shadcn/ui dialog components** rather than implementing a custom dialog system.

---

## 3.3 Monthly Birthday Modal

When a user selects a month card:

1. Open the monthly birthday dialog.
2. Display the selected month.
3. Display all celebrants with birthdays in that month.
4. Allow the content to scroll if necessary.

### Empty Months

If a month has no birthdays:

- Clearly communicate that there are no birthdays for that month.
- Keep the empty state visually consistent with the rest of the design.
- Do not display an empty or broken-looking calendar/list.

### Multiple Birthdays

If multiple celebrants have birthdays on the same date:

- Group them together where appropriate.
- Avoid unnecessary repeated date labels.
- Make it easy to distinguish each celebrant.

---

# 4. Responsive Requirements

The application must be **mobile-first and fully responsive**.

## Desktop

- Use the available screen space effectively.
- Maintain clear visual hierarchy between sections.
- Avoid excessive empty space.
- Support multiple celebrants without making the layout feel crowded.

## Tablet

- Adapt section widths and spacing appropriately.
- Maintain readable typography and comfortable touch targets.
- Ensure dialogs and lists remain usable.

## Mobile

- Prioritize readability and touch interaction.
- Stack or reorganize content when necessary.
- Avoid horizontal overflow.
- Ensure buttons, cards, and celebrants have comfortable touch targets.
- Dialogs should fit within the viewport and become scrollable when content exceeds the available height.
- Birthday lists should remain easy to scan.
- Do not rely on hover interactions for important functionality.

## General

- Avoid fixed dimensions that cause content to overflow.
- Use responsive TailwindCSS utilities.
- Test layouts at different viewport sizes.
- Ensure images and avatars scale appropriately.
- Ensure text does not become clipped or overflow containers.

---

# 5. Data Model

The birthday data must follow this structure:

- `id`: Unique identifier for the celebrant.
- `name`: Celebrant's display name.
- `birthday`: Celebrant's birth date in `YYYY-MM-DD` format.
- `avatar`: Optional custom avatar/image source. If omitted, generate an avatar using Avvvatars.

Example data structure:

    {
      "id": "1",
      "name": "John Doe",
      "birthday": "1995-08-20"
    }

For now, use **Avvvatars** for generated avatars:

- https://avvvatars.com
- https://github.com/nusu/avvvatars

Use the **shapes variant**.

The avatar implementation should be isolated so it can be replaced with real image URLs or another avatar provider later without requiring significant changes to the birthday components.

If no custom avatar is provided, use Avvvatars as the fallback.

---

# 6. Data Customization

The birthday data must be **easy to replace**.

The project should be structured so that someone who clones or opensources the repository can replace the sample birthday data with their own data without modifying UI components.

### Requirements

- Keep birthday data separate from UI components.
- Store static/sample birthday data in the appropriate `constants/` location according to `rules.md`.
- Components should consume birthday data rather than defining the data themselves.
- Do not hard-code individual celebrants inside components.
- Do not duplicate birthday data across multiple components.
- The same source of birthday data should power:
  - Happy Birthday Section
  - Upcoming Birthdays Section
  - Birthdays Section
  - Celebrant Modal
  - Monthly Birthday Modal

### Public Data Entry Point

The sample birthday data should have one obvious and easy-to-find entry point.

A developer who clones the repository should be able to quickly identify:

- Where the birthday data is stored.
- What data format is expected.
- Which fields are required.
- Which fields are optional.

Do not require developers to modify UI components, helpers, or business logic just to replace the sample birthday data.

### Data Replacement

A user should be able to replace the sample data by editing **one clearly identifiable data source** while keeping the existing UI and functionality intact.

The data source should follow the defined **Data Model**.

---

# 7. Implementation Guidelines

## Component Architecture

- Keep components small, focused, and reusable.
- Separate UI components from data and business logic.
- Avoid putting large amounts of logic directly inside page components.
- Reuse components when the same UI pattern appears in multiple places.

### Component Architecture Guidance

Create reusable components when they provide a clear separation of responsibility.

The following are examples of possible components, not mandatory component names:

- Celebrant card
- Celebrant dialog
- Upcoming birthday list
- Birthday item
- Month card
- Monthly birthday dialog
- Confetti animation

Do not create components solely to satisfy this list. Prefer simple, focused components and avoid unnecessary abstraction.

## Data & Logic

- Keep birthday data separate from UI components.
- Derive upcoming birthdays from the birthday data rather than maintaining a separate list.
- Derive monthly birthday groups from the same birthday data.
- Avoid duplicating derived data.
- Keep date-related logic in reusable helper functions when appropriate.

## Constants

Follow `rules.md` for constants.

Static configuration, sample birthday data, and birthday greetings should be stored in the `constants/` folder.

The birthday greeting list should be stored separately from the birthday data so it can be customized independently.

## Helpers

Use the `helpers/` folder for reusable functions such as:

- Date formatting
- Determining upcoming birthdays
- Grouping birthdays by month
- Sorting birthdays
- Determining current celebrants
- Selecting or formatting birthday greetings when appropriate

Do not place reusable business logic directly inside UI components when it can be extracted cleanly.

## Types

Follow `rules.md` for type definitions.

Create reusable TypeScript types for birthday data and related structures.

Avoid using `any`.

## UI Components

- Use **shadcn/ui** components where appropriate.
- Use **TailwindCSS** for styling.
- Do not introduce additional UI libraries.
- Do not use inline styles.
- Follow `brand-guidelines.md` for visual decisions.

## Date Handling

Birthday calculations should correctly handle:

- Birthdays later in the current year.
- Birthdays earlier in the current year.
- Birthdays occurring today.
- Multiple birthdays on the same date.
- Year boundaries.

Do not modify the original birth year when determining the next occurrence of a birthday.

## Accessibility

- Use semantic HTML.
- Ensure interactive elements are keyboard accessible.
- Provide appropriate accessible labels.
- Ensure dialogs are accessible.
- Do not rely solely on color to communicate information.
- Respect `prefers-reduced-motion`.

## Performance

- Avoid unnecessary re-renders.
- Avoid unnecessary state.
- Avoid expensive calculations during every render.
- Memoize or precompute derived data only when there is a measurable benefit.
- Clean up animations and event listeners when components unmount.

---

# 8. Rules

Follow all development rules defined in `rules.md`.

The `rules.md` file is the source of truth for:

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
- Code formatting
- Dependencies
- Accessibility
- Code organization

---

# 9. Brand Guidelines

Follow `brand-guidelines.md` for all branding and visual design decisions.

Do not override brand guidelines unless explicitly instructed to do so.

When implementing the UI:

1. Follow the requirements in this file for functionality and behavior.
2. Follow `brand-guidelines.md` for visual design and branding.
3. Follow `rules.md` for implementation and coding conventions.

---

# 10. General Agent Behavior

Before implementing a feature:

- Inspect the existing project structure.
- Reuse existing components and utilities where appropriate.
- Check whether the required functionality already exists.
- Avoid creating duplicate components or utilities.
- Follow the existing project's naming conventions.
- Do not introduce unnecessary dependencies.

When modifying existing code:

- Preserve existing functionality unless the requirements explicitly change it.
- Make the smallest reasonable change required.
- Do not rewrite unrelated parts of the project.

When creating new functionality:

- Keep it reusable.
- Keep data separate from presentation.
- Follow the defined data model.
- Ensure the feature is responsive.
- Ensure the feature is accessible.
- Follow `rules.md`.

Before completing the task:

- Check for TypeScript errors.
- Check for linting/formatting issues when available.
- Remove unused imports and variables.
- Remove debugging code.
- Verify responsive behavior.
- Verify keyboard and touch interactions.
- Verify that dialogs and modals are accessible.
- Verify that the application still builds successfully when possible.
