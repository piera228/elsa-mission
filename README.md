# E.L.S.A.

**E.L.S.A. to Earth — The Human Voice From Home**

A concept for the onboard voice of a crewed deep-space mission, and the case that space is where
voice AI stops being convenient and becomes critical.

Built on ElevenLabs.

---

## The argument

Most voice AI is positioned as convenience — a faster way to do something we could already do. That
framing measures the technology against interfaces that work. The interesting case is the one where
nothing else works at all.

Past lunar orbit, four constraints hold simultaneously:

| Constraint | Figure | Why it rules out every other interface |
| --- | --- | --- |
| No hands available | **4.3 psi** | A pressurised EVA glove spends grip strength just closing the fingers. No capacitive screen works through one. |
| No attention to spare | **0 spare glances** | During a burn or a jammed drill, a display can only inform someone willing to look away from the task. |
| No one to ask | **2h 53m** | Light takes 66–86 min to reach Saturn. Mission Control cannot be in the loop. |
| No one else to talk to | **7 years** | NASA lists isolation and confinement alongside radiation as a primary spaceflight hazard. |

Three are engineering problems. The fourth is human. A voice that arrives in milliseconds, sounds
like a person, and knows which register the moment calls for answers all four.

## Three use cases, three shipping models

1. **Delivery as a safety parameter** — `eleven_v3`. The same eleven-word pressure warning delivered
   four ways. Only one is correct, and the reason is engineering: urgency that induces panic costs
   the crew the fine motor control the checklist needs. Audio tags make prosody *specifiable*, so it
   can be reviewed, tested and signed off.
2. **A voice from home at a few hundred bytes** — `eleven_ttv_v3`. Enrol the voice once pre-launch
   and it flies with the vehicle. A message then costs 251 bytes of text instead of ~400 KB of
   streamed audio — roughly 1,600× less link budget for an identical result.
3. **Presence at conversational latency** — `eleven_flash_v2_5` + `scribe_v2_realtime`. Below about a
   second, people stop addressing a system and start talking to someone.

The full requirement-to-model map is in the *Stack* section of the site.

## Architecture

The onboard loop, which never touches Earth:

```
hear                     reason                    speak
scribe_v2_realtime  →    onboard inference    →    eleven_flash_v2_5
~150 ms                  ~400 ms                   ~75 ms
```

Total ≈ **0.8 s**, against **10,380 s** for the same exchange via Mission Control — about
**13,000× faster**. That ratio is the entire argument for putting the voice on the vehicle.

Two of those three stages ship today. The middle one — reasoning onboard, with no link home — is
the open problem, and the site says so rather than implying otherwise. The live demo on the site
does *not* run this loop: it is an ElevenAgents agent over WebRTC (Gemini 2.5 Flash for reasoning,
`eleven_v3_conversational` for voice, expressive mode on by default), reaching a data centre like
anything else.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build; / prerenders as static
npm run lint
npx tsc --noEmit
```

Next.js 16.2 (App Router, Turbopack), React 19.2, Tailwind v4, `motion` v12. Node 20.9+.

## Two deliberate design decisions

Both exist so the site is **complete and shippable before its dependencies are**.

### 1. Voice degrades instead of breaking

Every voice surface calls one hook, [`useElsaVoice`](src/lib/use-elsa-voice.ts), which calls one
route, [`/api/speak`](src/app/api/speak/route.ts).

- **With credentials** — the route streams MP3 from ElevenLabs. Playback position drives the
  word-by-word transcript reveal, and a Web Audio `AnalyserNode` drives the waveform from the real
  voice.
- **Without credentials** — the route returns `503 { configured: false }`. The hook treats that as a
  designed path, not an error: it paces playback from the word count at 150 wpm and synthesises a
  speech-shaped amplitude envelope. Every reveal, orb and progress bar behaves exactly as it will
  with audio, and a quiet note explains that no voice is connected.

Components never branch on availability. They call `speak()`. Adding a key changes no component
code.

### 2. Illustrations resolve off the filesystem

[`Scene`](src/components/novel/Scene.tsx) is a server component that checks `public/scenes/` with
`fs.existsSync` at build time. Art present → `next/image` with scroll parallax. Art absent → a coded
SVG placeholder carrying the brief for that scene.

**Dropping a file into `public/scenes/` activates it on the next build. No code change.**

Scenes ship flat (`04-message-home.webp`) or layered for parallax (`-bg` / `-mid` / `-fg`); `Scene`
detects which is present. Depths, focal points and alt text live in
[`src/lib/scenes.ts`](src/lib/scenes.ts), which also carries the full art spec.

## Art direction

`public/scenes/01-cockpit.png` is supplied and is the **style reference** for every other scene.

**The rim-light rule — non-negotiable.** Interiors and crew are lit from exactly two directions:
warm amber `#FFB067` from E.L.S.A.'s console, cool blue `#6E9BD8` from the window. Amber light is
*always* her; nothing else in any frame is ever amber. The palette carries the argument — a warm
voice inside a cold vacuum, stated in hex.

