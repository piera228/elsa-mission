import { CAPABILITIES } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";

/** The full requirement-to-model map. Proves breadth, and that none of it is speculative. */
export function Capabilities() {
  return (
    <Section id="capabilities">
      <SectionTitle
        eyebrow={CAPABILITIES.eyebrow}
        heading={CAPABILITIES.heading}
        intro={CAPABILITIES.intro}
      />

      <div className="divide-y divide-seam border-y border-seam">
        {CAPABILITIES.items.map((item) => (
          <Reveal key={item.model}>
            <div className="grid gap-2 py-6 md:grid-cols-[1.25fr_0.75fr] md:items-baseline md:gap-10">
              <p className="text-[1.0625rem] leading-snug text-paper/90">{item.need}</p>
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <code className="font-mono text-[0.8rem] text-elsa">{item.model}</code>
                <span className="tel !tracking-[0.1em]">{item.spec}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-8 max-w-[62ch] font-mono text-xs leading-relaxed text-faint">
          {CAPABILITIES.footnote}
        </p>
      </Reveal>
    </Section>
  );
}
