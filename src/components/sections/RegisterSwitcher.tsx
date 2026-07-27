"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DEMO_REGISTER } from "@/lib/content";
import { useElsaVoice } from "@/lib/use-elsa-voice";

/**
 * The same eleven words, four ways.
 *
 * The interaction *is* the argument: you hear the difference before you read why
 * it matters. Only "calm authority" is marked correct, and the reason given is
 * an engineering one — urgency that induces panic costs the crew the fine motor
 * control they need to run the checklist.
 */
export function RegisterSwitcher() {
  // Widened explicitly: the content module is `as const`, so inference would
  // narrow this to the first delivery's literal id.
  const [selected, setSelected] = useState<string>(DEMO_REGISTER.deliveries[0].id);
  const { speak, stop, isSpeaking, isLoading, progress, configured } = useElsaVoice();
  const reduce = useReducedMotion();

  const active = DEMO_REGISTER.deliveries.find((d) => d.id === selected) ?? DEMO_REGISTER.deliveries[0];

  const play = (id: string) => {
    setSelected(id);
    const delivery = DEMO_REGISTER.deliveries.find((d) => d.id === id);
    if (delivery) void speak(DEMO_REGISTER.sentence, delivery.register, true);
  };

  return (
    <div className="hull-panel rounded-sm p-6 sm:p-9">
      <p className="tel mb-5">The words are identical in all four</p>

      {/* The sentence, with playback position running through it. */}
      <p className="relative font-display text-2xl leading-snug text-paper sm:text-3xl md:text-[2.1rem]">
        {DEMO_REGISTER.sentence}
        <motion.span
          aria-hidden
          className="absolute -bottom-2 left-0 h-px w-full origin-left bg-elsa"
          style={{ scaleX: isSpeaking ? progress : 0 }}
          transition={reduce ? { duration: 0 } : undefined}
        />
      </p>

      <div className="mt-11 grid gap-2.5 sm:grid-cols-2">
        {DEMO_REGISTER.deliveries.map((delivery) => {
          const isSelected = delivery.id === selected;
          return (
            <button
              key={delivery.id}
              type="button"
              onClick={() => play(delivery.id)}
              aria-pressed={isSelected}
              className={`group cursor-pointer rounded-sm border p-4 text-left transition-colors ${
                isSelected
                  ? "border-elsa/70 bg-elsa/[0.07]"
                  : "border-seam hover:border-seam-lit hover:bg-panel/60"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span
                  className={`text-[0.95rem] font-medium ${isSelected ? "text-elsa-hot" : "text-paper/85"}`}
                >
                  {delivery.name}
                </span>
                {delivery.recommended ? (
                  <span className="tel shrink-0 !text-[9px] !tracking-[0.14em] !text-elsa">
                    certify this
                  </span>
                ) : null}
              </span>
              <span className="mt-1.5 block text-[0.8rem] leading-snug text-muted">
                {delivery.summary}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-4 border-t border-seam pt-7">
        <button
          type="button"
          onClick={() => (isSpeaking || isLoading ? stop() : play(selected))}
          className="tel cursor-pointer rounded-full border border-elsa/50 px-4 py-2 transition-colors hover:border-elsa hover:text-elsa"
        >
          {isLoading ? "Synthesising" : isSpeaking ? "Stop" : `Hear it: ${active.name}`}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={active.id}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-7 max-w-[62ch] text-[0.95rem] leading-[1.7] text-muted"
        >
          {active.analysis}
        </motion.p>
      </AnimatePresence>

      {configured === false ? (
        <p className="mt-5 font-mono text-[11px] leading-relaxed text-faint">
          Silent mode. The four registers are being paced identically, so the difference is not
          audible yet. Connected to eleven_v3, each one carries its own audio tag and the contrast is
          the point of this section.
        </p>
      ) : null}
    </div>
  );
}
