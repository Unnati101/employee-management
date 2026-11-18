# Reference: existing personal-shopper app (patterns only)

Summary of conventions observed in this repository. Do not copy code. Skip company-specific parts.

## Stack signals
- Next.js 15 (App Router, `src/app`), React 19, TypeScript.
- Tailwind CSS with `tailwindcss-animate`; shadcn/ui configured via `components.json` (aliases `@/components`, `@/lib`, `@/hooks`, `lucide` icons, `rsc: true`).
- `class-variance-authority`, `clsx`, `tailwind-merge` for component variants and class merging.
- `react-hook-form` + `zod` for forms and validation.
- `axios` for HTTP, `date-fns` for dates, `jotai` for client state, `lucide-react` for icons.
- Jest + Testing Library; tests sit next to source files (`*.test.ts(x)`).
- ESLint, Prettier, Husky pre-commit hooks.

## Structure
- `src/app` routes, `src/components`, `src/ui` (layout, pages), `src/hooks`, `src/lib` (utilities, API helpers), `src/context`, `src/types`, `src/constants`, `src/styles`.
- API helpers are centralized in `src/lib` (`api-config`, `api-route-handler`, `api-utils`).

## Theming
- Colors are named tokens in `tailwind.config.js` (`extend.colors`); radius via CSS variable `--radius`; dark mode via the `class` strategy.

## Not to reuse
- private/company packages, monitoring and feature-flag SDKs, auth provider configuration, env files, and brand colors.
