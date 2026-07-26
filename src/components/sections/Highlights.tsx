import { HIGHLIGHTS } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";

/**
 * The highlights — E.L.S.A.'s case in one screen, six points each led by a real
 * figure. Reuses the WhyVoice figure-card grid so it reads as native to the site:
 * amber figure, telemetry-dim unit, seam-divided equal-height cards. Server
 * component, no JS; the reveal is additive CSS.
 */
export function Highlights() {
  return (
    <Section id="highlights" className="!pt-0 !pb-4 sm:!pb-6">
      <Reveal className="mb-10 sm:mb-14">
        <p className="font-display text-xl leading-[1.5] text-paper/90 sm:text-2xl">
          {HIGHLIGHTS.lead}
        </p>
      </Reveal>

      <SectionTitle eyebrow={HIGHLIGHTS.eyebrow} heading={HIGHLIGHTS.heading} />

      <div className="grid gap-px overflow-hidden rounded-sm border border-seam bg-seam sm:grid-cols-2 lg:grid-cols-3">
        {HIGHLIGHTS.items.map((item) => (
          <Reveal key={item.title} className="bg-hull">
            <div className="h-full p-6 sm:p-8">
              <p className="flex items-baseline gap-2">
                <span className="font-display text-4xl leading-none text-elsa sm:text-5xl">
                  {item.figure}
                </span>
                <span className="tel !text-telemetry-dim">{item.unit}</span>
              </p>
              <h3 className="mt-5 text-base font-medium text-paper">{item.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-muted">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
