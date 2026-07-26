import Link from "next/link";
import type { Metadata } from "next";
import { Starfield } from "@/components/ui/Starfield";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the project — E.L.S.A.",
  description:
    "How E.L.S.A. was built — a live voice agent on ElevenLabs and Gemini — its inspiration in TARS from Interstellar, and the vision of voice AI reaching deep-space missions.",
};

/** A small titled block of prose. */
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="mt-14 border-t border-seam pt-12">
      <h3 className="mb-5 font-display text-2xl text-paper sm:text-3xl">{title}</h3>
      <div className="space-y-6 text-[1.0625rem] leading-[1.72] text-muted sm:text-lg">
        {children}
      </div>
    </Reveal>
  );
}

export default function AboutPage() {
  return (
    <>
      <Starfield />
      <main className="relative">
        <Section id="about">
          <Link
            href="/"
            className="tel inline-flex items-center gap-2 !text-telemetry-dim transition-colors hover:!text-elsa"
          >
            ← Back to E.L.S.A.
          </Link>

          <div className="mt-10">
            <SectionTitle
              eyebrow="About the project"
              heading="A voice built for the vast dark."
            />
            <p className="text-[1.0625rem] leading-[1.72] text-muted sm:text-lg">
              E.L.S.A. — Eleven Labs Stellar Assistant — is an independent concept: a case that a
              human-sounding voice isn&apos;t just a convenience, but the interface that matters most
              where a crew is hands-full, eyes-forward, and years from home.
            </p>
          </div>

          <Block title="The vision">
            <p>
              Most voice AI is sold for the living room — a faster way to do something a screen
              already does. E.L.S.A. imagines the opposite: the place where a voice becomes
              essential. On a long-duration mission, a calm, trusted, instant voice is worth more
              than any display.
            </p>
            <p>
              The vision behind this project is simple — that ElevenLabs&apos; voices belong not only
              in podcasts and apps, but on the flight deck of a deep-space mission, as the human
              voice from home.
            </p>
          </Block>

          <Block title="The inspiration">
            <p>
              The spark was TARS, the voice-driven machine from <em>Interstellar</em> — proof of how
              much presence a voice alone can carry. But E.L.S.A. deliberately goes further in one
              direction: it is never given a body or a face. No robot, no avatar, no screen
              character — only light and sound. A voice-first idea gets weaker the moment it has
              something to look at.
            </p>
          </Block>

          <Block title="How it was built">
            <p>
              The site is a Next.js app (App Router, React 19, Tailwind v4, with the{" "}
              <code className="font-mono text-[0.9em] text-elsa-deep">motion</code>{" "}
              library for animation). One rule governs every design choice: amber light is E.L.S.A.&apos;s voice,
              cold blue is instrumentation — and E.L.S.A. is never given a face. Light and sound only.
            </p>
            <p>
              Even the interface sounds are homemade: the ticks that play as the text decodes in are
              synthesised live in the browser with the Web Audio API, and the power-up on{" "}
              &quot;Initialize&quot; is a short sci-fi cue.
            </p>
          </Block>

          <Block title="Talking to E.L.S.A.">
            <p>
              There are two ways to hear E.L.S.A. The scripted exchanges — the crew&apos;s questions
              and E.L.S.A.&apos;s answers — are voiced with ElevenLabs and played back instantly, so a
              polished take always lands.
            </p>
            <p>
              &quot;Talk live&quot; opens a real, two-way conversation over WebRTC, built on an
              ElevenLabs Agent: a{" "}
              <code className="font-mono text-[0.9em] text-elsa-deep">Gemini 2.5 Flash</code>{" "}
              model reasons about what you say, ElevenLabs&apos;{" "}
              <code className="font-mono text-[0.9em] text-elsa-deep">conversational v3</code>{" "}
              voice speaks the reply, and the delivery is tuned to sound empathetic, warm, patient and
              confident. You speak; E.L.S.A. answers, live.
            </p>
          </Block>

          <Block title="Made with">
            <p>
              Built by{" "}
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-paper underline decoration-seam-lit underline-offset-4 transition-colors hover:text-elsa hover:decoration-elsa"
              >
                Piera Malatrassi
              </a>
              . Illustrations generated with ChatGPT; reasoning by Gemini 2.5 Flash; voice by
              ElevenLabs; development with Claude Code and Kimi 3.
            </p>
          </Block>

          <div className="mt-16">
            <Link
              href="/"
              className="tel inline-flex items-center gap-2 !text-telemetry-dim transition-colors hover:!text-elsa"
            >
              ← Back to E.L.S.A.
            </Link>
          </div>
        </Section>
      </main>
    </>
  );
}
