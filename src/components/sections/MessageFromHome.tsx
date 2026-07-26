"use client";

import { motion, useReducedMotion } from "motion/react";
import { DEMO_HOME } from "@/lib/content";
import { useElsaVoice } from "@/lib/use-elsa-voice";

/**
 * Maya's message, arriving as text and speaking in her own voice.
 *
 * Deliberately not a chart and not a form. The byte count sits in a corner as a
 * quiet fact; the arithmetic that justifies it is in the appendix. This act is
 * meant to be felt, so the only affordance is play.
 */
export function MessageFromHome() {
  const { speak, stop, isSpeaking, isLoading, progress, configured } = useElsaVoice();
  const reduce = useReducedMotion();
  const { message } = DEMO_HOME;

  const bytes = new TextEncoder().encode(message.body).length;
  const words = message.body.split(" ");
  const litCount = isSpeaking ? Math.round(progress * words.length) : words.length;

  return (
    <figure className="hull-panel relative overflow-hidden rounded-sm p-6 sm:p-8">
      {/* Playback progress, along the top edge. */}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-elsa"
        style={{ scaleX: isSpeaking ? progress : 0 }}
        transition={reduce ? { duration: 0 } : undefined}
      />

      <figcaption className="mb-6 flex items-start justify-between gap-6">
        <span>
          <span className="block font-display text-2xl text-elsa-hot">{message.from}</span>
          <span className="tel mt-1 block">{message.relation}</span>
        </span>
        <span className="tel shrink-0 text-right !text-telemetry-dim">
          {bytes} bytes
          <br />
          uplinked as text
        </span>
      </figcaption>

      <blockquote className="text-[1.0625rem] leading-[1.8] text-paper/90 sm:text-lg">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="transition-opacity duration-200"
            style={{ opacity: i < litCount ? 1 : 0.32 }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </blockquote>

      <button
        type="button"
        onClick={() =>
          isSpeaking || isLoading ? stop() : void speak(message.body, "warm", true)
        }
        className="group mt-7 flex cursor-pointer items-center gap-3 border-t border-seam pt-6 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-elsa/50 transition-colors group-hover:border-elsa group-hover:bg-elsa/10">
          {isSpeaking ? (
            <span aria-hidden className="flex h-3 items-center gap-[2px]">
              <span className="h-3 w-[2px] bg-elsa" />
              <span className="h-3 w-[2px] bg-elsa" />
            </span>
          ) : (
            <span
              aria-hidden
              className="ml-[2px] h-0 w-0"
              style={{
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderLeft: "8px solid var(--color-elsa)",
              }}
            />
          )}
        </span>
        <span className="tel transition-colors group-hover:text-elsa">
          {isLoading
            ? "Synthesising"
            : isSpeaking
              ? "Playing — in her voice"
              : "Play in Maya's voice"}
        </span>
      </button>

      {configured === false ? (
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-faint">
          Silent mode. With a cloned voice enrolled, this plays as a seven-year-old actually reading
          it — which is the entire argument of this act.
        </p>
      ) : null}
    </figure>
  );
}
