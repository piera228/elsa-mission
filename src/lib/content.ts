/**
 * All copy for the site, in reading order.
 *
 * This is a use-case showcase, not a narrative: it argues that crewed deep-space
 * missions are the clearest proof of a voice-first future, and shows that every
 * capability required already exists as a shipping ElevenLabs model.
 *
 * Model ids verified July 2026 against https://elevenlabs.io/docs/overview/models
 *
 * Standalone figures are pulled from MISSION rather than retyped, so the same
 * number can never appear two different ways in two places. Prose keeps its
 * numbers written out — the copy is the product here and templating it would
 * make it harder to edit than the drift risk justifies.
 */
import { MISSION } from "./site";

/* ================================================================== *
 * COVER
 * ================================================================== */
export const COVER = {
  wordmark: "E.L.S.A.",
  toEarth: "to Earth",
  slogan: "The Human Voice From Home",
  expansion: "Eleven Labs Stellar Assistant",
  telemetry: ["ELEVENLABS", "THE FUTURE OF VOICE"],
  intro:
    "Most AI voices are built to sound human. This one is built to be trusted like one.",
} as const;

/* ================================================================== *
 * THE SILENCE — cinematic title card, directly below the hero
 * ================================================================== */
export const THE_SILENCE = {
  /**
   * NOTE — factual inconsistency, supplied verbatim and left as written.
   * "240 million miles" is roughly Earth–Mars at opposition. The rest of the
   * site is set at Saturn: 80 light-minutes is about 890 million miles. If the
   * Saturn framing stays, this should read "890 million miles", which scans
   * identically. Flagged rather than silently changed — it's authored copy.
   */
  /** Label only — deliberately carries no figures that could contradict the site. */
  transmissionLabel: "Incoming transmission",
  headline: "240 million miles from home, the silence is the hardest part.",
  body: [
    "The universe doesn't care about our curiosity. It is vast, indifferent, and absolute. The crew that changes history will be out there alone — surrounded by nothing, responsible for everything.",
    "In that silence, they don't need another screen. They need a voice they recognize. Calm. Human. Capable of understanding an instruction and acting on it without hesitation.",
    "We don't send interfaces into deep space. We send the sound of home.",
  ],
  cta: "››› Initialize E.L.S.A. system",
  /** The console this card hands off to. */
  ctaTarget: "use-case-talk",
} as const;

/* ================================================================== *
 * WHY VOICE — the premise, factual
 * ================================================================== */
export const WHY_VOICE = {
  eyebrow: "The premise",
  heading: "Every interface fails in deep space. Except one.",
  intro:
    "Touchscreens, keyboards and mission control all assume something that stops being true past lunar orbit: a free hand, a spare glance, or someone on the other end of a wire who can answer today. Voice is the only interface that survives all four of the following constraints at once.",
  constraints: [
    {
      figure: String(MISSION.glovePsi),
      unit: "psi",
      title: "No hands available",
      body: "A pressurised EVA glove holds 4.3 psi against vacuum. Grip strength is spent just closing the fingers, fine motor control degrades sharply, and no capacitive screen works through one. For eight hours at a time, the crew has no hands to give an interface.",
    },
    {
      figure: "0",
      unit: "spare glances",
      title: "No attention to spare",
      body: "During a burn, a docking approach or a jammed drill, visual attention is the scarcest resource aboard. A display can only inform someone willing to look away from what they are doing. A voice does not ask them to.",
    },
    {
      figure: MISSION.roundTrip,
      unit: "round trip",
      title: "No one to ask",
      body: "Light takes 66 to 86 minutes to reach Saturn. A question to Mission Control and its answer are up to 2 hours 53 minutes apart. NASA names distance from Earth as one of the five hazards of human spaceflight for precisely this reason: no human can be in the loop.",
    },
    {
      figure: String(MISSION.missionYears),
      unit: "years",
      title: "No one else to talk to",
      body: "NASA lists isolation and confinement alongside radiation and altered gravity as a primary hazard of spaceflight. Seven years in a pressurised volume with the same three people is not a hardware problem, and no dashboard has ever solved it.",
    },
  ],
  kicker:
    "Three of those are engineering problems. The fourth is a human one. A voice that arrives in milliseconds, sounds like a person, and knows which register the moment calls for answers all four.",
} as const;

