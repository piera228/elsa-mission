"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import consoleArt from "../../../public/scenes/elsa-console.png";
import { TALK, EXCHANGES, type Exchange } from "@/lib/content";
import { useElsaVoice } from "@/lib/use-elsa-voice";
import { Section, SectionTitle } from "@/components/novel/Chrome";
import { SceneGrain } from "@/components/novel/SceneCanvas";
import { Waveform } from "@/components/ui/Waveform";
import { LiveTalk } from "./LiveTalk";
import { bootSound } from "@/lib/type-sound";

// The tallest prompt + reply across all exchanges. Rendered invisibly as a
// height spacer so the transcript panel is sized to the longest exchange and
// never resizes when you switch questions.
const LONGEST_PROMPT = EXCHANGES.reduce((a, b) => (b.prompt.length > a.prompt.length ? b : a)).prompt;
const LONGEST_REPLY = EXCHANGES.reduce((a, b) => (b.reply.length > a.reply.length ? b : a)).reply;

/**
 * "Talk to E.L.S.A." — the section the "Initialize E.L.S.A. system" button hands
 * off to (id must equal THE_SILENCE.ctaTarget, "use-case-talk").
 *
 * Left: the cockpit illustration — the crew, and the voice answering them.
 * Right: the console. One shared `useElsaVoice()` drives the amber waveform and
 * the word-by-word transcript, so audio and visuals can never drift. With no
 * ElevenLabs key the hook paces replies and synthesises the amplitude, so the
 * waveform pulses today; adding the key later turns on real audio with no change
 * here (invariant #5 — components never branch on credentials).
 */
export function TalkToElsa() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Exchange | null>(null);
  const [phase, setPhase] = useState<"idle" | "question" | "answer">("idle");
  const seqRef = useRef(0);
  const { speak, playUrl, stop, isSpeaking, isLoading, levelRef } = useElsaVoice();
  const reduce = useReducedMotion();

  // Hidden until the "Initialize E.L.S.A. system" button (href="#use-case-talk")
  // sets the hash. Listening to the hash keeps that button (in TheSilence) and
  // this section decoupled — no shared state threaded through the tree.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#use-case-talk") setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  // Once mounted, bring it into view — while it was unmounted the anchor jump had
  // nothing to land on.
  useEffect(() => {
    if (!open) return;
    bootSound();
    document
      .getElementById("use-case-talk")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [open, reduce]);

  // Play the recorded exchange: the crew's question, then E.L.S.A.'s answer. The
  // seq guard means a second click supersedes the first mid-sequence.
  const ask = async (exchange: Exchange) => {
    const seq = (seqRef.current += 1);
    setActive(exchange);

    if (exchange.answerAudio) {
      if (exchange.questionAudio) {
        setPhase("question");
        await playUrl(exchange.questionAudio);
        if (seq !== seqRef.current) return;
      }
      setPhase("answer");
      await playUrl(exchange.answerAudio);
      if (seq !== seqRef.current) return;
      setPhase("idle");
    } else {
      // No recording — fall back to the hook's paced silent mode.
      setPhase("answer");
      void speak(exchange.reply, exchange.register);
    }
  };

  const handleStop = () => {
    seqRef.current += 1;
    stop();
    setPhase("idle");
  };

  if (!open) return null;

  return (
    <Section id="use-case-talk" className="!pb-4 sm:!pb-6">
      {/* Amber power-surge behind the content. */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background:
              "radial-gradient(60% 55% at 50% 42%, rgba(255,176,103,0.20), transparent 72%)",
          }}
        />
      ) : null}

      {/* The console is opened top-to-bottom by a scan line, like an x-ray: the
          content is clipped shut, and the beam reveals it as it sweeps down. */}
      <motion.div
        className="relative z-10"
        initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <SectionTitle eyebrow={TALK.eyebrow} heading={TALK.heading} intro={TALK.intro} />

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          {/* Left — the square illustration; the console is kept compact enough to
              sit within it, so both columns end up the same (square) size. */}
          <div className="lg:h-full">
            <figure className="relative aspect-square overflow-hidden rounded-sm border border-seam lg:aspect-auto lg:h-full">
            <Image
              src={consoleArt}
              alt="A lone astronaut at the cockpit console at ship's night, Saturn in the window, E.L.S.A.'s voice rising from the console as an amber waveform of light."
              placeholder="blur"
              fill
              sizes="(min-width: 1024px) 44rem, 100vw"
              className="object-cover"
            />
            <SceneGrain />
          </figure>
          </div>

        {/* Right — the console. */}
        <div className="lg:h-full">
          <div className="hull-panel flex h-full flex-col rounded-sm p-5 sm:p-6">
            {/* Waveform + status */}
            <div>
              <Waveform
                levelRef={levelRef}
                active={isSpeaking}
                tone={phase === "question" ? "crew" : "elsa"}
                height={72}
              />
              <span className="tel mt-2 block text-center !text-[9px]">
                {phase === "question"
                  ? "Commander"
                  : isSpeaking
                    ? "E.L.S.A."
                    : isLoading
                      ? "Connecting"
                      : "Listening"}
              </span>
            </div>

            {/* Transcript — an invisible spacer sized to the longest exchange is
                always present, so the panel height is fixed from the start and
                never changes: not at idle, not on the first click, not when
                switching questions. */}
            <div className="relative mt-6">
              <div aria-hidden className="invisible">
                <p className="tel mb-3">Commander — {LONGEST_PROMPT}</p>
                <p className="spoken text-base leading-relaxed">{LONGEST_REPLY}</p>
                <p className="tel mt-5">Stop</p>
              </div>
              <div className="absolute inset-0 flex flex-col">
                <AnimatePresence mode="wait">
                {active ? (
                  <motion.div
                    key={active.chip}
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.34 }}
                  >
                    <p className="tel mb-3 !text-telemetry">Commander — {active.prompt}</p>
                    {/* Always in the layout so the container height stays fixed;
                        just fades in when she answers, so there's no jump when the
                        question hands off to the answer. */}
                    <p
                      aria-hidden={phase === "question"}
                      className={`spoken text-base leading-relaxed transition-opacity duration-300 ${
                        phase === "question" ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {active.reply}
                    </p>
                    {isSpeaking ? (
                      <button
                        type="button"
                        onClick={handleStop}
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
                    className="my-auto max-w-[44ch] text-[1.0625rem] leading-relaxed text-muted"
                  >
                    {TALK.idle}
                  </motion.p>
                )}
                </AnimatePresence>
              </div>
            </div>

            {/* Prompt chips — the crew's questions, not a feature list. */}
            <div className="mt-6 flex flex-wrap gap-2.5 border-t border-seam pt-6">
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

            <LiveTalk />
          </div>
        </div>
        </div>
      </motion.div>

      {/* The scan line that opens the panel — sweeps down as the clip reveals. */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-20 h-[2px] bg-elsa-hot"
          style={{ boxShadow: "0 0 22px 3px rgba(255,176,103,0.75)" }}
          initial={{ top: "0%", opacity: 0 }}
          animate={{ top: ["0%", "2%", "98%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1, ease: "easeInOut", times: [0, 0.04, 0.96, 1] }}
        />
      ) : null}
    </Section>
  );
}
