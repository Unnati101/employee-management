# Aurelia HR: Employee Management

Premium, responsive employee management app built with React, Vite, TypeScript, and Tailwind CSS.

## Run

```
npm install
npm run dev
```

Open http://localhost:5173 and use "Fill demo account" (admin@aurelia.example / Admin@123), or register a new account.

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: type-check and build for production
- `npm test`: run unit and component tests
- `npm run lint`: run ESLint

## Project layout

- `src/`: the app (features, UI components, services, mock data, tests)
- `CLAUDE.md`, `MEMORY.md`: instructions and preferences for the AI build agent
- `.claude/skills/`, `.github/prompts/`: build workflows (`frontend-builder`, `frontend-agent`)
- `agent-kit/`: team template (agents and `team` skill) copied into every new app
- `examples/`: reference notes

## Deploy to Vercel (planned)

Import the repository in Vercel. Framework preset: Vite, build command `npm run build`, output directory `dist`. Because the app uses client-side routing, add a `vercel.json` rewrite of all paths to `/index.html` before going live.

## Mock data

There is no backend. Employees and accounts are mock data stored in the browser's localStorage (`src/services`, seed data in `src/data`). Authentication is a demo only and is not secure. Replace the service functions with real API calls to go live.