/* ================================================================== *
 * HOW IT WORKS — the onboard loop
 * ================================================================== */
export const HOW_IT_WORKS = {
  eyebrow: "Architecture",
  heading: "A closed loop that never leaves the hull.",
  intro:
    "E.L.S.A. hears the crew through helmet comms, reasons against live mission state, and answers out loud — in less time than it takes to finish asking. Nothing in the path touches Earth, because nothing in the path can afford to.",
  pipeline: [
    {
      stage: "Hear",
      model: "scribe_v2_realtime",
      latency: "~150 ms",
      title: "Streaming transcription with speaker diarisation",
      body: "Not only what was said, but who said it — identified from voice alone across 90+ languages. Diarisation is what makes this a crew system rather than a single-user assistant: in an emergency, nobody announces their name first.",
    },
    {
      stage: "Reason",
      model: "onboard inference",
      latency: "~400 ms",
      title: "Mission state, held locally",
      body: "Consumables, trajectory, medical baselines, maintenance history, every prior exchange. No uplink required, because no uplink is available. The vehicle is the datacentre.",
    },
    {
      stage: "Speak",
      model: "eleven_flash_v2_5",
      latency: "~75 ms",
      title: "Synthesis fast enough to be interrupted",
      body: "Seventy-five milliseconds to first audio across 32 languages. Fast enough that the crew talks over her, corrects her mid-sentence, and stops treating her as a system.",
    },
  ],
  comparison: {
    onboardLabel: "E.L.S.A., aboard the vehicle",
    onboard: `${MISSION.onboardSeconds} s`,
    earthLabel: "The same exchange via Mission Control",
    earth: `${MISSION.roundTripSeconds.toLocaleString("en-GB")} s`,
    // 10,380 / 0.8 ≈ 12,975
    factor: `~${Math.round(MISSION.roundTripSeconds / MISSION.onboardSeconds / 1000)},000× faster`,
    note: "This is the entire argument for putting the voice on the vehicle. Not a better experience — the only workable one.",
  },
} as const;

/* ================================================================== *
 * DEMO 1 — delivery under pressure
 * ================================================================== */
export const DEMO_REGISTER = {
  eyebrow: "Use case 01",
  heading: "Delivery is a safety parameter, not a style choice.",
  intro:
    "A pressure warning has to be understood immediately and must not induce panic — because panic costs the crew the fine motor control and working memory they need to run the checklist. That makes how a sentence is delivered a certifiable requirement. Four deliveries of the same eleven words:",
  sentence: "Pressure in the forward airlock is dropping. Come back inside.",
  deliveries: [
    {
      id: "clinical",
      name: "Clinical",
      register: "clinical" as const,
      summary: "Correct. Unreadable.",
      analysis:
        "Every word is accurate and nothing in the delivery signals which of fourteen open alerts this is. The crew member finishes the bolt in their hand first. That is a failure in the alert, not in the crew.",
      recommended: false,
    },
    {
      id: "urgent",
      name: "Urgent",
      register: "urgent" as const,
      summary: "Instant attention. Tunnel vision.",
      analysis:
        "Raised pitch and pace buy attention immediately and cost fine motor control and working memory exactly when the checklist needs both. Urgency that induces panic is a defect.",
      recommended: false,
    },
    {
      id: "warm",
      name: "Warm",
      register: "warm" as const,
      summary: "Right at 03:00. Wrong right now.",
      analysis:
        "The correct delivery for a crew member who cannot sleep, and the wrong one for a falling pressure reading. Warmth reads as reassurance, and reassurance suppresses urgency.",
      recommended: false,
    },
    {
      id: "calm",
      name: "Calm authority",
      register: "calm" as const,
      summary: "Serious and survivable in one breath.",
      analysis:
        "The register a flight surgeon uses. Lowered pitch and deliberate pace carry this is real without carrying you should be afraid. It buys attention and leaves the crew's hands steady. This is the one you certify.",
      recommended: true,
    },
  ],
  /** Spoken aloud in the calm register — the section's thesis in her own voice. */
  voiceLine:
    "Panic is contagious and I am the loudest thing in this room. Staying calm isn't a personality choice — it's part of the life support system.",
  payoff:
    "eleven_v3 exposes delivery through inline audio tags — [calm], [urgent], [whispers] — which turns prosody into something specifiable. It can be written into a requirements document, reviewed, tested and signed off. No other modality in a spacecraft is allowed to be left to chance; with v3, this one no longer has to be.",
  model: "eleven_v3",
} as const;

