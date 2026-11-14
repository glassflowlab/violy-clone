# Violy Practice — 1:1 MVP Clone

A focused Web App clone of [violy.app](https://violy.app) — the music practice space
that listens as you play and reports pitch / rhythm accuracy at the end of every piece.

Built as an MVP demonstrating the **core practice loop**: pick a piece → follow the
score → play along → get a real-time pitch meter + final scoring.

## Tech

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** with Violy brand tokens (`violy-500: #2f7ff5`, `violy-yellow: #ffd96a`, `violy-ink: #173456`, …)
- **OpenSheetMusicDisplay 1.8** for MusicXML rendering
- **pitchy 4.1** (YIN-style pitch detector) + **Web Audio API** for real microphone capture
- **No external score assets** — three public-domain melodies are embedded as MusicXML

## Pages

| Route                    | What it does                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `/`                      | Hero / feature grid matching violy.app                                                                        |
| `/library`               | Card grid of available pieces with level, BPM, length                                                        |
| `/practice/[pieceId]`    | OSMD-rendered sheet + live pitch meter + cents offset bar + loudness sparkline + Start / Stop audition button |
| `/result`                | Pitch + Rhythm + Duration score cards, pitch curve SVG, full note-by-note breakdown table                    |
| `/about`                 | How the YIN / pitchy pipeline actually works                                                                 |
| `/history`               | Placeholder for persistent history                                                                            |
| `/dev/seed-result`       | Dev-only helper that injects a fake audition result into sessionStorage so the Result page can be inspected without a microphone |

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

A production build:

```bash
npm run build
npm start
```

## How the audio pipeline works

1. The Practice page calls `getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })`
2. Audio frames (2048 samples @ 44.1–48 kHz) are pushed through a `ScriptProcessor` into `pitchy`'s `PitchDetector.findPitch`
3. Every frame, `pitchy` returns `{ frequency, clarity }`. We accept the pitch when clarity ≥ 0.9 and RMS ≥ 0.01 (loudness gate)
4. The engine tracks the current expected note by walking the parsed MusicXML timeline
5. On audition end (or "Stop"), every expected note is matched against the closest detected frame inside a 500 ms onset window. Per-note score blends pitch accuracy (70 %) and timing accuracy (30 %) within ±50 ¢ / ±300 ms tolerance windows
6. The whole result is serialized to `sessionStorage` and the page navigates to `/result`

## What's intentionally out of scope (per the MVP brief)

- Live video lessons, teacher classroom, accompaniment tracks
- Score uploads, account / sync, persistent history
- Multi-voice MusicXML (parser collapses to voice 1)
- Mobile-app shell features (push, native sharing, App Store / Play Store packaging)

## Files worth reading

- `src/lib/audio/pitch.ts` — Web Audio + pitchy pipeline
- `src/lib/audio/scoring.ts` — score-following + scoring React hook
- `src/lib/score/parser.ts` — focused MusicXML → `ScoreNote[]` parser (handles notes, rests, tempo, divisions, depth-aware block extraction)
- `src/lib/score/library.ts` — embedded Twinkle Twinkle, Ode to Joy, Mary Had a Little Lamb
- `src/app/practice/[pieceId]/page.tsx` — main practice UI
- `src/app/result/page.tsx` — score + pitch curve + per-note breakdown
