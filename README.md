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
│   ├── ads.js        # side/bottom ad wells (AdSense optional)
│   └── game.js       # puzzle, guesses, scores, share
├── assets/
│   ├── favicon.svg
│   └── sounds/
│       └── fart.mp3
├── privacy.html
├── README.md
├── CNAME
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

## Point www.fartdaily.com at GitHub Pages

GitHub Pages is free. The `CNAME` file in this repo is `www.fartdaily.com`.

GoDaddy already has the `www` CNAME pointing at `sjcvisuals.github.io`. After this file is on `main`, finish the link in GitHub:

1. Open https://github.com/sjcvisuals/theFart/settings/pages
2. Under **Custom domain**, type `www.fartdaily.com` and click **Save** (skip if GitHub already picked it up from the `CNAME` file).
3. When the DNS check is green, tick **Enforce HTTPS**.

To make the bare name `fartdaily.com` also work, in GoDaddy → **DNS** → **DNS Records**, delete the parked `A` records on `@` (`76.223.105.230` and `13.248.243.5`) and add four GitHub `A` records:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |

Leave the existing `www` CNAME (`www` → `sjcvisuals.github.io`) as it is.

The domain costs a yearly GoDaddy renewal. Hosting stays free. The game will sit at `https://www.fartdaily.com/` with no `/theFart/` suffix.

## Advertising

The left column, right column, and a strip above the classifieds carry labelled **Advertisement** wells. They never sit on top of the puzzle.

Until you plug in a network, those wells show house ads (“this space to let”). That is enough to sell a square directly. Tiny automated revenue usually means [Google AdSense](https://www.google.com/adsense/) once the site has a custom domain and a privacy page (`privacy.html` is included).

1. Apply at AdSense with `https://www.fartdaily.com`.
2. When you have a publisher id (`ca-pub-…`) and three display units, paste them into `js/ads.js`:

```js
adsenseClient: "ca-pub-XXXXXXXXXXXXXXXX",
slots: {
  left: "1234567890",
  right: "1234567890",
  bottom: "1234567890"
}
```

3. Put a matching line in `ads.txt` at the site root:

```text
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

GitHub Pages is meant for project sites, not a shop. Donation / pint links are explicitly allowed. A couple of quiet display units on a hobby game is common; if the paper ever becomes a real business, move it off Pages.

A Ko-fi (or similar) URL in `supportUrl` turns the right-hand well into a tip jar without AdSense. `advertiseUrl` (a `mailto:` or a form) turns the other wells into a direct “buy this square” button.
