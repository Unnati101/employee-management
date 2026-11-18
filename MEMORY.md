Only save feedback that applies to future jobs, not one-off edits.

## Preferences

- Generated apps go directly in `C:\Users\unnati-rastogi\Downloads\<app-name>\`, never inside another app or repo.
- The user is not very technical: explain terms simply the first time and run setup/dev commands on their behalf.
- Design style is premium/elegant: propose palette and fonts and get approval before building.
- Get approval for the plan, stack, and library list before installing anything.

## Lessons

- Run type check, lint, tests, and a production build before reporting; state honestly what was not verified.
- Label mock data in code, README, and the final report.
- Start a new app's dev/start server with `npm --prefix <app folder> run ...`; a bare `cd` can be dropped and launch the wrong app.
- Test with the browser, not just unit tests: a real run caught a bug (ASAP orders shown as "Scheduled for Invalid Date") that tests missed.
- Multi-language: ask which languages and how much to translate first. A typed English dictionary, other languages typed against it, plus a test that checks keys and placeholders match, catches missing translations.
