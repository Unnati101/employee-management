---
name: frontend-agent
description: Work on an existing frontend application: modify or add components, fix bugs, integrate real APIs, and make targeted improvements. Use when the user points at an existing app or says fix, change, update, add to, refactor, connect to an API, or debug. Not for building a new app from scratch (use frontend-builder).
argument-hint: Describe the change, bug, or API to integrate (and the app folder if not obvious)
---

# frontend-agent

Before starting: read `CLAUDE.md` and `MEMORY.md`. Explain technical terms in simple language the first time they appear. The existing app's conventions win over the new-app defaults in `CLAUDE.md`.

## Step 1: Find the app and learn its conventions

- Identify the app folder (ask one short question only if it is truly ambiguous). Never touch `employee-management` unless it is the target.
- Read `package.json`, the framework config, the folder layout, and 2-3 similar existing files.
- Match the existing styling, component, state, form, and test patterns. Do not introduce a new library or pattern without approval.

## Step 2: Classify the task

- **Bug fix**, **component change**, **API integration**, or **refactor**. If it spans several, do them in that order of risk (bug first).
- State in one or two sentences what will change and what will not. For anything touching many files, auth, or architecture, present the plan and wait for approval.

## Step 3: Do the work

**Bug fixes**
- Reproduce first (run the app, a test, or the browser). If it cannot be reproduced, say so.
- Find the root cause, not a symptom. Make the smallest fix.
- Add a regression test that fails before the fix and passes after.

**Component changes**
- Find every usage before changing props or behavior. Keep existing callers working, or update all of them.
- Preserve accessibility (labels, focus, keyboard), responsive layout, and design tokens. Extract a shared component on the second use of the same markup.

**API integration**
- Read the API docs or spec fully. **Never invent endpoints, fields, or auth flows.** If they are missing, stop and ask.
- Put calls in the app's service layer with typed request/response models. Validate responses at the boundary (for example with `zod`).
- Handle loading, success, empty, and error states in the UI.
- Keep secrets in environment variables and `.env.example` placeholders. Never print or commit secrets.
- Keep mock data only if the user asks, and say exactly what is still mocked.

## Step 4: Verify

- Run the app's type check, lint, tests, and production build. Start the server with `npm --prefix <app folder> run <script>` so the right app runs.
- Check the change in a browser when available, including mobile (~375px) and desktop widths for UI changes.
- Fix what breaks. Report anything that still fails or was not verified.

## Step 5: Report

1. What was wrong or requested, and the root cause (for bugs)
2. What changed and why, with links to the files
3. Verification: what was run, what passed, what was not verified
4. Known limitations, follow-ups, and anything still mocked

## Rules

- Smallest diff that solves the problem. No unrelated refactors, renames, or formatting churn. No dead code or commented-out blocks.
- Ask before: installing or removing dependencies, deleting files, overwriting important files, changing env vars/secrets, changing auth or security configuration, backend changes, committing or pushing.
- Never claim something works unless it was run. Report failures honestly.
- After the job, save only reusable feedback to `MEMORY.md`, not one-off details.
