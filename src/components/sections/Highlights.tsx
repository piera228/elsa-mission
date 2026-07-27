import { HIGHLIGHTS } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";

/**
 * Mission requirements — the bar a voice has to clear at 890 million miles,
 * six points each led by a real figure. Reuses the WhyVoice figure-card grid so
 * it reads as native to the site: amber figure, telemetry-dim unit,
 * seam-divided equal-height cards. Server component, no JS; the reveal is
 * additive CSS.
 *
 * Each card carries a status marker distinguishing what ElevenLabs ships today
 * from what the mission would still need. The marker is deliberately built from
 * the existing telemetry vocabulary rather than a new badge: a filled cold dot
 * for shipping, a hollow one for unsolved, both over the `tel` label used
 * everywhere else. It stays cold blue in both states — amber is only ever
 * E.L.S.A.'s voice (invariant #1), and using it for "available" would have read
 * as her speaking. `--color-alert` is likewise reserved for scene 05, so the
 * open-problem state signals by weight, not by colour.
 */
export function Highlights() {
  return (
    <Section id="highlights" className="!pt-0 !pb-4 sm:!pb-6">
      <SectionTitle eyebrow={HIGHLIGHTS.eyebrow} heading={HIGHLIGHTS.heading} />

      <div className="grid gap-px overflow-hidden rounded-sm border border-seam bg-seam sm:grid-cols-2 lg:grid-cols-3">
        {HIGHLIGHTS.items.map((item) => (
          <Reveal key={item.title} className="bg-hull">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <p className="flex items-baseline gap-2">
                <span className="font-display text-4xl leading-none text-elsa sm:text-5xl">
                  {item.figure}
                </span>
                <span className="tel !text-telemetry-dim">{item.unit}</span>
              </p>
              <h3 className="mt-5 text-base font-medium text-paper">{item.title}</h3>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.7] text-muted">{item.body}</p>
              <p className="mt-6 flex items-center gap-2">
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    item.status === "today" ? "bg-telemetry" : "border border-telemetry-dim"
                  }`}
                />
                <span className="tel !text-telemetry-dim">
                  {item.status === "today" ? HIGHLIGHTS.statusToday : HIGHLIGHTS.statusOpen}
                </span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