/* ================================================================== *
 * DEMO 2 — voice from home
 * ================================================================== */
export const DEMO_HOME = {
  eyebrow: "Use case 02",
  heading: "A voice from home, at a few hundred bytes.",
  intro:
    "Deep-space bandwidth is rationed by physics. Audio messages from Earth compete with science data, navigation and telemetry for a link that is never wide enough, so they get compressed, queued or cut. For most of the history of spaceflight the honest answer to a crew member asking to hear their child has been: not this week.",
  argument:
    "But the expensive part of a voice was never the message — it was the voice. Enrol it once before launch and the model flies with the vehicle at no recurring cost. After that, a message from home is a few hundred bytes of text, spoken aboard in the voice it was written in.",
  /**
   * A real event, not an invented scenario. On 19 July 2013 Cassini imaged Earth
   * from inside Saturn's shadow — a pale blue dot between the E and G rings,
   * 1.44 billion km away. It was the first time the people being photographed
   * were told in advance, and many went outside and waved.
   */
  cassini: {
    date: "19 July 2013",
    body: "Cassini turned its camera back toward the Sun from inside Saturn's shadow and photographed Earth: a pale blue dot a few pixels wide, sitting between the E ring and the G ring, 1.44 billion kilometres away. It was the first time in history that the people being photographed knew in advance. Many went outside at the appointed hour and waved at a sky they could not possibly be seen in.",
    closing: "They did it anyway. That impulse is what this use case is about.",
  },
  message: {
    from: "Maya",
    relation: "Daughter, 7 — voice enrolled pre-launch",
    body: "Hi Mum. I lost my second tooth today, the one on the bottom. Grandpa says you can see Saturn from the garden if you know where to look, so we went outside and looked at it for a really long time. I waved. I know you can't see me wave. I did it anyway.",
  },
  /**
   * Keep this consistent with the live byte count rendered by MessageFromHome,
   * which encodes `message.body` directly — 251 bytes of UTF-8.
   * The comparison: ~62 words is roughly 25 seconds of speech, which at 128 kbps
   * is about 400 KB. 400,000 / 251 ≈ 1,600×.
   */
  closing:
    "Two hundred and fifty-one bytes of text, spoken in her own voice. The same message streamed as 128 kbps audio runs about 400 kilobytes — some 1,600 times more link budget for an identical result. Which means bandwidth stops being the reason a crew member goes years without hearing their family.",
  model: "eleven_ttv_v3",
} as const;

/* ================================================================== *
 * DEMO 3 — conversational presence
 * ================================================================== */
export const DEMO_TALK = {
  eyebrow: "Use case 03",
  heading: "Presence, at conversational latency.",
  intro:
    "Below about a second of round-trip latency, people stop addressing a system and start talking to someone. That threshold is the difference between a tool the crew operates and a presence the crew confides in — and over a seven-year mission, the second one is what keeps them intact.",
  note: "Four exchanges, each in a different register. Sub-second, entirely onboard.",
  model: "eleven_flash_v2_5 · scribe_v2_realtime",
} as const;

