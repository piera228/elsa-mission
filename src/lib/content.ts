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
   * Interpolated from MISSION rather than typed, because this line has been
   * restated four times now: "240 million miles" (Earth to Mars, contradicting
   * the Saturn imagery), "890 million miles" (right planet, rounded off the
   * light time), then the delay in words, and now the distance again. Each
   * version had to agree with owltMinutes to be true, and twice it did not.
   * Deriving it removes the possibility.
   */
  /** Label only. Deliberately carries no figures that could contradict the site. */
  transmissionLabel: "Incoming transmission",
  headline: `${MISSION.distanceKm} from home, the silence is the hardest part.`,
  body: [
    "The universe is vast, unforgiving, and indifferent to mistakes. The crew that changes history will be out there alone, surrounded by nothing, responsible for everything.",
    "In that silence, they need a voice they recognize. Calm. Human. Capable of understanding an instruction and acting on it without hesitation.",
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
      body: "Light takes about eighty minutes to reach Saturn. A question to Mission Control and its answer are two hours and forty minutes apart. NASA names distance from Earth as one of the five hazards of human spaceflight for precisely this reason: no human can be in the loop.",
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
    "E.L.S.A. hears the crew through helmet comms, reasons against live mission state, and answers out loud, in less time than it takes to finish asking. Nothing in the path touches Earth, because nothing in the path can afford to.",
  pipeline: [
    {
      stage: "Hear",
      model: "scribe_v2_realtime",
      latency: "~150 ms",
      title: "Streaming transcription with speaker diarisation",
      body: "Not only what was said, but who said it, identified from voice alone across 90+ languages. Diarisation is what makes this a crew system rather than a single-user assistant: in an emergency, nobody announces their name first.",
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
    // 9,600 / 0.8 = 12,000
    factor: `~${Math.round(MISSION.roundTripSeconds / MISSION.onboardSeconds / 1000)},000× faster`,
    note: "This is the entire argument for putting the voice on the vehicle. Not a better experience. The only workable one.",
  },
} as const;

/* ================================================================== *
 * DEMO 1 — delivery under pressure
 * ================================================================== */
export const DEMO_REGISTER = {
  eyebrow: "Use case 01",
  heading: "Delivery is a safety parameter, not a style choice.",
  intro:
    "A pressure warning has to be understood immediately and must not induce panic, because panic costs the crew the fine motor control and working memory they need to run the checklist. That makes how a sentence is delivered a certifiable requirement. Four deliveries of the same eleven words:",
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
    "Panic is contagious and I am the loudest thing in this room. Staying calm isn't a personality choice. It's part of the life support system.",
  payoff:
    "eleven_v3 exposes delivery through inline audio tags ([calm], [urgent], [whispers]), which turns prosody into something specifiable. It can be written into a requirements document, reviewed, tested and signed off. No other modality in a spacecraft is allowed to be left to chance; with v3, this one no longer has to be.",
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
    "But the expensive part of a voice was never the message. It was the voice. Enrol it once before launch and the model flies with the vehicle at no recurring cost. After that, a message from home is a few hundred bytes of text, spoken aboard in the voice it was written in.",
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
    relation: "Daughter, 7 · voice enrolled pre-launch",
    body: "Hi Mum. I lost my second tooth today, the one on the bottom. Grandpa says you can see Saturn from the garden if you know where to look, so we went outside and looked at it for a really long time. I waved. I know you can't see me wave. I did it anyway.",
  },
  /**
   * Keep this consistent with the live byte count rendered by MessageFromHome,
   * which encodes `message.body` directly — 251 bytes of UTF-8.
   * The comparison: ~62 words is roughly 25 seconds of speech, which at 128 kbps
   * is about 400 KB. 400,000 / 251 ≈ 1,600×.
   */
  closing:
    "Two hundred and fifty-one bytes of text, spoken in her own voice. The same message streamed as 128 kbps audio runs about 400 kilobytes, some 1,600 times more link budget for an identical result. Which means bandwidth stops being the reason a crew member goes years without hearing their family.",
  model: "eleven_ttv_v3",
} as const;

/* ================================================================== *
 * DEMO 3 — conversational presence
 * ================================================================== */
