/**
 * ElevenLabs adapter — server side.
 *
 * The site is designed to be complete without credentials. Every audio surface
 * degrades to a silent, fully-usable state (see `useElsaVoice`), so this module
 * is allowed to be entirely absent at runtime without breaking a single page.
 *
 * When a key is added, nothing else in the codebase changes: components already
 * call `/api/speak`, and this file starts answering with audio instead of 503.
 *
 * Env vars (all optional, see .env.example):
 *   ELEVENLABS_API_KEY        — server-only, never exposed to the client
 *   ELEVENLABS_VOICE_ID       — the voice designed for E.L.S.A.
 *   ELEVENLABS_AGENT_ID       — an ElevenAgents agent, for the live conversation
 */

const API_BASE = "https://api.elevenlabs.io/v1";

/** Model ids verified against https://elevenlabs.io/docs/overview/models (July 2026). */
export const MODEL_IDS = {
  /** ~75 ms to first byte, 32 languages. The right default for a live assistant. */
  realtime: "eleven_flash_v2_5",
  /** 70+ languages, supports inline audio tags for delivery control. */
  expressive: "eleven_v3",
} as const;

export type Register = "warm" | "calm" | "candid" | "steady" | "urgent" | "clinical";

/**
 * Voice settings per delivery register.
 *
 * This is the concrete form of the site's central argument: register is a
 * specifiable parameter, not an accident of the recording session. Lower
 * `style` and higher `stability` produce the flatter, unhurried delivery you
 * want when a crew member needs their hands steady.
 */
export const REGISTER_SETTINGS: Record<
  Register,
  { stability: number; similarity_boost: number; style: number; audioTag: string }
> = {
  calm: { stability: 0.85, similarity_boost: 0.75, style: 0.15, audioTag: "[calm]" },
  steady: { stability: 0.7, similarity_boost: 0.75, style: 0.25, audioTag: "[measured]" },
  warm: { stability: 0.45, similarity_boost: 0.8, style: 0.55, audioTag: "[softly]" },
  candid: { stability: 0.5, similarity_boost: 0.75, style: 0.45, audioTag: "[thoughtful]" },
  urgent: { stability: 0.3, similarity_boost: 0.7, style: 0.8, audioTag: "[urgent]" },
  clinical: { stability: 1.0, similarity_boost: 0.6, style: 0.0, audioTag: "[flat]" },
};

export function getConfig() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  return {
    apiKey,
    voiceId: process.env.ELEVENLABS_VOICE_ID,
    agentId: process.env.ELEVENLABS_AGENT_ID,
    /** True only when we can actually synthesise speech. */
    canSpeak: Boolean(apiKey && process.env.ELEVENLABS_VOICE_ID),
    canConverse: Boolean(apiKey && process.env.ELEVENLABS_AGENT_ID),
  };
}

export type SpeakOptions = {
  text: string;
  register?: Register;
  /** Use the expressive model when delivery matters more than latency. */
  expressive?: boolean;
};

/**
 * Streams synthesised speech back as an MP3 body.
 * Throws with a readable message so the route can surface it verbatim.
 */
export async function synthesise({
  text,
  register = "warm",
  expressive = false,
}: SpeakOptions): Promise<ReadableStream<Uint8Array>> {
  const { apiKey, voiceId } = getConfig();
  if (!apiKey || !voiceId) {
    throw new Error("ElevenLabs is not configured on this deployment.");
  }

  const settings = REGISTER_SETTINGS[register] ?? REGISTER_SETTINGS.warm;

  // eleven_v3 honours inline audio tags; flash does not, so we only prepend
  // the tag when we're actually routing to the expressive model.
  const body = expressive ? `${settings.audioTag} ${text}` : text;

  const res = await fetch(
    `${API_BASE}/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: body,
        model_id: expressive ? MODEL_IDS.expressive : MODEL_IDS.realtime,
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarity_boost,
          style: settings.style,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `ElevenLabs returned ${res.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`,
    );
  }

  return res.body;
}

/**
 * Mints a short-lived token so the browser can open a WebRTC session with an
 * ElevenAgents agent without ever seeing the API key.
 * Used by the live "Talk to E.L.S.A." surface once an agent exists.
 */
export async function mintConversationToken(): Promise<string> {
  const { apiKey, agentId } = getConfig();
  if (!apiKey || !agentId) {
    throw new Error("No ElevenAgents agent is configured on this deployment.");
  }

  const res = await fetch(
    `${API_BASE}/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`,
    { headers: { "xi-api-key": apiKey } },
  );

  if (!res.ok) {
    throw new Error(`Could not mint conversation token (${res.status}).`);
  }

  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Token response did not include a token.");
  return data.token;
}