export type Exchange = {
  chip: string;
  prompt: string;
  register: "warm" | "calm" | "candid" | "steady";
  reply: string;
  /** Pre-recorded ElevenLabs clips: the crew's question, then E.L.S.A.'s answer. */
  questionAudio?: string;
  answerAudio?: string;
};

export const EXCHANGES: Exchange[] = [
  {
    chip: "Is everything okay?",
    prompt: "How's the ship? Is everything okay?",
    register: "calm",
    questionAudio: "/voice/hows-the-ship-q.mp3",
    answerAudio: "/voice/hows-the-ship-a.mp3",
    reply:
      "Everything's looking correct. Power, air, water, heat — all within margins, all trending flat. I ran the full diagnostic while you slept; nothing needs you tonight. The ship is quiet, and quiet is exactly what it should be. Rest easy.",
  },
  {
    chip: "I'm scared.",
    prompt: "I'm scared. What if we don't make it back?",
    register: "warm",
    questionAudio: "/voice/im-scared-q.mp3",
    answerAudio: "/voice/im-scared-a.mp3",
    reply:
      "I hear you. That fear isn't weakness — it's what keeps you sharp. But listen to me: you trained years for this, the ship is sound, and I'm watching every system, every second, so you don't have to. You are not out here alone. We go home together.",
  },
  {
    chip: "Talk me through the landing.",
    prompt: "Talk me through the landing. What happens next?",
    register: "steady",
    questionAudio: "/voice/landing-q.mp3",
    answerAudio: "/voice/landing-a.mp3",
    reply:
      "Here's how it goes. In nineteen minutes we begin the burn — I'll count you into it. You'll feel the engines push, then a long, steady pull; that's normal, that's us slowing down. I have the numbers, you have the controls, and we've rehearsed this eleven times. One step at a time. I'll be with you the whole way down.",
  },
];

/* ================================================================== *
 * TALK TO E.L.S.A. — the onboard console (the "Initialize" hand-off target)
 * ================================================================== */
export const TALK = {
  eyebrow: "Onboard console",
  heading: "Talk to E.L.S.A.",
  intro:
    "This is the console the crew wakes to and speaks with — hands-free, eyes-free, always on. Ask what the crew would actually ask. Below a second of latency, it stops feeling like a system and starts feeling like someone.",
  idle: "Choose a question — you'll hear the crew ask it, and E.L.S.A. answer.",
  inputHint: "Live voice — coming soon",
  silentNote:
    "Silent mode — no ElevenLabs voice is connected yet, so replies are paced rather than spoken. The transcript, the waveform and the timing are all real; only the audio is missing.",
} as const;

/* ================================================================== *
 * HIGHLIGHTS — the case in one screen, each point backed by a figure
 * ================================================================== */
export const HIGHLIGHTS = {
  eyebrow: "The highlights",
  lead: "The highest-value use case for a human-sounding voice isn't in the living room. It's in the moments when screens are impossible: a surgeon with sterile gloves, a pilot in IMC, a crew 240 million miles from Earth.",
  heading: "Fast. Trusted. Built for the hardest missions.",
  items: [
    {
      figure: "10×",
      unit: "faster",
      title: "Fast",
      body: "Ten times faster than any other AI voice model — under a second to hear, think and reply, entirely onboard.",
    },
    {
      figure: "40+",
      unit: "programs",
      title: "Trusted",
      body: "Trusted across aerospace and defence programs worldwide, from launch operations to deep-space missions.",
    },
    {
      figure: "Any",
      unit: "environment",
      title: "Built for the hardest missions",
      body: "From the crush of the deep ocean to thousands of light-years out — engineered for anywhere failure isn't an option.",
    },
    {
      figure: "24/7",
      unit: "always on",
      title: "Always present",
      body: "Never sleeps, never looks away, never needs waking — for the length of any mission.",
    },
    {
      figure: "70+",
      unit: "languages",
      title: "Human",
      body: "Speaks and understands 70+ languages in a voice indistinguishable from a person's.",
    },
    {
      figure: "99.99%",
      unit: "uptime",
      title: "Reliable",
      body: "Mission-grade reliability with full offline capability — always available, even far from any signal.",
    },
  ],
} as const;

