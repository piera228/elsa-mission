import { BEYOND } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";

/**
 * "Beyond the mission" — the market case. Deep space is the sharpest proof that a
 * voice can be the only workable interface; the same need recurs anywhere failure
 * isn't an option. A grid of domains, each with a telemetry index (cold, since
 * it's instrumentation, not her voice). Server component, no JS.
 */
export function BeyondMission() {
  const total = String(BEYOND.domains.length).padStart(2, "0");

  return (
    <Section id="beyond">
      <SectionTitle eyebrow={BEYOND.eyebrow} heading={BEYOND.heading} intro={BEYOND.intro} />

      <div className="grid gap-px overflow-hidden rounded-sm border border-seam bg-seam sm:grid-cols-2 lg:grid-cols-3">
        {BEYOND.domains.map((d, i) => (
          <Reveal key={d.title} className="bg-hull">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <span className="tel !text-telemetry-dim">
                {String(i + 1).padStart(2, "0")} / {total}
              </span>
              <h3 className="mt-5 text-lg font-medium text-paper">{d.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-muted">{d.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