export const DEMO_TALK = {
  eyebrow: "Use case 03",
  heading: "Presence, at conversational latency.",
  intro:
    "Below about a second of round-trip latency, people stop addressing a system and start talking to someone. That threshold is the difference between a tool the crew operates and a presence the crew confides in, and over a seven-year mission, the second one is what keeps them intact.",
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
      "Everything's looking correct. Power, air, water, heat. All within margins, all trending flat. I ran the full diagnostic while you slept; nothing needs you tonight. The ship is quiet, and quiet is exactly what it should be. Rest easy.",
  },
  {
    chip: "I'm scared.",
    prompt: "I'm scared. What if we don't make it back?",
    register: "warm",
    questionAudio: "/voice/im-scared-q.mp3",
    answerAudio: "/voice/im-scared-a.mp3",
    reply:
      "I hear you. That fear isn't weakness. It's what keeps you sharp. But listen to me: you trained years for this, the ship is sound, and I'm watching every system, every second, so you don't have to. You are not out here alone. We go home together.",
  },
  {
    chip: "Talk me through the landing.",
    prompt: "Talk me through the landing. What happens next?",
    register: "steady",
    questionAudio: "/voice/landing-q.mp3",
    answerAudio: "/voice/landing-a.mp3",
    reply:
      "Here's how it goes. In nineteen minutes we begin the burn. I'll count you into it. You'll feel the engines push, then a long, steady pull; that's normal, that's us slowing down. I have the numbers, you have the controls, and we've rehearsed this eleven times. One step at a time. I'll be with you the whole way down.",
  },
];

/* ================================================================== *
 * TALK TO E.L.S.A. — the onboard console (the "Initialize" hand-off target)
 * ================================================================== */
export const TALK = {
  eyebrow: "Onboard console",
  heading: "Talk to E.L.S.A.",
  intro:
    "This is the console the crew wakes to and speaks with. Hands-free, eyes-free, always on. Ask what the crew would actually ask. Below a second of latency, it stops feeling like a system and starts feeling like someone.",
  idle: "Choose a question. You'll hear the crew ask it, and E.L.S.A. answer.",
  inputHint: "Live voice, coming soon",
  silentNote:
    "Silent mode. No ElevenLabs voice is connected yet, so replies are paced rather than spoken. The transcript, the waveform and the timing are all real; only the audio is missing.",
} as const;

/* ================================================================== *
 * HIGHLIGHTS — the mission requirements, as a specification
 * ------------------------------------------------------------------
 * This reads as a requirements document, not a factsheet. Each card
 * answers one question: what would this voice absolutely need in order
 * to accompany a crew living years from Earth?
 *
 * It previously mixed four registers in one grid — product capability,
 * engineering metric, open research problem, and marketing claim — with
 * a "ships today / open problem" marker trying to hold them apart. That
 * made it a feature comparison, which is an argument about a product,
 * and this section is not about a product. Every latency figure, uptime
 * percentage, model id and status marker is gone. What remains is the
 * capability itself.
 *
 * Headlines are one word and set in paper, not amber: amber is only
 * ever E.L.S.A.'s voice (invariant #1), and these are requirements, not
 * her. The subtitle carries the cold telemetry blue so the hierarchy
 * reads by temperature as well as by size.
 * ================================================================== */
export const HIGHLIGHTS = {
  eyebrow: "Mission requirements",
  heading: "What the mission would demand of a voice.",
  items: [
    {
      title: "Instant",
      subtitle: "Respond without breaking thought.",
      body: "A crew can't wait while an interface catches up. A voice should answer naturally, fast enough that conversation never feels interrupted.",
      label: "Mission critical",
    },
    {
      title: "Autonomous",
      subtitle: "Operate without Earth.",
      body: "By Saturn, a question and its answer are separated by nearly three hours. The voice must understand, reason, and act entirely onboard, without waiting for a server or mission control.",
      label: "Essential",
    },
    {
      title: "Reliable",
      subtitle: "Never become unavailable.",
      body: "The crew depends on it every day: for procedures, emergencies, and ordinary conversation. It cannot disappear because the network does.",
      label: "Non-negotiable",
    },
    {
      title: "Resilient",
      subtitle: "Function in any environment.",
      body: "Launch vibration. Radiation. Vacuum. Years without maintenance. The voice has to continue operating when repair is impossible.",
      label: "Crew safety",
    },
    {
      title: "Human",
      subtitle: "Speak like someone you trust.",
      body: "In isolation, clarity matters, but so does warmth. The voice should reduce cognitive load, adapt to stress, and feel familiar during the longest journey humanity has ever attempted.",
      label: "Human factors",
    },
    {
      title: "Universal",
      subtitle: "Understand every crew member.",
      body: "Future crews will come from different nations and backgrounds. Every astronaut should be able to speak naturally, in their own language, without adapting to the machine.",
      label: "Required",
    },
  ],
} as const;

