import { DEMO_TALK } from "@/lib/content";
import { Section, SectionTitle, Reveal, Caption } from "@/components/novel/Chrome";
import { Scene } from "@/components/novel/Scene";
import { PlaceholderNightConsole } from "@/components/scenes/Placeholders";
import { AskHer } from "./AskHer";

/** Use case 03 — sub-second latency as the threshold for presence rather than operation. */
export function UseCaseTalk() {
  return (
    <Section id="use-case-talk">
      <SectionTitle
        eyebrow={DEMO_TALK.eyebrow}
        heading={DEMO_TALK.heading}
        intro={DEMO_TALK.intro}
        model={DEMO_TALK.model}
      />

      <div className="grid gap-12 lg:grid-cols-[0.72fr_1fr] lg:gap-16">
        <Reveal>
          <Scene slug="03-night-console" placeholder={<PlaceholderNightConsole />} />
          <Caption>
            03:14 ship time. Speaker diarisation means she knows who is awake without being told.
          </Caption>
        </Reveal>

        <div className="space-y-6">
          <Reveal>
            <p className="text-[0.9375rem] leading-relaxed text-muted">{DEMO_TALK.note}</p>
          </Reveal>
          <Reveal>
            <AskHer />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
