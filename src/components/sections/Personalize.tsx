import { PERSONALIZE } from "@/lib/content";
import { Section, SectionTitle, Reveal } from "@/components/novel/Chrome";

/**
 * "Chosen before launch" — E.L.S.A.'s voice is picked and cloned before the
 * mission. Rendered as a compact console-style "voice profile" registry: a hull
 * panel with a telemetry header and a bulleted list of options, each with an
 * amber ring marker reading as a locked-in selection. Server component, no JS.
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

          <ul className="divide-y divide-seam">
            {PERSONALIZE.options.map((option, i) => (
              <li key={option.title} className="flex items-start gap-4 py-4">
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