/* ================================================================== *
 * PERSONALIZE — trust is packed, not transmitted
 * ------------------------------------------------------------------
 * Not about choosing a voice. About trust having to exist before the
 * ship leaves: under stress people follow the voice they already know,
 * and that relationship was built on Earth years earlier. The mission
 * does not create it. It carries it.
 *
 * The heading is fixed and has NO full stop, unlike every other heading
 * on the site. That is deliberate and supplied verbatim. Do not
 * "correct" it.
 *
 * Nothing here may use product language. The sections above already
 * prove the engineering; this one is allowed to be purely human.
 *
 * THE THREE LINES ARE THE SECTION. Mom and Tess are both family, so
 * their lines have to carry different weight or the two cards read as
 * the same card twice:
 *
 *   Mom   steady. The voice you fall back on. Weight, no sentiment.
 *   Nate  authority. The voice you obey before you have decided to.
 *   Tess  light. Who you want when you do not need looking after.
 *
 * Every line is an observation about how the person talks, never about
 * how it makes anyone feel. A thing she says beats a feeling she
 * causes. All are under twelve words; if one starts reaching, cut it
 * back rather than explaining it.
 *
 * Nate stayed on Earth. His relationship field used to say so
 * explicitly ("commanding officer, Mission Control") and no longer
 * does. Nothing on the card now states that he is not aboard; the only
 * remaining hint is that his recording was made in Houston, which is
 * true of every entry. If a voice belonged to someone on the ship,
 * nothing was carried and nothing was left behind, and the section
 * collapses — so if that reading ever needs closing off again, this is
 * the line that closed it.
 *
 * Consent now lives only in the card footers ("consent on file"). The
 * paragraph that said somebody sat in a room on Earth and agreed to be
 * heard has been removed, and with it the last statement anywhere in
 * the section that the decision cannot be revised once the ship leaves.
 * Both were called load-bearing when the section was briefed, so if the
 * moral weight ever needs restoring, that paragraph is what carried it.
 * ================================================================== */
export const PERSONALIZE = {
  eyebrow: "Chosen before launch",
  /** Verbatim, and intentionally without a full stop. */
  heading: "Trust has to exist before launch",
  body: [
    "Under pressure, people do not follow the voice that sounds best. They follow the voice they already know. That is why it is chosen on Earth, years before the ship leaves: not because choice is a nice thing to offer, but because familiarity is what a person falls back on when there is nothing else to fall back on.",
  ],
  manifest: {
    /**
     * Supplied as "examples of what who that voice could be"; the "what" is
     * taken as a slip and dropped.
     */
    intro: "Here are some examples of who that voice could be.",
    label: "Crew voice manifest · pre-flight",
    /** Names as the crew actually says them, not as a form would record them. */
    entries: [
      {
        name: "Mom",
        relationship: "mother",
        line: "Says the hard part first, then waits.",
        footer: "14 Mar · Houston · consent on file",
        audio: "/voice/manifest/mom.mp3",
      },
      {
        name: "Commander Nate",
        relationship: "commanding officer",
        line: "You are moving before he finishes the sentence.",
        footer: "02 Apr · Houston · consent on file",
        audio: "/voice/manifest/nate.mp3",
      },
      {
        name: "Tess",
        relationship: "sister",
        line: "Still calls it your little trip.",
        footer: "27 Feb · Cologne · consent on file",
        audio: "/voice/manifest/tess.mp3",
      },
    ],
  },
} as const;

/* ================================================================== *
 * BEYOND THE MISSION — the market beyond space (unmounted)
 * ================================================================== */
export const BEYOND = {
  eyebrow: "Beyond the mission",
  heading: "Deep space is the proof. It isn't the limit.",
  intro:
    "These conditions are not unique to space: hands full, eyes forward, no time to look down. Neither is the value of a voice the crew can trust.",
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
  heading: "Designed for the agencies with the toughest missions.",
  agencies: [
    { name: "NASA", full: "National Aeronautics and Space Administration", file: "nasa.png" },
    { name: "ESA", full: "European Space Agency", file: "esa.png" },
  ],
  disclaimer:
    "Concept project. Not affiliated with, endorsed by, or in any way connected to the organisations shown.",
} as const;

