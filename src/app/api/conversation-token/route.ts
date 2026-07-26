import { mintConversationToken, getConfig } from "@/lib/elevenlabs";

/**
 * GET /api/conversation-token
 *
 * Mints a short-lived WebRTC conversation token for the ElevenLabs agent so the
 * browser can open a live session without ever seeing the API key. Returns the
 * token as plain text, or 503 when no agent/key is configured (the client shows
 * a friendly "live voice not connected" note).
 */
export async function GET() {
  const { canConverse } = getConfig();
  if (!canConverse) {
    return Response.json(
      {
        configured: false,
        reason: "ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID are not set.",
      },
      { status: 503 },
    );
  }

  try {
    const token = await mintConversationToken();
    return new Response(token, {
      headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start the call.";
    return Response.json({ error: message }, { status: 502 });
  }
}
