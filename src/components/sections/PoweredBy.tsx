import Link from "next/link";
import { POWERED_BY } from "@/lib/content";
import { Section, SectionTitle, Reveal, Payoff } from "@/components/novel/Chrome";

/**
 * "Powered by ElevenLabs" — the feasibility case, and the most CEO-relevant one:
 * every hard part of E.L.S.A. is a model ElevenLabs already ships. Four capability
 * cards, each anchored to a real model id (mono, elsa-deep — the established
 * model-badge treatment from HowItWorks), closed by a payoff line. Server
 * component, no JS.
 */
export function PoweredBy() {
  return (
    <Section id="powered-by" className="!pt-0">
      <SectionTitle
        eyebrow={POWERED_BY.eyebrow}
        heading={POWERED_BY.heading}
        intro={POWERED_BY.intro}
      />

      <div className="grid gap-px overflow-hidden rounded-sm border border-seam bg-seam sm:grid-cols-2">
        {POWERED_BY.capabilities.map((c) => (
          <Reveal key={c.title} className="bg-hull">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <h3 className="text-lg font-medium text-paper">{c.title}</h3>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.7] text-muted">{c.body}</p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="tel !text-telemetry-dim">Available today</span>
                <code className="font-mono text-[0.7rem] text-elsa-deep">{c.model}</code>
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Payoff>{POWERED_BY.payoff}</Payoff>

      <Reveal className="mt-8">
        <Link
          href="/about"
          className="group inline-flex items-center gap-2.5 rounded-full border border-seam-lit px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:border-elsa/60 hover:text-elsa"
        >
          Learn more about the project
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Reveal>
    </Section>
  );
}
