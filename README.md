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

```bash
cd vibes-dashboard
npm install
npm run dev
```

Set your `ANTHROPIC_API_KEY` in the environment before clicking "Analyze My Vibe," or ARIA will be unavailable and your vibes will go unassessed.

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
