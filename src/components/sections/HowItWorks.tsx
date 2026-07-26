import { HOW_IT_WORKS } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";

/** The onboard hear → reason → speak loop, and why it cannot run on Earth. */
export function HowItWorks() {
  return (
    <Section id="architecture">
      <SectionTitle
        eyebrow={HOW_IT_WORKS.eyebrow}
        heading={HOW_IT_WORKS.heading}
        intro={HOW_IT_WORKS.intro}
      />

      <div className="grid gap-px overflow-hidden rounded-sm border border-seam bg-seam md:grid-cols-3">
        {HOW_IT_WORKS.pipeline.map((stage, i) => (
          <Reveal key={stage.stage} className="bg-hull">
            <div className="flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="tel !text-elsa">
                  {String(i + 1).padStart(2, "0")} · {stage.stage}
                </span>
                <span className="font-mono text-[0.7rem] text-telemetry">{stage.latency}</span>
              </div>

              <h3 className="mt-6 text-[0.9375rem] font-medium leading-snug text-paper">
                {stage.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.875rem] leading-[1.7] text-muted">{stage.body}</p>

              <code className="mt-6 font-mono text-[0.7rem] text-elsa-deep">{stage.model}</code>
            </div>
          </Reveal>
        ))}
      </div>

      {/* The comparison that justifies the whole architecture. */}
      <Reveal className="mt-10">
        <div className="hull-panel rounded-sm p-7 sm:p-10">
          <div className="grid gap-9 sm:grid-cols-2 sm:gap-12">
            <div>
              <p className="tel mb-3">{HOW_IT_WORKS.comparison.onboardLabel}</p>
              <p className="font-display text-5xl text-elsa sm:text-6xl">
                {HOW_IT_WORKS.comparison.onboard}
              </p>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-seam">
                <div className="h-full w-full rounded-full bg-elsa" />
              </div>
            </div>

            <div>
              <p className="tel mb-3">{HOW_IT_WORKS.comparison.earthLabel}</p>
              <p className="font-display text-5xl text-telemetry sm:text-6xl">
                {HOW_IT_WORKS.comparison.earth}
              </p>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-seam">
                {/*
                  Not to scale, deliberately: a 13,000× ratio drawn honestly would
                  render this bar invisible. The figure carries the magnitude; the
                  bar only signals direction.
                */}
                <div className="h-full w-[4%] rounded-full bg-telemetry-dim" />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-seam pt-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
            <p className="font-display text-3xl text-elsa-hot sm:text-4xl">
              {HOW_IT_WORKS.comparison.factor}
            </p>
            <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
              {HOW_IT_WORKS.comparison.note}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