/* ================================================================== *
 * POWERED BY ELEVENLABS — feasibility, and the one piece that is missing
 * ------------------------------------------------------------------
 * Every capability below is live on this page right now: the agent this
 * site connects to runs Gemini 2.5 Flash for reasoning and
 * eleven_v3_conversational for voice, with expressive mode on by
 * default. That configuration lives in the ElevenLabs dashboard, not in
 * this repo — the code sends only an agent_id (see elevenlabs.ts) — so
 * if the agent is ever reconfigured, this copy must be updated by hand.
 * Nothing here will break to warn you.
 *
 * This section carries no payoff line. It used to close on "the
 * technology is ready today", which made the aspirational figures
 * elsewhere read as product facts; that was replaced by a line naming
 * the onboard gap, and then removed once NO_UPLINK arrived directly
 * below and made the same point at length. The heading now poses the
 * question and the next section answers it.
 * ================================================================== */
export const POWERED_BY = {
  eyebrow: "How E.L.S.A. is built",
  intro:
    "Reasoning, voice and understanding, wired together from models anyone can use right now.",
  /** Badge shown against each capability. All four genuinely are available. */
  availableLabel: "Available today",
  capabilities: [
    {
      title: "Reasons in real time",
      body: "Gemini 2.5 Flash model interprets what the crew says and decides how to answer, on the fly.",
      model: "Gemini 2.5 Flash",
    },
    {
      title: "Speaks like a person",
      body: "Eleven v3 Conversational turns each reply into natural, expressive speech, live over the call. It is v3's range at conversational latency.",
      model: "eleven_v3_conversational",
    },
    {
      title: "With the right feeling",
      body: "Expressive mode is on by default with v3 Conversational: delivery adapts to intent and emphasis, steady exactly when it matters.",
      model: "expressive mode",
    },
    {
      title: "Understands the crew",
      body: "The agent transcribes what's said in real time, whether it's accented, exhausted or whispered. The crew just talks.",
      model: "ElevenAgents",
    },
  ],
} as const;

/* ================================================================== *
 * NO UPLINK — how any of this works with no internet
 * ------------------------------------------------------------------
 * The objection this section exists to answer: ElevenLabs' product runs
 * over a network, and Saturn is 80 light-minutes away. Anyone reading
 * this page will think it within seconds, so the page had better get
 * there first.
 *
 * Everything rests on one distinction, and the section fails if a
 * reader misses it: the crew's conversation never leaves the hull, and
 * the only thing that crosses space is text.
 *
 * Heading candidates, kept for the record:
 *   "There is no signal to wait for. So nothing waits."
 *   "The link home carries words. The voice is already onboard."
 * The chosen one leads with the physical fact, because a reader who
 * knows the light-time arithmetic is already doing it — meeting them
 * there is stronger than easing in.
 *
 * It said "Earth is eighty minutes away", which a reader in this
 * industry parses as latency — a number someone could engineer down.
 * Naming Saturn and calling them light-minutes closes that reading:
 * this is the speed of light, it is a floor, and no amount of money
 * moves it. The intro then spends its first two sentences on that
 * single point, because every other claim in the section depends on
 * the reader accepting it. It says it from the ship's point of view —
 * "from here" — so the reader is standing at Saturn rather than
 * reading a fact about it.
 *
 * Numbers here are physical only: MISSION.owltMinutes one way, twice
 * that for a question and an answer.
 *
 * The two halves used to be labelled "Channel A" and "Channel B". Those
 * were working titles that survived into the page: nobody knows what a
 * channel is here, and lettering them made a reader hold two abstract
 * tokens before receiving any meaning. They are named by location now,
 * because location is the entire point.
 *
 * The product paragraphs name releases and a date on purpose. Every
 * claim in them is checkable, and the section is only persuasive if a
 * reader who checks finds it exact.
 *
 * Gone with the previous copy: the deterministic-mode paragraph, and
 * with it "Generation is for company. It is never for an instruction
 * that can kill someone." That was the only statement anywhere on the
 * page that E.L.S.A. does not improvise safety-critical instructions.
 * ================================================================== */
