import { PERSONALIZE } from "@/lib/content";
import { Section, SectionTitle, Reveal, Payoff } from "@/components/novel/Chrome";

const M = PERSONALIZE.manifest;

/**
 * "Chosen before launch" — rendered as a pre-flight document rather than a card
 * grid, because the idea is bureaucratic and the content is not.
 *
 * A manifest is a form: ruled rows, fixed fields, the same five every time, no
 * emphasis anywhere. That flatness is what makes the names land. Set the same
 * people in cards with headings and they read as options being offered; set
 * them as rows on a form and they read as decisions already taken, which is
 * what they are.
 *
 * Names are display serif and large, every other value is mono and small. The
 * name is the only thing on the row a person chose; the rest is administration,
 * and it is typeset as administration.
 *
 * The last row is blank and slightly dimmed. It is not a control and must not
 * become one: no tick, no button, no hover state, no cursor change. Every other
 * line was filled in on Earth, and leaving this one open hands the question to
 * the reader instead of answering it — which is the whole reason the section
 * exists. `aria-hidden` is deliberately NOT used: a screen reader should reach
 * "Status: awaiting selection" like everyone else.
 *
 * Server component, no JS.
 */
export function Personalize() {
  return (
    <Section id="personalize" className="!pt-0 !pb-4 sm:!pb-6">
      <SectionTitle eyebrow={PERSONALIZE.eyebrow} heading={PERSONALIZE.heading} />

      <Reveal className="mb-14 max-w-[68ch] space-y-6 text-[1.0625rem] leading-[1.72] text-muted sm:mb-16 sm:text-lg">
        {PERSONALIZE.body.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </Reveal>

      <Reveal>
        <div className="hull-panel rounded-sm px-5 py-6 sm:px-8 sm:py-8">
          {/* Document header. A static marker, not the pulsing one used on live
              consoles elsewhere: this is a record, not a running system. */}
          <div className="flex items-center gap-3 pb-2">
            <span aria-hidden className="block h-1.5 w-1.5 shrink-0 rounded-full bg-telemetry-dim" />
            <span className="tel !text-telemetry">{M.label}</span>
            <span aria-hidden className="h-px flex-1 bg-seam" />
          </div>

          <ul className="divide-y divide-seam">
            {M.entries.map((entry) => (
              <li
                key={entry.name + entry.recorded}
                className={`grid gap-6 py-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,2.4fr)] sm:gap-10 sm:py-9 ${
                  "open" in entry && entry.open ? "opacity-55" : ""
                }`}
              >
                <div>
                  <Label>{M.fields.name}</Label>
                  <p className="mt-2.5 font-display text-2xl leading-tight text-paper sm:text-[1.75rem]">
                    {entry.name}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-6">
                  <Field label={M.fields.relationship} value={entry.relationship} />
                  <Field label={M.fields.recorded} value={entry.recorded} />
                  <Field label={M.fields.authorized} value={entry.authorized} />
                  <Field label={M.fields.status} value={entry.status} />
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Payoff>{PERSONALIZE.payoff}</Payoff>
    </Section>
  );
}

/** Field label: the smallest, coldest thing on the row. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-mono text-[0.625rem] uppercase leading-none tracking-[0.2em] text-telemetry">
      {children}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>
        <Label>{label}</Label>
      </dt>
      <dd className="mt-2.5 font-mono text-[0.75rem] leading-[1.6] text-muted">{value}</dd>
    </div>
  );
}
