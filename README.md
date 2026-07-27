# E.L.S.A.

**E.L.S.A. to Earth · The Human Voice From Home**

A concept for the onboard voice of a crewed deep-space mission, and the case that space is where
voice AI stops being convenient and becomes critical.

Built on ElevenLabs. Live at [elsa-mission.vercel.app](https://elsa-mission.vercel.app).

---

## The argument

Most voice AI is positioned as convenience, a faster way to do something we could already do. That
framing measures the technology against interfaces that work. The interesting case is the one where
nothing else works at all.

Past lunar orbit, four constraints hold simultaneously:

| Constraint | Figure | Why it rules out every other interface |
| --- | --- | --- |
| No hands available | **4.3 psi** | A pressurised EVA glove spends grip strength just closing the fingers. No capacitive screen works through one. |
| No attention to spare | **0 spare glances** | During a burn or a jammed drill, a display can only inform someone willing to look away from the task. |
| No one to ask | **2h 40m** | Light takes about 80 min to reach Saturn. Mission Control cannot be in the loop. |
| No one else to talk to | **7 years** | NASA lists isolation and confinement alongside radiation as a primary spaceflight hazard. |

Three are engineering problems. The fourth is human. A voice that arrives in milliseconds, sounds
like a person, and knows which register the moment calls for answers all four.

## What is on the page

Seven sections, in order:

| Section | What it does |
| --- | --- |
| **Cover** | Full-bleed cockpit frame. A 6s dolly-in plays over the still on desktop. |
| **The silence** | The premise, and the button that opens the console. |
| **Talk to E.L.S.A.** | The console. Scripted exchanges, plus a live two-way conversation. Mounts only once `#use-case-talk` is set. |
| **Mission requirements** | Six capabilities a voice would need, as a specification rather than a feature grid. |
| **Trust has to exist before launch** | A pre-flight crew voice manifest. Three people who stayed on Earth, each playable. |
| **How E.L.S.A. is built** | Four capabilities, each anchored to a real model id. |
| **Working without a link** | How any of it runs with no internet, drawn as one diagram: a closed loop inside the hull, and one thin line from Earth ending on the word the ship speaks with. |
| **Who this is for** | NASA and ESA, framed as intended audience, never as endorsement. |

## Architecture

The onboard loop, which never touches Earth:

```
hear                     reason                    speak
scribe_v2_realtime  →    onboard inference    →    eleven_flash_v2_5
~150 ms                  ~400 ms                   ~75 ms
```

Total ≈ **0.8 s**, against **9,600 s** for the same exchange via Mission Control, about
**12,000× faster**. That ratio is the entire argument for putting the voice on the vehicle.

Two of those three stages ship today. The middle one, reasoning onboard with no link home, does not
exist yet. **The site no longer states this**: the paragraph that admitted it was removed. Worth
knowing if you are reading the page as a claim about what is possible now.

The live demo does *not* run this loop. It is an ElevenAgents agent over WebRTC reaching a data
centre like anything else.

## The API

Two routes. Neither holds state.

### `/api/conversation-token`

Mints a short-lived token from `/v1/convai/conversation/token?agent_id=…` and returns it as plain
text, so the API key never reaches the browser. `LiveTalk` then calls `startSession({
conversationToken, connectionType: "webrtc" })`.

**The agent's models are not configured here.** The request carries only `agent_id`; the LLM, TTS
model, voice and system prompt all live in the ElevenLabs dashboard. Copy on the site names
`Gemini 2.5 Flash` and `eleven_v3_conversational` because that is how the agent is configured, but
nothing in this repo enforces it, and nothing will break if it changes. If you reconfigure the
agent, update the copy by hand.

### `/api/speak`

Server-side call to `/v1/text-to-speech/{voice}/stream`, returning `audio/mpeg`. Six registers
(calm, steady, warm, candid, urgent, clinical) carry their own stability, similarity and style
settings, so the same sentence can be delivered four different ways. `eleven_flash_v2_5` by
default; `eleven_v3` when the caller asks for expressive delivery, since only v3 honours inline
audio tags.

## Two deliberate design decisions

### 1. Voice degrades instead of breaking

Every voice surface calls one hook, [`useElsaVoice`](src/lib/use-elsa-voice.ts), never the route
directly.

- **With credentials.** The route streams MP3. Playback position drives the word-by-word transcript
  reveal, and a Web Audio `AnalyserNode` drives the waveform from the real voice.
- **Without credentials.** The route returns `503 { configured: false }`. The hook treats that as a
  designed path, not an error: it paces playback from the word count at 150 wpm and synthesises a
  speech-shaped amplitude envelope. Every reveal, orb and progress bar behaves exactly as it will
  with audio, and a quiet note explains that no voice is connected.

Components never branch on availability. They call `speak()`. Adding a key changes no component
code.

### 2. Content is never gated behind JavaScript

Scroll reveals are CSS (`animation-timeline: view()`), visible by default and additive only. An
earlier version set `opacity: 0` and restored it from an IntersectionObserver, which meant a broken
script blanked everything below the fold. The no-uplink diagram follows the same rule: it is static
SVG with two CSS dash animations, and ships no JavaScript at all.

## Assets

| Path | Notes |
| --- | --- |
| `public/scenes/01-cockpit.png` | 1672 × 941. Cover still, LCP element, and the style reference for every other scene. |
| `public/scenes/01-cockpit.mp4` | 3.7 MB, 1080p, 10s, no audio. The cover film. See below. |
| `public/scenes/elsa-console.png` | The console illustration in the Talk section. |
| `public/voice/*.mp3` | Six clips: the three scripted exchanges, question and answer. |
| `public/voice/manifest/*.mp3` | `mom` / `nate` / `tess`, played from the crew voice manifest. |
| `public/logos/` | NASA and ESA marks for the closing section. |

### The cover film

Layered over the still, never instead of it, so the `<Image>` remains the LCP element and the page
is unchanged without it. It plays once and holds its final frame rather than looping: the source
was cut mid-move, so it was re-timed with a quadratic deceleration over the last 1.8s and
interpolated to 30fps to stop the slow-down juddering.

It is **not mounted below `lg`, and not mounted under `prefers-reduced-motion`**, checked in JS
rather than CSS, because `hidden` does not stop a browser fetching a video source. A phone never requests
the file.

## Art direction

`public/scenes/01-cockpit.png` is supplied and is the **style reference** for every other scene.

**The rim-light rule, non-negotiable.** Interiors and crew are lit from exactly two directions:
warm amber `#FFB067` from E.L.S.A.'s console, cool blue `#6E9BD8` from the window. Amber light is
*always* her; nothing else in any frame is ever amber. The palette carries the argument: a warm
voice inside a cold vacuum, stated in hex.

E.L.S.A. is never depicted. No face, no avatar, no character render. She is light and sound only. A
voice-first argument gets weaker the moment you give it a screen presence.

Scenes 02–06 are specified in [`src/lib/scenes.ts`](src/lib/scenes.ts) but **none are used by the
current page**, which is a single-cover design. They matter only if the dormant sections below are
ever mounted.

## Accessibility and performance

- `/` and `/about` prerender as **static**. The cover is statically imported so Next derives
  dimensions, generates a blur placeholder, and preloads it as the LCP element.
- `prefers-reduced-motion` disables the cinematic intro, the cover film, parallax, starfield
  twinkle, orb breathing and all reveals.
- No horizontal overflow at 375 / 390 / 768 / 1440 / 2560 px.
- Diagram labels and section body copy clear WCAG AA against the panel background. The cover
  telemetry strip runs at full paper rather than the site's usual `telemetry-dim`, because it sits
  on the illustration rather than the void.
- Cover art is 1672 × 941 (~1.6 MP). It upscales on retina displays; a grain overlay masks the
  softness, and re-rendering at ≥ 2560 px wide is the single biggest remaining visual improvement.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build; / prerenders as static
npm run lint
npx tsc --noEmit
```

Next.js 16.2 (App Router, Turbopack), React 19.2, Tailwind v4, `motion` v12. Node 20.9+ required by
Next; developed on 24.

## Before deploying

1. Check `author`, `email`, `github` and `url` in [`src/lib/site.ts`](src/lib/site.ts). `url` drives
   `metadataBase` and the OpenGraph URL, so it must match the deployment.
2. Set the environment variables you need (see `.env.example`):
   - `ELEVENLABS_API_KEY`: required by both routes.
   - `ELEVENLABS_AGENT_ID`: required for "Talk live". Without it the live conversation is
     unavailable.
   - `ELEVENLABS_VOICE_ID`: required for `/api/speak`. Without it that route returns 503 and the
     hook falls back to silent mode, by design.
3. `npm run build`, then deploy. No server state, no database.

## Dormant components

Present in the repo, imported by nothing, and therefore **not on the site**. Left in place because
their copy and layout are finished, but they will mislead anyone who greps for them expecting to
find them rendered:

`WhyVoice` · `HowItWorks` · `Capabilities` · `UseCaseRegister` · `UseCaseHome` · `UseCaseTalk` ·
`BeyondMission` · `Closing` · `AskHer` · `MessageFromHome` · `RegisterSwitcher` · `ElsaLine` ·
`VoiceOrb` · `Scene`

Their copy in `src/lib/content.ts` was **not** included in the accuracy or house-style passes, so it
still contains model claims and em dashes that the live copy no longer does. Check it before
mounting any of them.

## Known issues

- `npm audit` reports high-severity advisories inherited from `create-next-app` build/dev tooling
  (`eslint`→`minimatch`, `postcss`, `sharp`→`libvips`). None are reachable at runtime for a static
  site.
- `opening.png` and `opening reszed.png` in the repo root are the original supplied assets, ~1.9 MB
  each, duplicated at `public/scenes/01-cockpit.png`. Both are safe to delete.

---

An independent concept. Not affiliated with ElevenLabs or any space agency.
