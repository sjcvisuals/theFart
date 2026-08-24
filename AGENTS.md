# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **fully static, dependency-free web game** ("Fartle" / "The Daily Fart"): plain `index.html`, `css/`, `js/`, and `assets/`. There is **no package manager, no build step, no automated tests, and no linter configuration**. Do not look for `package.json`, a lockfile, or a test runner — none exist.

### Running the app (development)
- Serve the repo root over HTTP; opening `index.html` via `file://` also works but HTTP matches production (GitHub Pages). See `README.md` for the canonical command (`python3 -m http.server 8080`, then visit `http://localhost:8080`). Python 3 is preinstalled.
- There is nothing to "build" or "compile"; edits to HTML/CSS/JS are picked up on browser reload (no hot reload — just refresh).

### Lint / test / build
- No lint, test, or build commands exist. "Verifying" a change means loading the page in a browser and exercising the affected UI.

### Non-obvious gotchas
- **The daily puzzle is deterministic by the browser's LOCAL calendar date.** Object selection is `index = daysSince(2026-01-01) % FARTLE_OBJECTS.length` (see `selectDailyPuzzle` in `js/game.js`). `FARTLE_OBJECTS` currently has 35 entries in `js/objects.js`. To know the answer for a given day, compute that index and read the object's `fartCount`. Example: 2026-08-23 → index 24 → "Garden shed" → answer `90000`.
- **The VM/browser here runs in UTC**, so "today" follows UTC. A test recorded on one date will show a different object than the code comments might suggest — this is expected, not a bug.
- **Game state persists in `localStorage`** (keys `fartle.v1.game`, `fartle.v1.scores`, `fartle.v1.muted`). Once today's puzzle is won/lost it cannot be replayed on the same browser profile. To re-test the play flow, use an incognito window / fresh profile or clear `localStorage` for the origin.
- The leaderboard ("Fart Legends") is device-local only (not a server); news and scores are client-side stubs designed to be swapped for a real backend later.
