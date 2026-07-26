import { DEMO_REGISTER } from "@/lib/content";
import { Section, SectionTitle, Reveal, Payoff, Caption } from "@/components/novel/Chrome";
import { Scene } from "@/components/novel/Scene";
import { PlaceholderAirlock } from "@/components/scenes/Placeholders";
import { ElsaLine } from "@/components/novel/ElsaLine";
import { RegisterSwitcher } from "./RegisterSwitcher";

/**
 * Use case 01 — delivery as a certifiable safety parameter.
 *
 * The strongest engineering claim on the site, and the one that is genuinely
 * specific to eleven_v3: audio tags make prosody specifiable, therefore
 * testable, therefore something that can appear in a requirements document.
 */
export function UseCaseRegister() {
  return (
    <Section id="use-case-register">
      <SectionTitle
        eyebrow={DEMO_REGISTER.eyebrow}
        heading={DEMO_REGISTER.heading}
        intro={DEMO_REGISTER.intro}
        model={DEMO_REGISTER.model}
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:gap-16">
        <Reveal>
          <RegisterSwitcher />
        </Reveal>

        <div className="space-y-10">
          <Reveal>
            <Scene slug="05-airlock" placeholder={<PlaceholderAirlock />} />
            <Caption>
              Forward airlock, pressure falling. Mission Control will not know for another eighty
              minutes.
            </Caption>
          </Reveal>

          <Reveal>
            <ElsaLine size="sm" register="calm">
              {DEMO_REGISTER.voiceLine}
            </ElsaLine>
          </Reveal>
        </div>
      </div>

      <Payoff>{DEMO_REGISTER.payoff}</Payoff>
    </Section>
  );
}
