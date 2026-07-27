import { PERSONALIZE } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";

const M = PERSONALIZE.manifest;

/**
 * "Chosen before launch" — three cards under a pre-flight document header.
 *
 * The header and the footers keep the bureaucratic frame; everything between
 * them is a person. That contrast is the whole design: an official form with
 * one irreplaceable thing on it.
 *
 * Card hierarchy, in order down the card: the name largest, in display serif,
 * because it is the only thing on the card anyone chose. The relationship
 * small, lowercase and cold, because it is administration. The human line
 * quiet, in the middle, with air above it. The date, place and consent
 * smallest, monospaced, ruled off at the bottom edge.
 *
 * Three across rather than four means each card has more room; that room is
 * spent on vertical space around the name, not on more words. All three are
 * styled identically — no emphasis on any one — so the reader compares the
 * three people rather than being told which matters.
 *
 * They stack below `md` rather than `sm`: at 640px three columns leave the
 * names wrapping and the human lines breaking every three words, which is
 * exactly the crowding the extra width was meant to buy off.
 *
 * Server component, no JS.
 */
export function Personalize() {
  return (
    <Section id="personalize" className="!pt-0 !pb-4 sm:!pb-6">
      <SectionTitle eyebrow={PERSONALIZE.eyebrow} heading={PERSONALIZE.heading} />

      <Reveal className="mb-14 max-w-[68ch] space-y-6 text-[1.0625rem] leading-[1.72] text-muted sm:mb-16 sm:text-lg">
        {PERSONALIZE.body.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
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
        {M.entries.map((entry) => (
          <Reveal key={entry.name} className="bg-hull">
            <div className="flex h-full flex-col p-8 sm:p-9 lg:p-10">
              <h3 className="font-display text-3xl leading-none text-paper sm:text-[2rem]">
                {entry.name}
              </h3>

              {/*
                No `lowercase` utility here. The values are already lowercase
                where they should be, and forcing it flattened "Mission
                Control" to "mission control" — which is the one word on this
                card that has to read as a place on Earth.
              */}
              <p className="mt-4 font-mono text-[0.75rem] leading-[1.6] tracking-[0.04em] text-telemetry">
                {entry.relationship}
              </p>

              <p className="mt-9 flex-1 text-[1.0625rem] leading-[1.7] text-paper/85">
                {entry.line}
              </p>

              <p className="mt-10 border-t border-seam pt-4 font-mono text-[0.625rem] uppercase leading-[1.6] tracking-[0.16em] text-muted">
                {entry.footer}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Two lines, the second stepped down, with air around both. */}
      <Reveal className="mt-16 sm:mt-20">
        <p className="font-display text-xl leading-[1.5] text-paper/90 sm:text-2xl">
          {PERSONALIZE.closing[0]}
        </p>
        <p className="mt-4 text-[0.9375rem] leading-[1.7] text-muted sm:text-base">
          {PERSONALIZE.closing[1]}
        </p>
      </Reveal>
    </Section>
  );
}
