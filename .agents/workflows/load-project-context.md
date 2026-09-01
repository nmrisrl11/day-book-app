---
description: Load and review the project's Markdown documentation before development so you understand the app's architecture, structure, guidelines, rules, features, and current state before implementing anything.
---

# Pre-Development Documentation Context

Before implementing, modifying, refactoring, or debugging any feature, first review the project's Markdown documentation to understand the full context of the application.

The purpose of this workflow is to prevent blind implementation and ensure all development work follows the project's existing architecture, conventions, guidelines, and rules.

---

## Documentation to Read First

Look for and read the following:

- `AGENTS.md`
- `CURRENT_STATE.md`
- `PENDING_CHANGES.md`
- `README.md`
- `docs/markdowns/**`

For `docs/markdowns`, recursively inspect the relevant Markdown files and identify documentation related to the feature, architecture, system, or area of the codebase you are about to modify.

Do not assume that only one documentation file contains the required context.

---

## What You Need to Understand

Before writing or modifying code, establish an understanding of:

### Project Architecture

Understand:

- Overall application architecture
- Architectural patterns
- Layer boundaries
- Feature organization
- Module responsibilities
- Dependency direction
- Data flow
- State management
- Business logic placement
- UI/component responsibilities

Follow the architecture already established by the project.

Do not introduce a different architectural pattern simply because it is personally preferred.

---

### Project Structure

Understand:

- Source directory structure
- Feature/module organization
- Component organization
- Hooks
- Utilities
- Stores
- Services
- Types
- Constants
- Pages/routes
- Shared components
- Configuration files
- Documentation structure

When implementing a feature, place files according to the existing project conventions.

---

### Coding Guidelines and Rules

Pay close attention to:

- `AGENTS.md` instructions
- React conventions
- TypeScript conventions
- Naming conventions
- Component conventions
- State management rules
- Styling conventions
- TailwindCSS conventions
- shadcn/ui conventions
- Import conventions
- File organization
- Error handling
- Accessibility requirements
- Performance guidelines
- Testing requirements
- PWA requirements
- Any project-specific restrictions

These rules take precedence over generic implementation habits.

---

### Current Application State

Read `CURRENT_STATE.md` to understand what has already been implemented.

Determine:

- Existing features
- Current architecture
- Current integrations
- Current storage/data strategy
- Current application behavior
- Recently implemented functionality
- Known limitations
- Existing technical decisions

Do not reimplement functionality that already exists.

Reuse existing systems whenever appropriate.

---

### Pending Work

Read `PENDING_CHANGES.md` to understand:

- Known incomplete work
- Planned changes
- Existing technical debt
- Features currently being worked on
- Known follow-up tasks
- Migration work
- Outstanding improvements

If the requested feature overlaps with pending work, take that context into consideration before implementing.

---

### README and Feature Documentation

Use `README.md` and relevant files under `docs/markdowns` to understand:

- Product purpose
- User-facing features
- Supported workflows
- Development workflow
- Technical decisions
- Feature-specific behavior
- Integration details
- Previous implementation decisions

Documentation may contain important context that is not obvious from the source code alone.

---

# Development Context Rules

After reviewing the documentation:

1. Inspect the existing implementation relevant to the requested task.
2. Identify existing components, hooks, utilities, stores, services, types, and patterns that should be reused.
3. Follow existing abstractions before creating new ones.
4. Follow existing naming and file organization conventions.
5. Avoid introducing duplicate functionality.
6. Avoid introducing unnecessary dependencies.
7. Avoid creating a new pattern when an established project pattern already exists.
8. Preserve existing behavior unless the requested change explicitly requires changing it.
9. Consider existing PWA, performance, accessibility, and responsive-design requirements.
10. Consider how the change affects the existing architecture and related features.
11. Check relevant documentation for constraints before making architectural decisions.
12. If documentation and implementation disagree, verify the actual codebase before deciding what is current.
13. Do not blindly trust documentation when the source code clearly shows a newer implementation.
14. Do not blindly follow existing code if `AGENTS.md` explicitly establishes a rule that the implementation should now follow.

---

# Before Implementation

Before writing code, internally establish:

### 1. What already exists?

Identify reusable functionality related to the requested feature.

### 2. Where does this feature belong?

Determine the correct architectural layer, feature/module, directory, and component location.

### 3. What existing patterns should be followed?

Identify similar implementations already present in the codebase.

### 4. What existing behavior could be affected?

Consider related features, shared components, state, storage, routing, PWA behavior, and user workflows.

### 5. What documentation constraints apply?

Check the relevant Markdown documentation for project-specific rules or previous decisions.

### 6. What is the smallest correct implementation?

Prefer a solution that integrates naturally with the existing architecture instead of introducing unnecessary complexity.

---

# Important: Do Not Stop at Documentation

Reading the documentation is a prerequisite, not a replacement for inspecting the code.

After reading the documentation, inspect the relevant implementation before making changes.

Use both:

- Documentation → project context, decisions, rules, intended architecture
- Source code → actual current implementation

Treat the current codebase as the final source of truth when documentation is stale.

---

# Handling Missing or Ambiguous Documentation

If a relevant documentation file does not exist:

- Continue by inspecting the codebase.
- Do not invent project rules.
- Follow the conventions established by the existing implementation.
- Do not create documentation unless the development task requires it.

If documentation contains contradictory information:

- Investigate the current implementation.
- Determine which behavior is actually current.
- Follow explicit instructions in `AGENTS.md` where applicable.
- Do not make assumptions when the repository provides enough evidence to verify the answer.

If the requested task requires an architectural decision that cannot be determined confidently from the documentation or codebase, explain the ambiguity before making a potentially disruptive change.

---

# Scope

This workflow is a context-loading workflow.

It should NOT:

- Modify Markdown documentation
- Refactor unrelated code
- Implement features automatically
- Change project architecture automatically
- Create unnecessary files
- Install dependencies automatically
- Make unrelated improvements

Its purpose is to make sure that, before development begins, you understand the project well enough to implement the requested task consistently with the existing codebase.

---

# Expected Behavior

Whenever this workflow is triggered before a development task:

1. Read the relevant Markdown documentation.
2. Understand the architecture, structure, guidelines, rules, current state, and pending work.
3. Inspect the relevant source code.
4. Identify reusable existing implementations.
5. Use that context when planning the requested implementation.
6. Only then proceed with development.

The goal is simple:

**Understand the project first. Implement second.**

Never implement a requested feature blindly when the repository already contains documentation and established architectural patterns that provide the necessary context.
