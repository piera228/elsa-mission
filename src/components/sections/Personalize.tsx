"use client";

import { useState } from "react";
import { PERSONALIZE } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";
import { Waveform } from "@/components/ui/Waveform";
import { useElsaVoice } from "@/lib/use-elsa-voice";

const M = PERSONALIZE.manifest;
type Entry = (typeof M.entries)[number];

/**
 * "Chosen before launch" — three cards under a pre-flight document header.
 *
 * The header and the footers keep the bureaucratic frame; everything between
 * them is a person. That contrast is the whole design: an official form with
 * one irreplaceable thing on it.
 *
 * Card hierarchy, in order down the card: the name largest, in display serif,
 * because it is the only thing on the card anyone chose. The relationship
 * small and cold, because it is administration. The human line quiet, in the
 * middle, with air above it. Then the voice itself. Then the date, place and
 * consent smallest, monospaced, ruled off at the bottom edge.
 *
 * Each card can be played. One `useElsaVoice` drives all three, so starting
 * one supersedes another by construction rather than by bookkeeping — the
 * hook's run guard already cancels whatever was playing. Only the card that
 * owns the current playback animates; the other two hold their idle baseline.
 *
 * The waveform is the same one the console uses, and amber, because these
 * recordings ARE her voice — the whole premise is that she speaks in a voice
 * the crew already trusts. Amber here is not decoration, it is invariant #1
 * being observed exactly.
 *
 * Audio lives in `public/voice/manifest/`. If a file is absent the hook's
 * error path resolves like a normal end, so the button returns to rest and
 * nothing breaks; the card is otherwise unaffected.
 */
export function Personalize() {
  const { playUrl, stop, isSpeaking, isLoading, levelRef } = useElsaVoice();
  const [active, setActive] = useState<string | null>(null);

  const toggle = async (entry: Entry) => {
    if (active === entry.name) {
      stop();
      setActive(null);
      return;
    }
    setActive(entry.name);
    await playUrl(entry.audio);
    // Only clear if this playback is still the current one: a click on another
    // card during playback has already moved `active` on.
    setActive((current) => (current === entry.name ? null : current));
  };

  return (
    <Section id="personalize" className="!pt-0 !pb-4 sm:!pb-6">
      <SectionTitle eyebrow={PERSONALIZE.eyebrow} heading={PERSONALIZE.heading} />

      {/* No measure cap: body copy runs the full container width site-wide. */}
      <Reveal className="mb-12 space-y-6 text-[1.0625rem] leading-[1.72] text-muted sm:mb-14 sm:text-lg">
        {PERSONALIZE.body.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </Reveal>

      {/* Hands off to the manifest, so it sits with it rather than with the
          paragraphs above. */}
      <Reveal className="mb-6">
        <p className="text-[1.0625rem] leading-[1.72] text-muted sm:text-lg">{M.intro}</p>
      </Reveal>

      <Reveal>
        {/* Document header. A static marker, not the pulsing one used on live
            consoles elsewhere: this is a record, not a running system. */}
        <div className="mb-5 flex items-center gap-3">
          <span aria-hidden className="block h-1.5 w-1.5 shrink-0 rounded-full bg-telemetry-dim" />
          <span className="tel !text-telemetry">{M.label}</span>
          <span aria-hidden className="h-px flex-1 bg-seam" />
        </div>
      </Reveal>

      <div className="grid gap-px overflow-hidden rounded-sm border border-seam bg-seam md:grid-cols-3">
        {M.entries.map((entry) => {
          const playing = active === entry.name;
          return (
            <Reveal key={entry.name} className="bg-hull">
              <div className="flex h-full flex-col p-8 sm:p-9 lg:p-10">
                <h3 className="font-display text-3xl leading-none text-paper sm:text-[2rem]">
                  {entry.name}
                </h3>

                {/*
                  No `lowercase` utility. The values are already lowercase where
                  they should be, and forcing it flattened proper nouns.
                */}
                <p className="mt-4 font-mono text-[0.75rem] leading-[1.6] tracking-[0.04em] text-telemetry">
                  {entry.relationship}
                </p>

                <p className="mt-9 flex-1 text-[1.0625rem] leading-[1.7] text-paper/85">
                  {entry.line}
                </p>

                <div className="mt-9 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggle(entry)}
                    aria-label={
                      playing ? `Stop ${entry.name}'s voice` : `Play ${entry.name}'s voice`
                    }
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-elsa/45 text-elsa transition-colors duration-300 hover:border-elsa hover:bg-elsa/[0.12] focus-visible:border-elsa focus-visible:outline-none"
                  >
                    {playing ? <StopIcon /> : <PlayIcon />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <Waveform
                      levelRef={levelRef}
                      active={playing && isSpeaking}
                      tone="elsa"
                      height={40}
                      bars={34}
                    />
                  </div>
                </div>

                {/* Reserved so the footer never shifts when the label appears. */}
                <p className="mt-3 h-4 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-telemetry-dim">
                  {playing && isLoading ? "Loading" : playing ? "Playing" : ""}
                </p>

                <p className="mt-6 border-t border-seam pt-4 font-mono text-[0.625rem] uppercase leading-[1.6] tracking-[0.16em] text-muted">
                  {entry.footer}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden fill="currentColor">
      <path d="M1 1.2a.6.6 0 0 1 .92-.5l9 5.8a.6.6 0 0 1 0 1l-9 5.8a.6.6 0 0 1-.92-.5V1.2Z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden fill="currentColor">
      <rect x="0.5" y="0.5" width="10" height="10" rx="1.4" />
    </svg>
  );
}
