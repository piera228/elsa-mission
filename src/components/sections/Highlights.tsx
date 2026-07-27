import { HIGHLIGHTS } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";

/**
 * Mission requirements — the specification for a voice that could go with a
 * crew, laid out as a spec sheet rather than a feature comparison.
 *
 * Each card is four fields in a fixed order: the capability as a single word,
 * what it means in one line, why the mission needs it, and how it is
 * classified. The order never varies, so the six read as entries in one
 * document rather than six pitches. Nothing else is in the card: the figures,
 * model ids, latency numbers and the ships-today/open-problem marker are all
 * gone, because each of them argued about a product and this section is about
 * a requirement.
 *
 * Hierarchy is built four ways at once so no single one has to carry it —
 * size, typeface, colour temperature and position. The headline is large
 * display serif in paper; the subtitle is small mono caps in cold telemetry
 * blue; the body is sans in muted; the classification is smallest, ruled off,
 * and pinned to the bottom edge.
 *
 * The headline is deliberately NOT amber, which is where the figures used to
 * be. Amber is only ever E.L.S.A.'s voice (invariant #1), and these are
 * requirements the mission sets, not things she says.
 *
 * Generous padding, and the body takes the slack so every classification line
 * sits on the same baseline across a row however long the paragraph above it
 * runs. Server component, no JS; the reveal is additive CSS.
 */
export function Highlights() {
  return (
    <Section id="highlights" className="!pt-0 !pb-4 sm:!pb-6">
      <SectionTitle eyebrow={HIGHLIGHTS.eyebrow} heading={HIGHLIGHTS.heading} />

      <div className="grid gap-px overflow-hidden rounded-sm border border-seam bg-seam sm:grid-cols-2 lg:grid-cols-3">
        {HIGHLIGHTS.items.map((item) => (
          <Reveal key={item.title} className="bg-hull">
            <div className="flex h-full flex-col p-8 sm:p-9 lg:p-10">
              <h3 className="font-display text-3xl leading-none text-paper sm:text-[2.125rem]">
                {item.title}
              </h3>

              {/*
                Tracking is looser than the site's `tel` utility but not by
                much: these are full sentences rather than two-word labels, and
                at 0.18em a sentence in caps stops being readable.
              */}
              <p className="mt-4 font-mono text-[0.6875rem] uppercase leading-[1.7] tracking-[0.1em] text-telemetry">
                {item.subtitle}
              </p>

              <p className="mt-6 flex-1 text-[0.9375rem] leading-[1.75] text-muted">{item.body}</p>

              <p className="mt-9 border-t border-seam pt-4 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted">
                {item.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