E.L.S.A. is never depicted. No face, no avatar, no character render — she is light and sound only. A
voice-first argument gets weaker the moment you give it a screen presence.

Remaining scenes, in priority order:

| # | Slug | Notes |
| --- | --- | --- |
| 06 | `06-earth-return` | **Must reuse scene 01's exact window geometry and seat positions** at 16:9, Earth ahead instead of Saturn. The bookend only works if the frame is recognisably identical. |
| 04 | `04-message-home` | Cupola, one figure with a tablet, a child's drawing taped to the bulkhead. |
| 05 | `05-airlock` | The only scene permitted to use `#FF5F52`; its impact depends on being the one red frame. |
| 02 | `02-ship-vs-saturn` | Exterior wide, ship almost too small to find, Earth a pale dot in the rings. |
| 03 | `03-night-console` | Interior at ship's night, one figure at a console lit amber. |

Deliver at ≥ 2560 px wide, WebP, silhouette-forward. Match the cover's grain and contrast.

## Accessibility and performance

- `/` prerenders as **static**. The cover is statically imported so Next derives dimensions,
  generates a blur placeholder, and preloads it as the LCP element.
- Scroll reveals are **CSS only** (`animation-timeline: view()`). Content is visible by default and
  the animation is purely additive — a browser without support, or a failed script, still shows a
  complete page. An earlier JS version set `opacity: 0` and restored it from an intersection
  observer, which meant a broken script blanked everything below the fold.
- `prefers-reduced-motion` disables the cinematic intro, parallax, starfield twinkle, orb breathing
  and all reveals.
- Verified with no horizontal overflow at 390 / 768 / 1440 / 2560 px.
- Cover art is 1672 × 941 (16:9, ~1.6 MP). At 16:9 the hero fills the viewport with under 5%
  horizontal crop at 1440 px and effectively none at 1920 px and above. It still upscales on retina
  displays — a grain overlay masks the softness, and re-rendering at ≥ 2560 px wide would be the
  single biggest remaining visual improvement.

## Before deploying

1. Fill in `author`, `email`, `github` and `url` in [`src/lib/site.ts`](src/lib/site.ts) — they are
   placeholders.
2. Optionally add `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` (see `.env.example`) to turn on
   audio.
3. `npm run build`, then deploy. No server state, no database.

## Known issues

- `npm audit` reports high-severity advisories inherited from `create-next-app` build/dev tooling
  (`eslint`→`minimatch`, `postcss`, `sharp`→`libvips`). None are reachable at runtime for a static
  site.
- `opening.png` in the repo root is the original supplied asset, duplicated at
  `public/scenes/01-cockpit.png`. The root copy is safe to delete.

---

An independent concept. Not affiliated with ElevenLabs or any space agency.
