import { WHY_VOICE } from "@/lib/content";
import { Section, SectionTitle, Reveal, Payoff } from "@/components/novel/Chrome";
import { Scene } from "@/components/novel/Scene";
import { PlaceholderShipVsSaturn } from "@/components/scenes/Placeholders";
import { Caption } from "@/components/novel/Chrome";

/**
 * The premise, stated factually.
 *
 * Four constraints, each with a real figure. The NASA hazard references are
 * genuine — distance from Earth, and isolation and confinement, are two of the
 * five hazards of human spaceflight the agency formally enumerates.
 */
export function WhyVoice() {
  return (
    <Section id="why-voice">
      <SectionTitle
        eyebrow={WHY_VOICE.eyebrow}
        heading={WHY_VOICE.heading}
        intro={WHY_VOICE.intro}
      />

      <Reveal className="mb-16">
        <Scene slug="02-ship-vs-saturn" placeholder={<PlaceholderShipVsSaturn />} />
        <Caption>
          The vehicle, and everything anyone aboard it can reach without waiting most of a working
          day for a reply.
        </Caption>
      </Reveal>

      <div className="grid gap-px overflow-hidden rounded-sm border border-seam bg-seam sm:grid-cols-2">
        {WHY_VOICE.constraints.map((c) => (
          <Reveal key={c.title} className="bg-hull">
            <div className="h-full p-6 sm:p-8">
              <p className="flex items-baseline gap-2">
                <span className="font-display text-4xl leading-none text-elsa sm:text-5xl">
                  {c.figure}
                </span>
                <span className="tel !text-telemetry-dim">{c.unit}</span>
              </p>
              <h3 className="mt-5 text-base font-medium text-paper">{c.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-muted">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Payoff>{WHY_VOICE.kicker}</Payoff>
    </Section>
  );
}
