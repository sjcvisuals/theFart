# The Daily Fart — Fartle

A daily web game dressed as a British newspaper front page. Each day you are shown an everyday object and asked a single, unreasonable question:

**How many human farts would it take to completely fill this?**

The humour is tabloid, the maths is approximate, and the presses do not stop for dignity.

One average fart is treated as **100 mL / 0.1 litres** of gas. Answers are rounded to sensible whole numbers. This is comedy, not a laboratory.

## Run locally

No build step, no packages, no API key.

1. Clone or download this repository.
2. Open `index.html` in a browser.

Alternatively, from the project folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Project structure

```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── objects.js    # daily objects and fart counts
│   ├── news.js       # parody headlines (API-shaped)
│   └── game.js       # puzzle, guesses, scores, share
├── assets/
│   ├── favicon.svg
│   └── sounds/
│       └── fart.mp3
├── README.md
└── .nojekyll
```

## How the daily puzzle works

There is **one object per calendar day**.

- Objects live in `js/objects.js` (30+ entries).
- The current **local** calendar date selects the object.
- Selection is deterministic: the same date always yields the same object.
- Refreshing the page does **not** pick a new object.
- Puzzle numbering counts days since 1 January 2026.

Completed-game state is stored in `localStorage`. Refreshing does not let you restart today's puzzle. When the calendar date changes, a new edition begins automatically.

You get **five** guesses. After each miss the paper tells you **↑ Higher** or **↓ Lower**, plus how far away you were as a percentage.

## How localStorage works

There is no server. Scores are saved on **this device only**.

| Key | Purpose |
| --- | --- |
| `fartle.v1.game` | Today's guesses, win/loss, whether a name was printed |
| `fartle.v1.scores` | Fart Legends entries (name, guesses, date, object, answer) |
| `fartle.v1.muted` | Mute preference for the win sound |

The scoreboard lists today's best scores on this device, sorted by fewest guesses. It is **not** a global multiplayer leaderboard.

`ScoreRepository` in `js/game.js` is a small async wrapper around `localStorage`. A backend such as Supabase can replace that object later without rewriting the rest of the game.

Parody news lives in `js/news.js` as an array plus `FARTLE_NEWS_API.loadNewsArticles()`. Swap that function to call a real news API when you have one. The game runs with no key.

## Deploy on GitHub Pages

The site is static and uses relative paths, so it works at `https://USERNAME.github.io/REPOSITORY-NAME/`.

1. Push repository to GitHub.
2. Open repository Settings.
3. Open Pages.
4. Choose "Deploy from a branch."
5. Select "main".
6. Select "/root".
7. Save.

In the GitHub UI this folder option is labelled **/(root)** — the repository root, not `/docs`.

GitHub Pages will publish the site after a short wait. The `.nojekyll` file tells Pages not to process the site with Jekyll.