export const NO_UPLINK = {
  eyebrow: "Working without a link",
  heading: "From Saturn, Earth is eighty light-minutes away. E.L.S.A. is not.",
  intro:
    "Light takes eighty minutes to reach Earth from here. There is nothing faster to send. Ask Mission Control a question and the answer arrives two hours and forty minutes later: eighty minutes out, eighty minutes back, and only if someone replies the instant it lands. Every voice assistant you have used answers over a network. At Saturn there is no network to answer over.",
  payoff: "You cannot call home. So home comes with you.",
  /**
   * Verified against elevenlabs.io/blog/enterprise-voice-ai-deployed-locally,
   * dated 9 Apr 2026. Supplied copy said ElevenLabs "now supports" these; they
   * are early access with releases only expected in H1 2026, so the paragraph
   * states the announcement and the status instead. The whole point of this
   * section is that a reader who checks finds it exact.
   */
  body: [
    "None of this requires speculative technology. The foundation already exists. On 9 April 2026 ElevenLabs announced on-premise and on-device deployment, both in early access, with initial releases expected in the first half of 2026.",
    "On-premise runs speech models on your own servers, on confidential computing infrastructure with GPUs, and supports air-gapped deployment where isolation is required. On-device runs directly on the hardware itself, built for offline inference on constrained compute; the use case ElevenLabs names is automotive, manufacturers embedding voice into vehicles and wearables. Both are purpose-built models, not cloud models packaged for local execution.",
    "Rather than depending on a cloud connection, the system can operate locally, isolated from external networks: the same architectural approach required for a spacecraft operating months or years from Earth.",
  ],
  diagram: {
    title: "How E.L.S.A. works with no link to Earth",
    desc: "Inside the ship, a closed amber loop carries the crew's conversation: hear, then reason, then speak. No line leaves it. Reaching the ship from far off to the right is a single thin blue line from Earth, marked eighty minutes, and it ends on the speak node itself, entering the loop at exactly that point. What arrives over it is words, which the ship then says aloud in a voice it already carries.",
    ship: "Inside the ship",
    line: "The line to Earth",
    nodes: ["hear", "reason", "speak"],
    delay: "80 minutes",
    earth: "Earth",
    /**
     * Annotations sit on the drawing rather than in cards beside it, so the
     * diagram explains itself. Pre-broken into lines because SVG text does not
     * wrap: the wide and narrow frames need different break points, which is
     * layout rather than copy, but the words are identical in both.
     */
    shipNote: ["The crew just talks.", "Voice in, voice out, instant.", "Nothing ever leaves the hull."],
    lineNote: [
      "What crosses is words, not audio.",
      "The ship speaks them in a voice it already carries.",
    ],
    lineNoteNarrow: [
      "What crosses is words, not audio.",
      "The ship speaks them in a voice",
      "it already carries.",
    ],
  },
} as const;

/* ================================================================== *
 * CAPABILITY MAP
 * ================================================================== */
export const CAPABILITIES = {
  eyebrow: "The stack",
  heading: "Six mission requirements. Six models that already ship.",
  intro:
    "Nothing here is a roadmap request. Every capability this concept depends on is available today, which is the reason it is worth building rather than writing about.",
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
    "A pressurised glove. A committed pair of eyes. An eighty-minute silence where Mission Control used to be. Someone at 03:00, further from home than anyone in history, who needs to be told the truth in a voice that does not make it worse. In that room, voice is not the best interface. It is the only one, and its quality is a safety property.",
    "Every capability that room requires already exists in your stack today: Flash for latency, v3 for certifiable delivery, Scribe for who-said-what, cloning for the voice of someone 1.44 billion kilometres away. E.L.S.A. is what those pieces look like pointed at the hardest environment humans operate in.",
  ],
  next: {
    heading: "What I would build next",
    items: [
      "A register-conformance test suite: given an alert class, assert that synthesised delivery falls inside a certified prosodic envelope. Prosody you can regression-test.",
      "An offline-first voice pack format: enrolled family voices bundled, versioned and verified for vehicles with no reliable link.",
      "Latency budgeting for the full hear-reason-speak loop under degraded compute, with graceful register fallback when the expressive model is unavailable.",
    ],
  },
  signoff: "Thanks for reading this far.",
} as const;
