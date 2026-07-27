import { POWERED_BY } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";

/**
 * "Powered by ElevenLabs" — the feasibility case, and the most CEO-relevant one:
 * every hard part of E.L.S.A. is a model ElevenLabs already ships. Four capability
 * cards, each anchored to a real model id (mono, elsa-deep — the established
 * model-badge treatment from HowItWorks). Server component, no JS.
 *
 * No heading and no payoff line. It runs on its eyebrow, one line of intro and
 * the four cards, so the argument is carried by the model ids rather than by
 * framing around them. Note the section therefore has no h2 and does not appear
 * in the document outline; the eyebrow labels it visually but is not a heading.
 */
export function PoweredBy() {
  return (
    <Section id="powered-by" className="!pt-0">
      <SectionTitle eyebrow={POWERED_BY.eyebrow} intro={POWERED_BY.intro} />

      <div className="grid gap-px overflow-hidden rounded-sm border border-seam bg-seam sm:grid-cols-2">
        {POWERED_BY.capabilities.map((c) => (
          <Reveal key={c.title} className="bg-hull">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <h3 className="text-lg font-medium text-paper">{c.title}</h3>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.7] text-muted">{c.body}</p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="tel !text-telemetry-dim">{POWERED_BY.availableLabel}</span>
                <code className="font-mono text-[0.7rem] text-elsa-deep">{c.model}</code>
              </p>
            </div>
          </Reveal>
        ))}
      </div>

    </Section>
  );
}
