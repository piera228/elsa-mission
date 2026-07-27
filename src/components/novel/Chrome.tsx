import type { ReactNode } from "react";
import { DecodeText } from "./DecodeText";

/**
 * Shared section chrome.
 *
 * Entirely server-rendered — the scroll reveal is CSS (`.reveal`, see
 * globals.css), so none of this ships JavaScript and content is never hidden
 * behind a script that might not run.
 */

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`reveal ${className ?? ""}`}>{children}</div>;
}

/**
 * Section shell. Consistent rhythm and width for every section.
 *
 * The vertical rhythm has one rule, and it is easy to break by accident: every
 * section after the first sets `!pt-0`, so the gap a reader sees between two
 * sections is ONE section's bottom padding, not two stacked. Override `pb` and
 * you are not trimming that section, you are deleting the gap after it.
 *
 * Highlights, Personalize and TalkToElsa each carried `!pb-4 sm:!pb-6`, which
 * collapsed three of the six gaps on the page to about 20px while the rest ran
 * at 96–144px. Add `!pt-0` to a new section; leave the bottom alone.
 */
export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative z-10 mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-28 md:py-36 ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

/**
 * Section heading. Eyebrow in cold mono, title in warm serif — the same
 * warm/cold split the palette uses throughout.
 *
 * `heading` is optional: a section can run on its eyebrow and intro alone. When
 * it is omitted the intro takes the heading's top margin, so the rhythm below
 * the rule stays the same either way.
 */
export function SectionTitle({
  eyebrow,
  heading,
  intro,
  model,
}: {
  eyebrow: string;
  heading?: string;
  intro?: string;
  /** Model id badge, when a section is anchored to a specific one. */
  model?: string;
}) {
  return (
    <Reveal className="mb-12 sm:mb-16">
      <div className="flex items-center gap-4">
        <span className="tel !text-telemetry">{eyebrow}</span>
        <span aria-hidden className="h-px flex-1 bg-seam" />
        {model ? <code className="font-mono text-[0.7rem] text-elsa-deep">{model}</code> : null}
      </div>

      {heading ? (
        <h2 className="mt-5 font-display text-3xl leading-[1.12] text-paper text-balance sm:text-4xl md:text-5xl">
          <DecodeText text={heading} />
        </h2>
      ) : null}

      {intro ? (
        <p
          className={`${heading ? "mt-6" : "mt-5"} text-[1.0625rem] leading-[1.72] text-muted sm:text-lg`}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}

/** Body prose. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 text-[1.0625rem] leading-[1.72] text-muted sm:text-lg">
      {children}
    </div>
  );
}

/** A caption beneath a scene. */
export function Caption({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 font-mono text-xs leading-relaxed text-faint">{children}</p>
  );
}

/**
 * The payoff line that closes a use case — the sentence that states what the
 * demo just proved. Serif and warm so it reads as the conclusion, not as body.
 */
export function Payoff({ children }: { children: ReactNode }) {
  return (
    <Reveal className="mt-14 border-t border-seam pt-12">
      <p className="font-display text-xl leading-[1.5] text-paper/90 sm:text-2xl">
        {children}
      </p>
    </Reveal>
  );
}
