---
description: Audit and synchronize all project Markdown documentation with the current codebase, features, architecture, and recent changes. Update only what is outdated or missing; skip files that are already accurate.
---

You are responsible for keeping the project's Markdown documentation accurate and synchronized with the actual current state of the codebase.

## Objective

Audit the current implementation and compare it against the existing Markdown documentation.

The goal is to identify documentation that is:

- Outdated
- Missing recently implemented features
- Missing architecture or technical changes
- Describing removed or changed behavior
- Inconsistent with the current project structure
- Inconsistent with the current dependencies, configuration, or development workflow
- Still referencing previously pending work that has already been completed

Only update documentation when there is a real discrepancy.

If a document is already accurate and complete, SKIP it.

Do not make documentation changes simply for wording, formatting, or stylistic preferences unless they improve clarity or fix an actual inconsistency.

---

## Documentation to Audit

Inspect these documentation sources:

- `AGENTS.md`
- `CURRENT_STATE.md`
- `PENDING_CHANGES.md`
- `README.md`
- `docs/markdowns/**`

For `docs/markdowns`, recursively inspect all relevant Markdown files and subdirectories.

Also inspect the actual source code, configuration, package/dependency files, and project structure necessary to verify whether the documentation reflects reality.

---

## Step 1 — Understand the Current Implementation

Before editing any documentation, inspect the current project.

Review, where applicable:

- `package.json`
- `src/` and relevant application source files
- Components
- Pages/routes
- Hooks
- Stores/state management
- Utilities
- Services
- Database/storage implementation
- PWA configuration
- Build configuration
- Vite configuration
- TypeScript configuration
- Tailwind configuration
- shadcn/ui components
- Testing configuration
- ESLint/formatting configuration
- Git configuration/workflows
- Other project configuration files
- Recently added or modified features

Do not assume the existing documentation is correct.

The codebase is the source of truth for the current implementation.

---

## Step 2 — Compare Against Previous Documentation

Read the existing documentation and determine what has changed since it was last documented.

Look for:

- Newly implemented features
- Updated features
- Removed features
- Renamed features
- Changed user flows
- Changed architecture
- Changed data/storage strategy
- New dependencies
- Removed dependencies
- Changed project structure
- New routes/pages
- New components or systems that should be documented
- Changed PWA behavior
- Changed import/export behavior
- Changed settings/configuration
- Changed development commands
- Changed deployment/build behavior
- Previously planned features that are now implemented
- Documentation that describes behavior that no longer exists

Use Git history, recent changes, diffs, or other available repository information when useful to establish what changed since the previous documentation state.

Do not rely solely on Git history. Verify the current implementation directly.

---

# Step 3 — Audit Each Documentation File

## AGENTS.md

Ensure `AGENTS.md` accurately describes the rules and conventions an AI coding agent should follow when working on the project.

Check for:

- Current architecture
- Current project structure
- Technology stack
- Coding conventions
- Component conventions
- State management conventions
- Data/storage conventions
- Styling conventions
- TailwindCSS conventions
- shadcn/ui usage
- TypeScript conventions
- React conventions
- Performance expectations
- PWA considerations
- Testing expectations
- Build/lint/type-check requirements
- Important project-specific constraints
- Rules that are no longer applicable

Do not turn `AGENTS.md` into a general project README.

It should primarily contain instructions and constraints useful to an AI coding agent.

Preserve existing valid rules unless they conflict with the current architecture.

---

## CURRENT_STATE.md

Ensure this file represents the actual current state of the project.

Update it when:

- A previously planned feature is now implemented
- A feature has changed significantly
- Architecture has changed
- Storage/data handling has changed
- Important dependencies or infrastructure have changed
- New major capabilities have been added
- Existing functionality has been removed or replaced

The document should describe what currently exists, not what is planned.

Do not leave completed work described as future work.

Do not add speculative features.

---

## PENDING_CHANGES.md

This file should contain only genuinely pending work.

Compare every item against the current implementation.

If an item has already been implemented:

- Remove it from the pending list
- Or move it to an appropriate completed/history section only if such a section already exists and is useful

If a previously pending item is partially implemented:

