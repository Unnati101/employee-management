---
description: Modify components, fix bugs, or integrate APIs in an existing frontend app
argument-hint: Describe the change, bug, or API to integrate
agent: agent
---

Read `CLAUDE.md` and `MEMORY.md`, then follow `.claude/skills/frontend-agent/SKILL.md` step by step for this task on an existing application:

${input:task:Describe the change, bug, or API to integrate (and the app folder if not obvious)}

Match the app's existing conventions, make the smallest change that solves the problem, and verify it (type check, lint, tests, build, browser) before reporting.
