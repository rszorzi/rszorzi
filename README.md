# Reel Skills

Prototype for a Duolingo-style, short-vertical-video microlearning app for
tradeable skills (Excel, bartending flair, prompt writing, etc.).

Demonstrates the core loop: a swipeable vertical feed of 60-90s lesson
"reels", in-feed practice checkpoints, streak/XP tracking, a spaced-repetition
review queue, and a shareable completion credential — all client-side with
mock lesson content and `localStorage` persistence. It's also an installable
PWA, so it can be added to a phone's home screen like a native app.

## Run it locally

```
npm install
npm run dev
```

Open the printed local URL. State persists in the browser's `localStorage`.

## Live site

Pushing to `main` deploys automatically to GitHub Pages via
`.github/workflows/deploy-pages.yml`. Once Pages is enabled in the repo
settings (Settings → Pages → Source: GitHub Actions), it's live at:

https://rszorzi.github.io/rszorzi/

## Install as a mobile app

Open the live site on a phone:

- **Android (Chrome):** tap the in-app "Install Reel Skills" banner, or the
  browser menu → "Add to Home screen".
- **iOS (Safari):** Share button → "Add to Home Screen" (Safari doesn't show
  an automatic install prompt, so this is the way in).

It then opens full-screen from the home screen icon, with no browser chrome.
