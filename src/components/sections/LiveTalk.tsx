"use client";

import { useEffect, useRef, useState } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Waveform } from "@/components/ui/Waveform";

/**
 * Live two-way conversation with the E.L.S.A. ElevenLabs agent.
 *
 * Opens a WebRTC session from a short-lived token minted server-side (the API
 * key never reaches the browser). The amber waveform is driven from the agent's
 * real output volume. `useConversation` (v1.0) must live inside a
 * `ConversationProvider`, so the exported component provides it.
 */
export function LiveTalk() {
  return (
    <ConversationProvider>
      <LiveTalkInner />
    </ConversationProvider>
  );
}

function LiveTalkInner() {
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const levelRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const conversation = useConversation({
    onConnect: () => setError(null),
    onError: (message) => setError(message || "The connection dropped. Try again."),
  });

  const status = conversation.status; // "disconnected" | "connecting" | "connected" | "error"
  const connected = status === "connected";
  const isSpeaking = connected && conversation.isSpeaking;

  // Keep the latest conversation object reachable from the animation loop.
  const convRef = useRef(conversation);
  useEffect(() => {
    convRef.current = conversation;
  });

  // Drive the waveform from the real agent output volume while connected.
  useEffect(() => {
    if (!connected) {
      levelRef.current = 0;
      return;
    }
    const tick = () => {
      let v = 0;
      try {
        v = convRef.current.getOutputVolume() ?? 0;
      } catch {
        v = 0;
      }
      // A touch of gain + a low breathing floor so it never goes fully flat.
      levelRef.current = Math.max(0.04, Math.min(1, v * 1.5));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      levelRef.current = 0;
    };
  }, [connected]);

  const start = async () => {
    setError(null);
    setStarting(true);
    try {
      // Mic permission first — the SDK needs an input stream.
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const res = await fetch("/api/conversation-token");
      if (!res.ok) {
        setError(
          res.status === 503
            ? "Live voice isn't connected yet. Add your ElevenLabs key."
            : "Couldn't start the call. Try again.",
        );
        return;
      }
      const token = (await res.text()).trim();
      conversation.startSession({ conversationToken: token, connectionType: "webrtc" });
    } catch {
      setError("Microphone access is needed to talk live.");
    } finally {
      setStarting(false);
    }
  };

  const end = () => {
    conversation.endSession();
  };

  const connecting = starting || status === "connecting";

  return (
    <div className="mt-5 rounded-sm border border-seam bg-void/40 p-4">
      {connected ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <Waveform levelRef={levelRef} active={isSpeaking} height={64} />
            </div>
            <button
              type="button"
              onClick={end}
              className="tel shrink-0 rounded-full border border-alert/50 px-4 py-2 text-alert transition-colors hover:border-alert hover:bg-alert/10"
            >
              End call
            </button>
          </div>
          <span className="tel !text-elsa">
            {isSpeaking ? "E.L.S.A. speaking" : "Listening, go ahead"}
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={start}
          disabled={connecting}
          className="group inline-flex items-center gap-3 rounded-full border border-elsa/45 bg-elsa/[0.06] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-elsa transition-all duration-300 hover:border-elsa hover:bg-elsa/[0.12] disabled:opacity-60"
        >
          <span
            aria-hidden
            className={`block h-2 w-2 rounded-full bg-elsa ${connecting ? "animate-pulse" : "signal-pulse"}`}
          />
          {connecting ? "Connecting…" : "Talk live to E.L.S.A."}
        </button>
      )}

      {error ? (
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-faint">{error}</p>
      ) : null}
    </div>
  );
}
