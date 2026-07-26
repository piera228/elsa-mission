"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useElsaVoice } from "@/lib/use-elsa-voice";
import type { Register } from "@/lib/elevenlabs";

/**
 * A line spoken by E.L.S.A. Always serif, always warm, always clickable.
 *
 * Words illuminate in step with playback — driven by real audio position when a
 * key is configured, and by word-rate pacing when it isn't. The visual result is
 * identical either way, which is what lets the site ship complete without
 * credentials.
 */
export function ElsaLine({
  children,
  register = "warm",
  size = "md",
  className,
}: {
  children: string;
  register?: Register;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const { speak, stop, isSpeaking, isLoading, progress, configured } = useElsaVoice();
  const reduce = useReducedMotion();
  const words = children.split(" ");

  const sizes = {
    sm: "text-lg sm:text-xl",
    md: "text-xl sm:text-2xl md:text-3xl",
    lg: "text-2xl sm:text-3xl md:text-4xl",
    xl: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
  } as const;

  // How far through the line playback has reached, in words.
  const litCount = isSpeaking ? Math.round(progress * words.length) : 0;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => (isSpeaking || isLoading ? stop() : speak(children, register))}
        aria-label={isSpeaking ? "Stop playback" : `Hear E.L.S.A. say: ${children}`}
        className="group block w-full cursor-pointer text-left"
      >
        <p className={`spoken ${sizes[size]} text-balance`}>
          {words.map((word, i) => {
            const lit = isSpeaking && i < litCount;
            return (
              <span
                key={`${word}-${i}`}
                className="transition-colors duration-200"
                style={{
                  color: lit ? "var(--color-elsa-hot)" : undefined,
                  opacity: isSpeaking ? (lit ? 1 : 0.42) : 1,
                }}
              >
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>

        <span className="mt-3 flex items-center gap-2.5">
          <SpeakIcon active={isSpeaking} loading={isLoading} reduce={Boolean(reduce)} />
          <span className="tel transition-colors group-hover:text-elsa">
            {isLoading ? "Synthesising" : isSpeaking ? "Speaking" : "Hear her say it"}
          </span>
        </span>
      </button>

      {/* Only shown once the user has actually tried to play something. */}
      {configured === false ? <SilentNote /> : null}
    </div>
  );
}

function SpeakIcon({
  active,
  loading,
  reduce,
}: {
  active: boolean;
  loading: boolean;
  reduce: boolean;
}) {
  const bars = [0, 1, 2, 3, 4];
  // At rest the bars form a small static waveform, so the icon reads as sound
  // rather than as an ellipsis.
  const restHeight = (b: number) => 4 + (2 - Math.abs(b - 2)) * 3;

  return (
    <span aria-hidden className="flex h-3.5 items-end gap-[3px]">
      {bars.map((b) => (
        <motion.span
          key={b}
          className="w-[2px] rounded-full bg-elsa"
          initial={{ height: restHeight(b) }}
          animate={
            active && !reduce
              ? { height: [restHeight(b), 14 - Math.abs(b - 2) * 2, restHeight(b)] }
              : { height: loading ? 8 : restHeight(b) }
          }
          transition={
            active && !reduce
              ? { duration: 0.62, repeat: Infinity, delay: b * 0.09, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        />
      ))}
    </span>
  );
}

/**
 * Honest disclosure when no ElevenLabs key is present. Deliberately quiet — it
 * explains the silence rather than apologising for it.
 */
function SilentNote() {
  const [visible, setVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timer.current = setTimeout(() => setVisible(false), 9000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <p className="mt-2 max-w-md font-mono text-[11px] leading-relaxed text-faint">
      Silent mode — no ElevenLabs voice is connected to this deployment yet, so the line is being
      paced rather than spoken. Add a key and this becomes her actual voice.
    </p>
  );
}
