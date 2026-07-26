import { CLOSING } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Section, SectionTitle, Reveal, Prose } from "@/components/novel/Chrome";
import { Scene } from "@/components/novel/Scene";
import { PlaceholderEarthReturn } from "@/components/scenes/Placeholders";

/**
 * The close.
 *
 * Addressed to the reader directly. The "what I would build next" list is
 * deliberate: it moves the piece from admiration to a concrete proposal, which
 * is the difference between a fan letter and an application.
 */
export function Closing() {
  return (
    <Section id="closing">
      <Reveal className="mb-16">
        <Scene slug="06-earth-return" placeholder={<PlaceholderEarthReturn />} />
      </Reveal>

      <SectionTitle eyebrow={CLOSING.eyebrow} heading={CLOSING.heading} />

      <Reveal>
        <Prose>
          {CLOSING.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Prose>
      </Reveal>

      <Reveal>
        <div className="mt-16 border-t border-seam pt-12">
          <h3 className="tel mb-7 !text-elsa-deep">{CLOSING.next.heading}</h3>
          <ol className="max-w-[70ch] space-y-5">
            {CLOSING.next.items.map((item, i) => (
              <li key={item.slice(0, 20)} className="flex gap-4">
                <span className="tel shrink-0 pt-1 !text-elsa">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.9375rem] leading-[1.7] text-muted">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-16 border-t border-seam pt-12">
          <p className="text-[1.0625rem] text-muted">{CLOSING.signoff}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="font-display text-2xl text-paper">{SITE.author}</span>
            <a href={`mailto:${SITE.email}`} className="tel transition-colors hover:text-elsa">
              {SITE.email}
            </a>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="tel transition-colors hover:text-elsa"
            >
              GitHub
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
