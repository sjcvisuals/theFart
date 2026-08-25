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

This is the best fit for the three newspaper wells: it pays per view/click, stays off the puzzle, and can earn a little even with modest traffic. You cannot skip Google's approval.

### B1. Apply

1. Open [https://www.google.com/adsense](https://www.google.com/adsense) with the same Google account (or a payments account you control).
2. **Get started**.
3. Website: `https://www.fartdaily.com`
4. Country / payments profile: yours.
5. Accept the AdSense terms.

### B2. Site verification

AdSense will show either a **meta tag** or ask you to add an **ads.txt** line.

**If they give a meta tag** (`<meta name="google-adsense-account" content="ca-pub-…">`):

1. Open `index.html`.
2. Paste that tag inside `<head>`, under the description meta.
3. Commit, push, wait a few minutes, then click **Verify** in AdSense.

**If they give an ads.txt line** (`google.com, pub-XXXX, DIRECT, f08c47fec0942fa0`):

1. Open `ads.txt` in this repo.
2. Uncomment / replace the sample line with the exact line Google shows.
3. Commit and push.
4. Check `https://www.fartdaily.com/ads.txt` in a browser. It must show that line.
5. Click **Verify** in AdSense.

### B3. Wait for approval

This can take **a few days**. The house ads (“this space to let”) stay up until then. A brand-new fart-joke site can be refused; if that happens, put a Ko-fi URL in `supportUrl` inside `js/ads.js` so the right-hand well still takes tips.

### B4. Create three display units

After approval, in AdSense:

1. **Ads** → **By ad unit** → **Display ads**.
2. Create three units, names e.g. `Fart-left`, `Fart-right`, `Fart-bottom`.
3. Size: **Responsive**.
4. Copy each **Ad unit ID** (a long number) and your **publisher ID** (`ca-pub-…` from **Account** → **Account information**).

### B5. Paste into the paper

Open `js/ads.js` and set:

```js
adsenseClient: "ca-pub-XXXXXXXXXXXXXXXX",
slots: {
  left: "1111111111",
  right: "2222222222",
  bottom: "3333333333"
}
```

Use the real ids. Commit and push. Reload `www.fartdaily.com`. The three wells should fill with Google ads after a few minutes.

### B6. Payments

In AdSense → **Payments**, add a bank or address. Google pays after you pass the payment threshold (often around $100). Until then, earnings just accumulate.

---

## What you do *not* need

- No paid hosting.
- No Supabase.
- No Apple sign-in (Google covers the board).
- Do not put a `CNAME` for any domain other than `www.fartdaily.com`.
