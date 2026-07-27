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

/** Section shell. Consistent rhythm and width for every section. */
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
 */
export function SectionTitle({
  eyebrow,
  heading,
  intro,
  model,
}: {
  eyebrow: string;
  heading: string;
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

      <h2 className="mt-5 font-display text-3xl leading-[1.12] text-paper text-balance sm:text-4xl md:text-5xl">
        <DecodeText text={heading} />
      </h2>

      {intro ? (
        <p className="mt-6 text-[1.0625rem] leading-[1.72] text-muted sm:text-lg">
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
