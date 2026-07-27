"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EXCHANGES, type Exchange } from "@/lib/content";
import { useElsaVoice } from "@/lib/use-elsa-voice";
import { VoiceOrb } from "@/components/ui/VoiceOrb";

/**
 * The conversation surface.
 *
 * Framed as a 3 a.m. exchange inside the story rather than as a product demo —
 * the questions are the crew's, not a feature list. One shared voice instance
 * drives both the orb and the word-by-word reveal, so audio and visuals can
 * never drift apart.
 */
export function AskHer() {
  const [active, setActive] = useState<Exchange | null>(null);
  const { speak, stop, isSpeaking, isLoading, progress, levelRef, configured } = useElsaVoice();
  const reduce = useReducedMotion();

  const ask = (exchange: Exchange) => {
    setActive(exchange);
    void speak(exchange.reply, exchange.register);
  };

  const words = active ? active.reply.split(" ") : [];
  const litCount = isSpeaking ? Math.round(progress * words.length) : words.length;

  return (
    <div className="hull-panel rounded-sm p-6 sm:p-9">
      <div className="flex flex-col gap-9 sm:flex-row sm:items-start sm:gap-10">
        {/* Her presence. Light, never a face. */}
        <div className="relative mx-auto shrink-0 sm:mx-0">
          <VoiceOrb levelRef={levelRef} active={isSpeaking} size={148} spokes={72} />
          <span className="tel absolute inset-x-0 -bottom-1 text-center !text-[9px]">
            {isLoading ? "Synthesising" : isSpeaking ? "Speaking" : "Listening"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.chip}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.34 }}
              >
                <p className="tel mb-4 !text-telemetry">Commander: {active.prompt}</p>
                <p className="spoken text-lg leading-relaxed sm:text-xl md:text-[1.4rem]">
                  {words.map((word, i) => (
                    <span
                      key={`${word}-${i}`}
                      className="transition-opacity duration-200"
                      style={{ opacity: i < litCount ? 1 : 0.34 }}
                    >
                      {word}
                      {i < words.length - 1 ? " " : ""}
                    </span>
                  ))}
                </p>
                {isSpeaking ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="tel mt-5 cursor-pointer transition-colors hover:text-elsa"
                  >
                    Stop
                  </button>
                ) : null}
              </motion.div>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-muted"
              >
                She is always listening, and never needs waking. Pick a question the crew would
                actually ask.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-9 flex flex-wrap gap-2.5 border-t border-seam pt-7">
        {EXCHANGES.map((exchange) => {
          const isActive = active?.chip === exchange.chip;
          return (
            <button
              key={exchange.chip}
              type="button"
              onClick={() => ask(exchange)}
              aria-pressed={isActive}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "border-elsa/70 bg-elsa/10 text-elsa-hot"
                  : "border-seam-lit text-muted hover:border-elsa/50 hover:text-paper"
              }`}
            >
              {exchange.chip}
            </button>
          );
        })}
      </div>

      {configured === false ? (
        <p className="mt-5 font-mono text-[11px] leading-relaxed text-faint">
          Silent mode. No ElevenLabs voice is connected yet, so her replies are paced rather than
          spoken. The transcript, the orb and the timing are all real; only the audio is missing.
        </p>
      ) : null}
    </div>
  );
}