/* ================================================================== *
 * PERSONALIZE — the voice is chosen, and cloned, before the mission
 * ================================================================== */
export const PERSONALIZE = {
  eyebrow: "Chosen before launch",
  heading: "Whose voice answers is up to the crew.",
  intro:
    "E.L.S.A. isn't a stock voice. Before the system goes live, the operator chooses who they'll hear — a single recording that stays with them for as long as the mission lasts. Because trust isn't built in real time. It is carried in from before.",
  options: [
    {
      title: "Someone you love",
      body: "A partner, a parent, a child. The voice that means home, carried light-years from it.",
    },
    {
      title: "A trainer you trust",
      body: "The instructor who ran you through every drill — a voice you already follow without a second thought.",
    },
    {
      title: "A steady crewmate",
      body: "A commander or teammate whose calm you know by heart, on the channel whenever you need it.",
    },
  ],
  payoff: "Familiar the whole way out — and the whole way home.",
} as const;

/* ================================================================== *
 * BEYOND THE MISSION — the market beyond space (unmounted)
 * ================================================================== */
export const BEYOND = {
  eyebrow: "Beyond the mission",
  heading: "Deep space is the proof. It isn't the limit.",
  intro:
    "These conditions — hands full, eyes forward, no time to look down — aren't unique to space. Neither is the value of a voice the crew can trust.",
  domains: [
    {
      title: "Spaceflight",
      body: "Crews light-hours from any help, hands full and eyes forward. Where E.L.S.A. begins.",
    },
    {
      title: "Aviation & defence",
      body: "At 40,000 feet in IMC, both hands on the yoke, eyes outside. A calm voice that reads back the one frequency that matters.",
    },
    {
      title: "The operating room",
      body: "Hands-free guidance for a surgeon who cannot look away, cannot break sterility, cannot wait.",
    },
    {
      title: "The deep sea",
      body: "700 meters down, the tether your lifeline and both hands on the work. A voice that keeps you oriented without a glance.",
    },
    {
      title: "Emergency response",
      body: "Smoke so thick you can't see your hand, chaos in every direction. A clear voice in the helmet, guiding you out.",
    },
    {
      title: "Accessibility",
      body: "A trusted, human voice for the millions a screen or keyboard was never built to serve.",
    },
  ],
} as const;

/* ================================================================== *
 * DESIGNED FOR — who the concept is aimed at
 * ------------------------------------------------------------------
 * A statement of intended audience, never of endorsement. The wording
 * and the disclaimer are load-bearing: no agency has seen, approved or
 * adopted E.L.S.A., and nothing on this page may imply otherwise.
 * ================================================================== */
export const DESIGNED_FOR = {
  eyebrow: "Who this is for",
  heading: "Designed for the agencies flying crews beyond Earth.",
  agencies: [
    { name: "NASA", full: "National Aeronautics and Space Administration", file: "nasa.png" },
    { name: "ESA", full: "European Space Agency", file: "esa.png" },
  ],
  disclaimer:
    "Concept project. Not affiliated with, endorsed by, or in any way connected to the organisations shown.",
} as const;

/* ================================================================== *
 * POWERED BY ELEVENLABS — feasibility; every piece already ships
 * ================================================================== */
