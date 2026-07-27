import { PERSONALIZE } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";

/**
 * "Chosen before launch" — E.L.S.A.'s voice is picked and cloned before the
 * mission. Rendered as a compact console-style "voice profile" registry: a hull
 * panel with a telemetry header and the options as an amber-ringed selection
 * list. Server component, no JS.
 *
 * Two options sit side by side, divided vertically; three sat stacked, divided
 * horizontally. Stacking two reads as a list that got cut short — a lot of
 * panel for two short rows, with the eye dropping off the bottom. Set beside
 * each other they read as what they are: a choice between two, which is also
 * what the numbered radio markers are already saying.
 *
 * Below `sm` it falls back to stacked with horizontal rules, since two columns
 * at that width would leave each body wrapping every three or four words.
 */
export function Personalize() {
  return (
    <Section id="personalize" className="!pt-0 !pb-4 sm:!pb-6">
      <SectionTitle
        eyebrow={PERSONALIZE.eyebrow}
        heading={PERSONALIZE.heading}
        intro={PERSONALIZE.intro}
      />

      <Reveal>
        <div className="hull-panel rounded-sm p-5 sm:p-6">
          {/* Console header */}
          <div className="mb-1 flex items-center gap-3">
            <span
              aria-hidden
              className="signal-pulse block h-1.5 w-1.5 shrink-0 rounded-full bg-telemetry"
            />
            <span className="tel !text-telemetry-dim">Voice profile · select before launch</span>
            <span aria-hidden className="h-px flex-1 bg-seam" />
          </div>

          <ul className="grid divide-y divide-seam sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {PERSONALIZE.options.map((option, i) => (
              <li
                key={option.title}
                className="flex items-start gap-4 py-5 sm:px-7 sm:py-3 sm:first:pl-0 sm:last:pr-0"
              >
                {/* Amber ring marker — a locked-in selection. */}
                <span className="mt-0.5 flex shrink-0 items-center gap-2.5">
                  <span className="tel !text-telemetry-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    aria-hidden
                    className="flex h-4 w-4 items-center justify-center rounded-full border border-elsa/40"
                  >
                    <span className="block h-1.5 w-1.5 rounded-full bg-elsa" />
                  </span>
                </span>

                <div className="min-w-0">
                  <h3 className="font-display text-lg leading-tight text-paper">{option.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-[1.65] text-paper/75">
                    {option.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
