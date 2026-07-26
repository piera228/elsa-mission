@AGENTS.md

# E.L.S.A.

An illustrated showcase arguing that crewed deep-space missions are where voice AI stops being
convenient and becomes critical. Built on ElevenLabs. Intended audience: ElevenLabs leadership.

**It is a use-case showcase, not a story.** There is no fiction, no named characters, no narrative
acts. Earlier drafts had all three; they were deliberately removed. Do not reintroduce them.

## Stack

Next.js 16.2 (App Router, Turbopack default), React 19.2, Tailwind v4 (CSS-first `@theme`),
`motion` v12, Node 24. `/` prerenders static.

Next 16 gotchas already accounted for: async request APIs are mandatory, `opengraph-image` receives
`params`/`id` as promises, Turbopack is the default for both dev and build.

## Where things live

| Path | Role |
| --- | --- |
| `src/lib/content.ts` | **All copy.** The writing is the product; edit it here, never in components. |
| `src/lib/site.ts` | Identity + `MISSION` figures. Single source of truth for standalone numbers. |
| `src/lib/scenes.ts` | Scene manifest and the full art specification. |
| `src/lib/elevenlabs.ts` | Server adapter. Verified model ids, per-register voice settings. |
| `src/lib/use-elsa-voice.ts` | The one voice hook. Audio mode + silent fallback. |
| `src/components/novel/` | Cover, `Scene`, section chrome, `ElsaLine`. |
| `src/components/sections/` | One file per page section; interactives are the `"use client"` ones. |
| `src/components/scenes/Placeholders.tsx` | Coded SVG stand-ins for unsupplied art. |

## Invariants — do not break these

**1. The warm/cold palette carries the argument.** Amber (`--color-elsa`) is *only ever* E.L.S.A.'s
voice. Cold blue (`--color-telemetry`) is instrumentation and data. Never use amber for a chart axis,
a border, or a generic accent. `--color-alert` appears in exactly one place, scene 05.

**2. Serif is her voice; sans is narration; mono is telemetry.** `spoken` / `font-display` for
anything she says. Never set her words in sans.

**3. E.L.S.A. is never depicted.** No face, avatar, mascot or character render. Light and sound only.
A voice-first argument weakens the moment it has a screen presence.

**4. Content must be visible without JavaScript.** Scroll reveals are CSS (`.reveal` +
`animation-timeline: view()`) and additive only. Never gate content behind `opacity: 0` restored by a
JS observer — that was a real bug that blanked everything below the fold.

**5. Voice surfaces must not branch on credential availability.** Call `speak()` from
`useElsaVoice`. The 503 `{ configured: false }` path is designed behaviour, not an error.

**6. Numbers come from `MISSION`.** Standalone figures import from `src/lib/site.ts`. Prose keeps
written-out numbers, but if you change a figure, change it in both — a byte count once disagreed
with its own live calculation.

## Adding illustrations

Drop a file in `public/scenes/` named `NN-slug.webp` and rebuild. `Scene` resolves it via
`fs.existsSync` at build time and the placeholder disappears. Layered parallax uses
`-bg` / `-mid` / `-fg` suffixes. See `src/lib/scenes.ts` for the rim-light rule and palette lock —
`01-cockpit.png` is the supplied style reference all other scenes must match.

## Verifying visual work

Headless Chrome **silently ignores `--window-size`** (it reported `innerWidth: 500` for
`--window-size=390`), which produces cropped screenshots that look like layout bugs. Drive it over
the DevTools protocol with `Emulation.setDeviceMetricsOverride` instead. Check 390 / 768 / 1440 /
2560 px and assert `document.documentElement.scrollWidth <= window.innerWidth`.

Scroll-driven reveals will not have fired in a short-lived headless capture; scroll to the section
and wait before screenshotting.

## Before shipping

`npm run lint && npx tsc --noEmit && npm run build`. The `author`/`email`/`github`/`url` fields in
`src/lib/site.ts` are placeholders and must be filled in.
