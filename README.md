# Vibes Intelligence Platform (VIP) v4.2.1

> Enterprise-grade productivity analytics powered by vibes.

## What is this

A rigorously scientific dashboard that measures your Focus Score, Spirit Animal alignment, lunar-adjusted caffeine requirements, and cumulative meeting damage — all in real time.

All metrics are completely made up. This is non-negotiable.

## Features

- **Spirit Animal Detection** — Proprietary biometric archetype engine assigns you a spirit animal every 3 hours using a deterministic algorithm that definitely isn't just hashing the current time. Confidence scores are high. Always.

- **Focus Score** — A number between 0 and 100 that drifts randomly every 2 seconds. Displayed on a gauge for gravitas. Includes a sparkline so it looks like we've been collecting data for a while.

- **Optimal Coffee Intake** — Calculated from your Focus Score, the lunar coefficient (real astronomy, fake application), and hours elapsed since 9am. Updates live. Do not question it.

- **Vibe Forecast** — Hourly weather-style productivity outlook for the rest of your day. Generated once on page load and never updated, because vibes are stable systems.

- **Meeting Toxicity Index** — Increments by 1.73 every 60 seconds whether or not you are in a meeting. Includes a "Touch Grass" button that resets the counter and triggers cortisol normalization.

- **ARIA Vibe Assessment** — Click "Analyze My Vibe" to receive a Quarterly Vibe Assessment from ARIA (Automated Readiness and Intelligence Assessment), a deadpan enterprise AI that has reviewed your metrics and has thoughts. Powered by Claude. Takes the whole thing very seriously.

## Tech stack

- React + Vite
- Tailwind CSS
- Recharts (for the sparkline that makes the random numbers look meaningful)
- Anthropic API (claude-sonnet-4-20250514)
- The moon

## Getting started

### 1. Install Node.js (if you don't have it)

`npm` comes bundled with Node.js. To check if you already have it, open a terminal and run:

```bash
node --version
npm --version
```

If you see version numbers, you're good. If you get a "command not found" error, install Node.js first:

- **Mac:** Download the installer from [nodejs.org](https://nodejs.org) and run it. Choose the "LTS" version.
- **Windows:** Same — download the Windows installer from [nodejs.org](https://nodejs.org), run it, and restart your terminal afterward.
- **Linux:** Use your package manager, e.g. `sudo apt install nodejs npm` on Ubuntu/Debian.

After installing, close and reopen your terminal, then re-run the version checks above to confirm it worked.

### 2. Get an Anthropic API key

The ARIA Vibe Assessment feature requires an API key from Anthropic. If you don't have one:

1. Go to [console.anthropic.com](https://console.anthropic.com) and create a free account.
2. Navigate to **API Keys** and create a new key.
3. Copy the key — it starts with `sk-ant-...`.

### 3. Set the API key in your environment

You need to make the key available as an environment variable called `ANTHROPIC_API_KEY`. Do this **before** running the app.

- **Mac/Linux** (in the same terminal session you'll use to start the app):
  ```bash
  export ANTHROPIC_API_KEY=sk-ant-your-key-here
  ```
- **Windows (Command Prompt):**
  ```cmd
  set ANTHROPIC_API_KEY=sk-ant-your-key-here
  ```
- **Windows (PowerShell):**
  ```powershell
  $env:ANTHROPIC_API_KEY="sk-ant-your-key-here"
  ```

Replace `sk-ant-your-key-here` with your actual key. You'll need to do this each time you open a new terminal, unless you add it to your shell profile.

### 4. Install dependencies and run the app

In the same terminal, navigate into the project folder and start the app:

```bash
cd vibes-dashboard
npm install
npm run dev
```

`npm install` downloads the project's dependencies and only needs to be run once (or after pulling new changes). `npm run dev` starts the local development server.

Once it's running, open your browser and go to **http://localhost:5173**. Your vibes await.

## FAQ

**Is any of this real?**
The React is real. The Tailwind is real. The moon is real.

**What does the lunar coefficient actually measure?**
The sine of the current day of year mapped to a 29.53-day lunar cycle, scaled to a range of 0.41–1.23. It affects your coffee recommendation by up to ±0.51 cups. You're welcome.

**Why does my Focus Score keep changing?**
Cognitive throughput is a dynamic system. Also it's `Math.random()`.

**My spirit animal is a Blobfish.**
The algorithm is working as intended.

**Can I use this for actual productivity tracking?**
No.