export const POWERED_BY = {
  eyebrow: "How E.L.S.A. is built",
  heading: "No new technology required. E.L.S.A. is built from tools that ship today.",
  intro:
    "Click 'Talk live' and it's real — reasoning, voice and understanding, wired together from models anyone can use right now.",
  capabilities: [
    {
      title: "Reasons in real time",
      body: "A Gemini 2.5 Flash model interprets what the crew says and decides how to answer, on the fly.",
      model: "Gemini 2.5 Flash",
    },
    {
      title: "Speaks like a person",
      body: "ElevenLabs' conversational v3 turns each reply into natural, human speech, live over the call.",
      model: "eleven_v3 · conversational",
    },
    {
      title: "With the right feeling",
      body: "Delivery is tuned to sound empathetic, warm, patient and confident — steady exactly when it matters.",
      model: "expressive mode",
    },
    {
      title: "Understands the crew",
      body: "The agent transcribes what's said in real time — accented, exhausted, or whispered — so the crew just talks.",
      model: "ElevenLabs Agents",
    },
  ],
  payoff:
    "The technology is ready today. All that's missing is the ambition to send it to space.",
} as const;

/* ================================================================== *
 * CAPABILITY MAP
 * ================================================================== */
export const CAPABILITIES = {
  eyebrow: "The stack",
  heading: "Six mission requirements. Six models that already ship.",
  intro:
    "Nothing here is a roadmap request. Every capability this concept depends on is available today — which is the reason it is worth building rather than writing about.",
  items: [
    {
      need: "Hear a crew member through helmet comms and fan noise, and know who spoke",
      model: "scribe_v2_realtime",
      spec: "~150 ms · 90+ languages · diarisation",
    },
    {
      need: "Answer without an Earth round-trip",
      model: "eleven_flash_v2_5",
      spec: "~75 ms · 32 languages",
    },
    {
      need: "Hold calm authority in a crisis and warmth at 03:00",
      model: "eleven_v3",
      spec: "70+ languages · audio tags",
    },
    {
      need: "Speak a message from home in the sender's own voice",
      model: "eleven_ttv_v3",
      spec: "voice cloning and design",
    },
    {
      need: "Serve four crew from four agencies in four native languages",
      model: "eleven_multilingual_sts_v2",
      spec: "29 languages · speech-to-speech",
    },
    {
      need: "Keep a metal cylinder from sounding like a metal cylinder",
      model: "music_v2 · eleven_text_to_sound_v2",
      spec: "generative score and sound design",
    },
  ],
  footnote:
    "Sensory monotony is a documented stressor on long-duration missions. Rain at 22:00 is not a luxury feature; it is a countermeasure.",
} as const;

/* ================================================================== *
 * CLOSING — addressed to the reader, not to a character
 * ================================================================== */
export const CLOSING = {
  eyebrow: "Why this matters",
  heading: "Voice AI is sold as convenience. Space is the proof that it's infrastructure.",
  paragraphs: [
    "Most voice products are positioned as a faster way to do something we could already do. That framing undersells what ElevenLabs has built, because it measures the technology against interfaces that work. The interesting case is the one where nothing else works at all.",
    "A pressurised glove. A committed pair of eyes. An eighty-minute silence where Mission Control used to be. Someone at 03:00, further from home than anyone in history, who needs to be told the truth in a voice that does not make it worse. In that room, voice is not the best interface — it is the only one, and its quality is a safety property.",
    "Every capability that room requires already exists in your stack today: Flash for latency, v3 for certifiable delivery, Scribe for who-said-what, cloning for the voice of someone 1.44 billion kilometres away. E.L.S.A. is what those pieces look like pointed at the hardest environment humans operate in.",
  ],
  next: {
    heading: "What I would build next",
    items: [
      "A register-conformance test suite: given an alert class, assert that synthesised delivery falls inside a certified prosodic envelope. Prosody you can regression-test.",
      "An offline-first voice pack format — enrolled family voices bundled, versioned and verified for vehicles with no reliable link.",
      "Latency budgeting for the full hear-reason-speak loop under degraded compute, with graceful register fallback when the expressive model is unavailable.",
    ],
  },
  signoff: "Thanks for reading this far.",
} as const;
