---
name: frontend-builder
description: Build a complete, modern, responsive frontend application from scratch from a natural-language idea. Use when the user asks to create, build, or scaffold a web app, dashboard, website, or UI. Covers requirements, planning, design system, project setup, implementation, API integration, testing, optimization, and delivery.
argument-hint: Describe the application you want to build
---

# frontend-builder

Before starting: read `CLAUDE.md`, `MEMORY.md`, and any relevant notes in `examples/`. Apply the saved preferences. Explain technical terms in simple language the first time they appear.

Build each app in `C:\Users\unnati-rastogi\Downloads\<app-name>\` (a sibling of this folder, never inside another app).

## Step 1: Understand the application

- Restate the idea: purpose, target audience, required pages, and features.
- Convert the natural-language request into a numbered list of development requirements.
- Ask questions only if critical information is missing (one at a time). Otherwise choose sensible defaults and list them as assumptions.
- Check `examples/` and any provided Figma/screenshots/API docs.

## Step 2: Plan the application

- Recommend a stack (see `CLAUDE.md` defaults) and justify the framework choice in one or two plain sentences.
- Define architecture, routes, pages, layouts, and components.
- Describe the user journey (for example: register -> log in -> dashboard -> manage records).
- Define the folder structure and an ordered implementation plan.
- **Present the plan, stack, and design direction and wait for approval** before building.

## Step 3: Design the user interface

- Define the design system: color tokens (light and dark), font pairing, type scale, spacing scale, radius, shadows.
- Premium/elegant by default: generous spacing, restrained palette, subtle gradients, soft shadows, consistent icon set.
- Design navigation (sidebar on desktop, drawer on mobile, top bar) and page layouts.
- Plan reusable components and responsive behavior (mobile-first breakpoints).
- Follow Figma/reference designs when provided.

## Step 4: Set up the project

- Create the project folder (`C:\Users\unnati-rastogi\Downloads\<app-name>\`) and config files.
- List the dependencies and **ask approval before installing** them.
- Configure TypeScript (strict), Tailwind CSS, path aliases, routing, ESLint, Prettier, and the test runner.
- Organize source folders per `CLAUDE.md`.
- **Install the agent team** so the user can keep changing the app from the VS Code chat: copy `agent-kit/` (this folder's template) into the new app folder, keeping the same relative paths (`.claude/agents`, `.claude/skills/team`, `.github/prompts/team.prompt.md`). Replace `{{APP_NAME}}`, fill `CLAUDE.template.md` into the app's `CLAUDE.md` and `MEMORY.template.md` into `MEMORY.md`, and write `.claude/skills/project-conventions/SKILL.md` from the real stack once it is built. Delete the `i18n-translator` agent if the app has one language. Do not add agent features to the app UI.

## Step 5: Build the application

- Build in this order: design tokens and global styles -> UI primitives -> layout shell -> shared feature components -> pages -> routing and guards.
- Implement every required page and feature: forms (with validation and feedback), tables, search/filter/sort/pagination, dashboards, dialogs, toasts, dark mode.
- Every button, link, and form must do something real. No dead placeholders.
- Use realistic sample data when no backend exists, in `src/data`, accessed only through service functions. Label it clearly as mock data.
- Handle loading, empty, success, and error states.

## Step 6: API integration

Only when APIs are available:

- Read the API documentation fully.
- Put API logic in `src/services` (one client, one module per resource), with typed request/response models.
- Implement GET, POST, PUT, DELETE as required. Handle loading, success, and error states.
- Implement authentication as specified. Keep secrets in environment variables; never print or commit them.
- **Never invent endpoints.** If none exist, keep mock services and state exactly what remains to integrate.

## Step 7: Test and debug

- Run type check, lint, unit/component tests, and a production build.
- Start the dev server and check for runtime errors.
- Use browser testing when available: test navigation, buttons, form validation, search/filter, CRUD flows, and layouts at mobile (~375px), tablet (~768px), and desktop (~1280px).
- Fix every issue found, then re-run. Report anything that still fails.

## Step 8: Final optimization

- Extract duplicated markup into components; remove unused code and dependencies.
- Improve accessibility (labels, focus, contrast, keyboard use, semantic HTML).
- Optimize performance (code-splitting for routes, memoization only where measured, optimized images).
- Check visual consistency across pages and light/dark themes.
- Re-verify the build.

## Step 9: Deliver the application

Provide:

1. Application overview
2. Technology stack
3. Pages and features implemented
4. Project folder structure
5. Files created
6. Testing results (what was run, what passed, what was not verified)
7. Instructions to run the application
8. Known limitations or pending work (including mock data and anything not integrated)
9. How to change the app later: open the app folder in VS Code and type `/team <request>` in chat

## Rules

- Ask before: installing dependencies, deleting files, overwriting important files, major architecture changes after plan approval, changing env vars/secrets, changing authentication/security configuration, backend changes, committing or pushing.
- Never expose secrets. Never claim a feature works unless it was implemented and tested.
- After the job, save only reusable feedback to `MEMORY.md` (preferences, conventions, mistakes to avoid), not one-off project requirements.
