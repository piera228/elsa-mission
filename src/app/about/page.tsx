import Link from "next/link";
import type { Metadata } from "next";
import { Starfield } from "@/components/ui/Starfield";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the project · E.L.S.A.",
  description:
    "How E.L.S.A. was built: the stack, the two API routes behind the live voice agent, its inspiration in TARS from Interstellar, and the vision of voice AI reaching deep-space missions.",
};

/** Inline code: model ids, routes, CSS properties. */
function Mono({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-[0.9em] text-elsa-deep">{children}</code>;
}

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
              E.L.S.A., short for Eleven Labs Stellar Assistant, is an independent concept: a case that a
              human-sounding voice isn&apos;t just a convenience, but the interface that matters most
              where a crew is hands-full, eyes-forward, and years from home.
            </p>
          </div>

          <Block title="The vision">
            <p>
              Most voice AI is sold for the living room, a faster way to do something a screen
              already does. E.L.S.A. imagines the opposite: the place where a voice becomes
              essential. On a long-duration mission, a calm, trusted, instant voice is worth more
              than any display.
            </p>
            <p>
              The vision behind this project is simple. ElevenLabs&apos; voices belong not only
              in podcasts and apps, but on the flight deck of a deep-space mission, as the human
              voice from home.
            </p>
          </Block>

          <Block title="The inspiration">
            <p>
              The spark was TARS, the voice-driven machine from <em>Interstellar</em>. Proof of how
              much presence a voice alone can carry. But E.L.S.A. deliberately goes further in one
              direction: it is never given a body or a face. No robot, no avatar, no screen
              character, only light and sound. A voice-first idea gets weaker the moment it has
              something to look at.
            </p>
          </Block>

          <Block title="What it is made of">
            <p>
              A Next.js 16 app on the App Router, React 19, Tailwind v4 and{" "}
              <Mono>motion</Mono>, deployed on Vercel. The landing page prerenders as static; the
              only server code is two API routes, and neither one holds state.
            </p>
            <p>
              One rule governs every design choice: amber light is E.L.S.A.&apos;s voice, cold blue
              is instrumentation, and E.L.S.A. is never given a face. Light and sound only. Even the
              interface sounds are homemade. The ticks that play as text decodes in are synthesised
              live in the browser with the Web Audio API, and the power-up on
              &quot;Initialize&quot; is a short generated cue.
            </p>
            <p>
              Scroll reveals are CSS rather than JavaScript, using{" "}
              <Mono>animation-timeline: view()</Mono>. Content is visible by default and the
              animation only adds to it, so a browser without support, or a script that fails to
              run, still shows a complete page. The cover film is desktop-only and is never mounted
              under <Mono>prefers-reduced-motion</Mono>, which the whole site honours.
            </p>
          </Block>

          <Block title="The API, and what actually runs">
            <p>
              <Mono>/api/conversation-token</Mono> mints a short-lived token from{" "}
              <Mono>/v1/convai/conversation/token</Mono> and hands it to the browser. The API key
              never reaches the client. &quot;Talk live&quot; then opens a real two-way conversation
              over WebRTC against an ElevenAgents agent: <Mono>Gemini 2.5 Flash</Mono> reasons about
              what you say, <Mono>eleven_v3_conversational</Mono> speaks the reply, and expressive
              mode, on by default with that voice, tunes the delivery. You speak; E.L.S.A. answers,
              live.
            </p>
            <p>
              <Mono>/api/speak</Mono> is the second path: a server-side call to{" "}
              <Mono>/v1/text-to-speech</Mono> that streams MP3 back, with per-register voice
              settings so the same sentence can be calm, urgent or warm. Every voice surface calls
              one hook rather than the route directly, and that hook is written so the absence of a
              key is a designed state, not an error. Without credentials it paces the reply from the
              word count and synthesises a speech-shaped envelope, so the transcript, the waveform
              and the timing all still behave. No component ever branches on whether a key exists.
            </p>
            <p>
              The scripted exchanges and the three recordings in the voice manifest are pre-rendered
              audio files served from the site, so a polished take always lands and the page costs
              nothing to load until you press play.
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
            <p>
              The source is on{" "}
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-paper underline decoration-seam-lit underline-offset-4 transition-colors hover:text-elsa hover:decoration-elsa"
              >
                GitHub
              </a>
              .
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
