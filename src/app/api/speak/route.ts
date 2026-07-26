import { synthesise, getConfig, type Register } from "@/lib/elevenlabs";

/**
 * POST /api/speak
 *
 * Body: { text: string, register?: Register, expressive?: boolean }
 *
 * Returns audio/mpeg on success. When the deployment has no ElevenLabs
 * credentials it returns 503 with `{ configured: false }`, which the client
 * treats as "render silently" rather than as an error. That contract is what
 * lets the site ship complete today and gain audio later with no code change.
 */
export async function POST(request: Request) {
  const { canSpeak } = getConfig();

  if (!canSpeak) {
    return Response.json(
      {
        configured: false,
        reason:
          "ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID are not set. Playback is running in silent mode.",
      },
      { status: 503 },
    );
  }

  let payload: { text?: unknown; register?: unknown; expressive?: unknown };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const text = typeof payload.text === "string" ? payload.text.trim() : "";
  if (!text) {
    return Response.json({ error: "`text` is required." }, { status: 400 });
  }
  // Bound the request so a public deployment can't be used as a free TTS proxy.
  if (text.length > 1200) {
    return Response.json({ error: "`text` exceeds 1200 characters." }, { status: 413 });
  }

  try {
    const stream = await synthesise({
      text,
      register: (payload.register as Register) || "warm",
      expressive: payload.expressive === true,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Synthesis failed.";
    return Response.json({ error: message }, { status: 502 });
  }
}
