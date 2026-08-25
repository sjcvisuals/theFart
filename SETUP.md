# Manual setup: ads and the global board

The site code is ready. Google will not let this repo create your AdSense or Firebase accounts, so you do these clicks once. Hosting on GitHub Pages stays free. Firebase and AdSense have free tiers that are enough for a small daily game.

Do **Firebase first** (leaderboard). Do **AdSense second** (banners). AdSense often takes days to approve.

---

## Part A — Global leaderboard (Firebase + Google sign-in)

### A1. Create the Firebase project

1. Open [https://console.firebase.google.com](https://console.firebase.google.com) while logged into the Google account you want as owner.
2. **Add project** (or **Create a project**).
3. Name it e.g. `the-daily-fart`.
4. Google Analytics: optional. **Disable** if you want fewer cookies. Continue.
5. Wait for the project to be created, then **Continue**.

### A2. Add a web app

1. On the project overview, click the **web** icon `</>`.
2. App nickname: `Daily Fart`.
3. **Do not** tick Firebase Hosting (you already use GitHub Pages).
4. **Register app**.
5. Copy the `firebaseConfig` object (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
6. Open `js/firebase-config.js` in this repo and paste those values into `window.FARTLE_FIREBASE`.
7. Commit and push to `main` (or merge the PR that contains your paste).

### A3. Turn on Google sign-in

1. Left menu: **Build** → **Authentication**.
2. **Get started**.
3. **Sign-in method** → **Google** → **Enable**.
4. Project support email: pick your address → **Save**.
5. Open the **Settings** tab (Authentication) → **Authorized domains**.
6. **Add domain** for each of:
   - `www.fartdaily.com`
   - `fartdaily.com`
   - `sjcvisuals.github.io`
   - `localhost` (usually already there, for local testing)

### A4. Create the database

1. Left menu: **Build** → **Firestore Database**.
2. **Create database**.
3. Start in **production mode**.
4. Location: pick one close to readers (e.g. `europe-west2` London) → **Enable**.

### A5. Paste the security rules

1. Still in Firestore, open the **Rules** tab.
2. Replace everything with the contents of `firestore.rules` from this repo.
3. **Publish**.

That stops other people writing to your row. Anyone can still *read* display names and scores (that is the public board).

### A6. Check it

1. Visit `https://www.fartdaily.com`.
2. **Sign in with Google** in the masthead.
3. Finish today's Fartle.
4. Your name should appear on **Today** and **All time**.

If the browser console says `auth/unauthorized-domain`, you missed a domain in A3. If it says `permission-denied`, the rules in A5 were not published.

---

## Part B — Banner ads (Google AdSense)

This is the best fit for the three newspaper wells: it pays per view/click, stays off the puzzle, and can earn a little even with modest traffic. You cannot skip Google's approval. The paper only needs your **publisher id** (`ca-pub-…`). Slot ids are optional.

### B1. Apply

1. Open [https://www.google.com/adsense](https://www.google.com/adsense) with the same Google account (or a payments account you control).
2. **Get started**.
3. Website: `https://www.fartdaily.com`
4. Country / payments profile: yours.
5. Accept the AdSense terms.

### B2. Paste the publisher id

1. In AdSense: **Account** → **Account information**. Copy `ca-pub-` plus the digits.
2. Open `js/adsense-config.js` and set `client: "ca-pub-…"`.
3. Add a root file named `ads.txt` containing exactly one line (use `pub-` without `ca-`):

```text
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

4. Commit and push. Confirm `https://www.fartdaily.com/js/adsense-config.js` shows your id, and (if you added it) `https://www.fartdaily.com/ads.txt` shows that line.
5. In AdSense → **Sites**, add `www.fartdaily.com` if it is not already there, then **Verify**.

Do not ship a comment-only `ads.txt`. An empty ads.txt tells buyers that nobody is allowed to sell ads.

### B3. Wait for approval

This can take **a few days**. House ads (“this space to let”) stay visible until a unit fills. A brand-new fart-joke site can be refused; if that happens, put a Ko-fi URL in `supportUrl` inside `js/ads.js` so the right-hand well still takes tips.

### B4. Auto ads (keep them off the puzzle)

After the site is Ready:

1. AdSense → **Ads** → your site.
2. You can leave **Auto ads** on so Google fills the three wells.
3. Turn **Overlay formats** off (anchor / vignette). Those sit on top of the puzzle.
4. If an in-page Auto ad lands on the Fartle column, use **Excluded areas** and paint out the puzzle.

The paper also hides Auto ads that inject inside the Fartle column.

### B5. Optional: three display units

For tighter reporting, **Ads** → **By ad unit** → **Display ads**, create `Fart-left`, `Fart-right`, `Fart-bottom` (Responsive), and paste the unit ids into `slots` in `js/adsense-config.js`.

### B6. UK / Europe consent

In AdSense → **Privacy & messaging**, turn on Google's European regulations message (CMP) for `fartdaily.com`. Without it, ads in the UK may be limited or blank.

### B7. Payments

In AdSense → **Payments**, add a bank or address. Google pays after you pass the payment threshold (often around $100). Until then, earnings just accumulate.

---

## What you do *not* need

- No paid hosting.
- No Supabase.
- No Apple sign-in (Google covers the board).
- Do not put a `CNAME` for any domain other than `www.fartdaily.com`.