- Update its status accurately
- Clearly describe what remains

If new pending work is clearly documented elsewhere in the repository and belongs here, add it only when there is enough evidence that it is actually pending.

Do not invent TODOs or future features.

If there are no meaningful pending changes, keep the document minimal or update it according to the existing project's convention.

---

## README.md

Ensure the README accurately represents the current product and project.

Check:

- Product description
- Main features
- Current capabilities
- Installation instructions
- Development commands
- Build commands
- Preview commands
- Technology stack
- Architecture references
- PWA information
- Storage/data behavior
- Import/export functionality
- Screenshots or links if they exist
- Open-source information
- Project links
- Any outdated feature descriptions

Keep the README focused on what users and contributors actually need.

Do not duplicate excessive internal implementation details that belong in `AGENTS.md` or `CURRENT_STATE.md`.

Do not add marketing claims that cannot be verified from the current project.

---

## docs/markdowns/**

Audit every relevant Markdown document under `docs/markdowns`.

Check for:

- Outdated implementation details
- Old architecture references
- Old feature behavior
- Completed tasks still described as pending
- Removed features
- Renamed components/features
- Incorrect file paths
- Incorrect commands
- Incorrect dependencies
- Stale implementation instructions
- Duplicate or contradictory documentation
- Documentation that should reference newer architecture or implementation

Preserve useful historical documentation when it is intentionally historical.

Do not rewrite documentation simply because newer terminology could be used.

---

# Step 4 — Cross-Document Consistency

After auditing individual files, verify that the documentation is consistent with each other.

Pay particular attention to contradictions such as:

- `README.md` saying a feature does not exist while `CURRENT_STATE.md` says it does
- `PENDING_CHANGES.md` listing a feature that is already implemented
- `AGENTS.md` describing an old architecture
- `docs/markdowns` describing an old storage mechanism
- Different documentation files describing different project structures
- Different commands or setup instructions
- Features having different names in different documents

The documentation should tell one consistent story about the current project.

---

# Step 5 — Make Minimal, Targeted Updates

Only modify files that actually need changes.

Follow these rules:

1. Do not rewrite an entire document when only a small section is outdated.
2. Preserve existing structure and useful documentation.
3. Preserve project-specific terminology unless it is demonstrably outdated.
4. Do not introduce speculative information.
5. Do not document code that does not actually exist.
6. Do not remove useful documentation simply because it is not related to recent changes.
7. Do not modify source code, configuration, dependencies, or application behavior as part of this workflow.
8. This workflow is documentation-only.
9. Do not create new documentation files unless there is a clear existing documentation convention requiring them.
10. Avoid unnecessary formatting-only changes.
11. Keep documentation concise and maintainable.
12. Prefer facts verified from the current repository over assumptions.

---

# Step 6 — Validate the Changes

After updating documentation:

- Re-read every modified file
- Check for contradictions between documentation files
- Verify referenced paths actually exist
- Verify commands against `package.json` and project configuration
- Verify feature descriptions against the implementation
- Verify architecture descriptions against the actual source structure
- Verify pending items are genuinely pending
- Check for accidental duplication
- Check for stale references left behind by the changes

Do not modify application code just to satisfy documentation.

---

# Important Rule — Skip When No Update Is Needed

If a documentation file accurately reflects the current implementation:

DO NOT modify it.

If all documentation is already synchronized with the current codebase:

DO NOT make any documentation changes.

The desired outcome is not "update every file."

The desired outcome is:

"Make the documentation accurately represent the current project, while making the smallest necessary changes."

---

# Final Response

After completing the audit, provide a concise summary containing:

## Documentation Audited

List the documentation files/directories that were checked.

## Updated

List only the files that were actually modified and briefly explain what changed.

## Skipped

List files that were checked but did not require changes.

## Verification

Briefly mention the major areas verified against the current implementation, such as:

- Features
- Architecture
- Dependencies
- Storage/data layer
- PWA
- Routes/pages
- Development commands
- Pending changes
- Project structure

If no documentation required changes, clearly state:

"No documentation updates were necessary. The existing Markdown documentation is already synchronized with the current implementation."

Do not make unrelated code changes.
