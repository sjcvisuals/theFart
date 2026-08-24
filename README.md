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
│   ├── news.js       # Onion feed + classifieds
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
- Object photographs are fetched from Wikipedia/Wikimedia Commons and shown in black-and-white newsprint.

The masthead weather chip is London, via Open-Meteo (no API key): icon plus temperature in °C.

Completed-game state is stored in `localStorage`. Refreshing does not let you restart today's puzzle. When the calendar date changes, a new edition begins automatically.

You get **five** guesses. After each miss the paper tells you **higher** or **lower**. Arrow weight shows how near you are:

- ↗ / ↘ closer
- ↑ / ↓ on the way
- ⇧ / ⇩ further out

## How localStorage works

There is no server. Scores are saved on **this device only**.

| Key | Purpose |
| --- | --- |
| `fartle.v1.game` | Today's guesses, win/loss, whether a name was printed |
| `fartle.v1.scores` | Fart Legends entries (name, guesses, date, object, answer) |
| `fartle.v1.muted` | Mute preference for the win sound |
| `fartle.v1.photos` | Cached Wikipedia thumbnail URL for today's object |
| `fartle.v2.onion` | Cached Onion headlines for today's date |

The scoreboard lists today's best scores on this device, sorted by fewest guesses. It is **not** a global multiplayer leaderboard.

`ScoreRepository` in `js/game.js` is a small async wrapper around `localStorage`. A backend such as Supabase can replace that object later without rewriting the rest of the game.

Parody news is fetched live from [The Onion](https://theonion.com/) RSS feed. A date-based picker chooses about ten headlines for the day so the paper changes with the puzzle, not on every refresh. Most sit in the left and right columns; a couple continue under the puzzle so the game is framed on three sides. Each Onion headline links to the original article. Original Daily Fart “home news” and “in brief” items pad the sides, with two more under the game. If the Onion feed cannot be reached, those local briefs still fill the page and the Onion columns point readers to theonion.com.

There is a small **Reset puzzle** control in the masthead for testing. It clears today’s guesses (and today’s local Fart Legends entries) on this device and reloads the page. Set `SHOW_TEST_RESET` to `false` in `js/game.js` before a public launch if you do not want it.

The game runs with no API key. A public RSS-to-JSON helper is used so the browser can read The Onion feed.

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

## Point www.dailyfart.com at GitHub Pages later

GitHub Pages is free. This repo is already a static site (`index.html` plus CSS, JS, and assets), so you do not need a paid host or a server.

Do **not** add a `CNAME` file until the domain’s DNS already points at GitHub. A `CNAME` in the repo makes Pages redirect `sjcvisuals.github.io/theFart/` to `www.dailyfart.com`. If DNS is not ready, the live game disappears.

When you are ready:

1. At your domain registrar, add DNS first:

   | Type | Name | Value |
   | --- | --- | --- |
   | `CNAME` | `www` | `sjcvisuals.github.io` |
   | `A` | `@` (apex) | `185.199.108.153` |
   | `A` | `@` | `185.199.109.153` |
   | `A` | `@` | `185.199.110.153` |
   | `A` | `@` | `185.199.111.153` |

2. Wait until `www.dailyfart.com` resolves to GitHub (minutes to a few hours).
3. Add a `CNAME` file in the repo root containing only `www.dailyfart.com`, or set that custom domain under Settings → Pages.
4. Tick **Enforce HTTPS** once GitHub has issued the certificate.

The domain name itself still costs a few pounds a year at the registrar. Hosting stays free. Relative paths mean the game will sit at `https://www.dailyfart.com/` with no `/theFart/` suffix.
