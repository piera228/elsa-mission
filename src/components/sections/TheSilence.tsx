import { THE_SILENCE } from "@/lib/content";
import { MISSION } from "@/lib/site";
import { DriftField } from "@/components/ui/DriftField";
import { StaggerReveal, StaggerItem } from "@/components/novel/StaggerReveal";
import { DecodeText } from "@/components/novel/DecodeText";

/**
 * "The Silence" — a cinematic title card, framed as an incoming transmission.
 *
 * Console-framed, not card-framed: the message sits in a left-aligned readout
 * with a log-style header and a telemetry prompt gutter, so the section reads
 * like something arriving on an onboard console.
 *
 * Colour follows the site invariant strictly. Instrumentation (header, gutter,
 * grid) is cold telemetry; the message itself is warm cream; amber is reserved
 * for the cursor and the CTA, the only parts that are genuinely E.L.S.A. Cold
 * chrome framing a warm human message is the site's whole argument, in one
 * section. Her words stay serif/cream — never monospace.
 */
export function TheSilence() {
  const lastIndex = THE_SILENCE.body.length - 1;

  return (
    <section
      id="the-silence"
      className="relative isolate z-10 overflow-hidden py-[12vh] sm:pb-[15vh] sm:pt-[20vh]"
    >
      <DriftField />

      {/*
        Faint instrument grid, flickering like an unstable display. Masked away
        from the text so the section reads as a void with peripheral
        instrumentation, not as a wireframe panel. Focal point leans left to
        follow the now left-aligned message.
      */}
      <div
        aria-hidden
        className="grid-etch animate-flicker pointer-events-none absolute inset-0 opacity-40"
        style={{
          maskImage:
            "radial-gradient(ellipse 58% 54% at 38% 50%, transparent 0%, rgba(0,0,0,0.25) 62%, #000 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 58% 54% at 38% 50%, transparent 0%, rgba(0,0,0,0.25) 62%, #000 100%)",
        }}
      />

      {/* Deepens the void behind the text and holds the grid and drift off the words. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 38% 50%, rgba(5,6,8,0.94) 0%, rgba(5,6,8,0.66) 55%, transparent 100%)",
        }}
      />

      <StaggerReveal className="relative mx-auto flex w-full max-w-6xl flex-col items-start px-5 text-left sm:px-8">
        <StaggerItem delay={0} className="mb-9 w-full">
          <TransmissionHeader />
        </StaggerItem>

        {/* Prompt gutter: a single telemetry hairline running down the message. */}
        <StaggerItem delay={0.15} className="w-full">
          <div className="border-l border-telemetry-dim/35 pl-5 sm:pl-7">
            <h2 className="font-display text-[clamp(1.7rem,4.6vw,3.15rem)] leading-[1.16] text-paper">
              <DecodeText text={THE_SILENCE.headline} />
            </h2>

            <div className="mt-10 w-full space-y-6">
              {THE_SILENCE.body.map((paragraph, i) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-[1rem] leading-[1.8] text-paper/75 sm:text-[1.1rem]"
                >
                  {paragraph}
                  {/* Live cursor, only after the closing line. */}
                  {i === lastIndex ? (
                    <span
                      aria-hidden
                      className="cursor-blink ml-2 inline-block h-[0.95em] w-[0.5em] translate-y-[0.1em] bg-elsa align-baseline"
                    />
                  ) : null}
                </p>
              ))}
            </div>
          </div>
        </StaggerItem>

        <StaggerItem delay={0.5} className="mt-14 pl-5 sm:pl-7">
          {/*
            Plain anchor; `scroll-behavior: smooth` on <html> makes it smooth for
            free, keyboard operable, and it still works with no JavaScript. The
            reduced-motion block in globals.css switches it to an instant jump.
            Bracketed like a console command — brackets are telemetry, the
            command text is amber (hers).
          */}
          <a
            href={`#${THE_SILENCE.ctaTarget}`}
            className="group inline-flex items-center gap-3 rounded-sm border border-elsa/45 bg-elsa/[0.06] px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-elsa transition-all duration-300 hover:border-elsa hover:bg-elsa/[0.12] hover:shadow-[0_0_30px_-6px_var(--color-elsa)] focus-visible:border-elsa focus-visible:outline-none sm:text-[0.8125rem]"
          >
            <span
              aria-hidden
              className="signal-pulse block h-2 w-2 shrink-0 rounded-full bg-elsa"
            />
            <span>{THE_SILENCE.cta}</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </StaggerItem>
      </StaggerReveal>
    </section>
  );
}

/**
 * Console log header: a pulsing carrier dot, the transmission label, a hairline
 * that runs to the edge, and a metadata line reading like a decoded packet. All
 * cold telemetry — figures come from MISSION so they cannot drift.
 */
function TransmissionHeader() {
  const meta = [
    "SRC: EARTH",
    `OWLT ${MISSION.owltMinutes}:00`,
    `CREW ${MISSION.crew}`,
    "CH-01",
  ].join("  ·  ");

  return (
    <div className="w-full font-mono">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="signal-pulse block h-1.5 w-1.5 rounded-full bg-telemetry"
        />
        <span className="tel !text-telemetry-dim">{THE_SILENCE.transmissionLabel}</span>
        <span aria-hidden className="h-px flex-1 bg-telemetry-dim/25" />
      </div>
      <p className="mt-2.5 pl-[1.125rem] text-[0.625rem] uppercase tracking-[0.2em] text-telemetry-dim/60 sm:text-[0.6875rem]">
        {meta}
      </p>
    </div>
  );
}
