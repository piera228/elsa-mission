import { DEMO_HOME } from "@/lib/content";
import { Section, SectionTitle, Reveal, Payoff, Prose, Caption } from "@/components/novel/Chrome";
import { Scene } from "@/components/novel/Scene";
import { PlaceholderMessageHome } from "@/components/scenes/Placeholders";
import { MessageFromHome } from "./MessageFromHome";

/**
 * Use case 02 — voice cloning as a bandwidth argument.
 *
 * Anchored to Cassini's real 2013 photograph of Earth from Saturn rather than an
 * invented scenario, because the documented version is stronger than anything
 * that could be made up.
 */
export function UseCaseHome() {
  return (
    <Section id="use-case-home">
      <SectionTitle
        eyebrow={DEMO_HOME.eyebrow}
        heading={DEMO_HOME.heading}
        intro={DEMO_HOME.intro}
        model={DEMO_HOME.model}
      />

      {/* The real event, set apart as an archive note. */}
      <Reveal className="mb-16">
        <figure className="max-w-[70ch] border-l-2 border-elsa-deep/60 pl-6 sm:pl-8">
          <figcaption className="tel mb-4 !text-elsa-deep">
            Recorded fact · {DEMO_HOME.cassini.date}
          </figcaption>
          <p className="text-[1.0625rem] leading-[1.75] text-paper/80 sm:text-lg">
            {DEMO_HOME.cassini.body}
          </p>
          <p className="mt-5 font-display text-xl leading-snug text-elsa-hot sm:text-2xl">
            {DEMO_HOME.cassini.closing}
          </p>
        </figure>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <Reveal>
          <Scene slug="04-message-home" placeholder={<PlaceholderMessageHome />} />
          <Caption>
            The voice model launches once with the vehicle. Every message after that costs text.
          </Caption>
        </Reveal>

        <div className="space-y-10">
          <Reveal>
            <Prose>
              <p>{DEMO_HOME.argument}</p>
            </Prose>
          </Reveal>

          <Reveal>
            <MessageFromHome />
          </Reveal>
        </div>
      </div>

      <Payoff>{DEMO_HOME.closing}</Payoff>
    </Section>
  );
}
