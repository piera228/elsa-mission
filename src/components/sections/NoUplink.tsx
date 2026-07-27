import { NO_UPLINK } from "@/lib/content";
import { Section, SectionTitle, Reveal, Payoff } from "@/components/novel/Chrome";

/**
 * "Working without a link" — the section that answers the obvious objection.
 *
 * The whole section carries one distinction, so the diagram is built to state
 * it in shape and colour before a single label is read: channel A is a small
 * closed amber loop entirely inside the hull, channel B is one thin cold line
 * running the full width of the frame. Nothing connects them. That absence is
 * the point — the loop has no line leaving it, and the eye should find that
 * before the caption explains it.
 *
 * On palette: the onboard loop is the only amber in the section, including the
 * channel cards below. Amber is E.L.S.A.'s voice (invariant #1), the loop *is*
 * her voice, and spending amber anywhere else here would blunt the one place it
 * carries meaning.
 *
 * On animation: this deliberately does NOT use `motion`, despite that being the
 * library the rest of the site reaches for. Every `motion` scroll entrance
 * begins from an `initial` hidden state, which is baked into the server HTML —
 * so the diagram would be invisible until hydration, and permanently invisible
 * if a script failed. That is exactly the bug invariant #4 exists to prevent,
 * and it has bitten this project once already. Instead the entrance uses the
 * site's own scroll-driven `.reveal` (CSS `animation-timeline: view()`, additive
 * over a visible base state) and the channel character comes from two CSS dash
 * animations. The result is a server component that ships no JavaScript at all
 * and degrades to a complete, readable diagram.
 *
 * Two versions of the diagram rather than one scaled down: at 375px the wide
 * layout's long horizontal link would either shrink the ship to illegibility or
 * force the labels to collide, so narrow screens get a stacked variant where
 * the link runs vertically and the geometry stays at a readable size.
 */
export function NoUplink() {
  return (
    <Section id="no-uplink" className="!pt-0">
      <SectionTitle
        eyebrow={NO_UPLINK.eyebrow}
        heading={NO_UPLINK.heading}
        intro={NO_UPLINK.intro}
      />

      <Reveal className="mb-14 sm:mb-16">
        <div className="hull-panel rounded-sm px-4 py-8 sm:px-8 sm:py-10">
          <WideDiagram />
          <StackedDiagram />
        </div>
      </Reveal>

      <div className="grid gap-px overflow-hidden rounded-sm border border-seam bg-seam sm:grid-cols-2">
        {NO_UPLINK.channels.map((c) => (
          <Reveal key={c.tag} className="bg-hull">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <span className="tel !text-telemetry">{c.tag}</span>
              <h3 className="mt-4 font-display text-xl text-paper sm:text-2xl">{c.title}</h3>
              <p className="mt-4 text-[0.9375rem] leading-[1.7] text-muted">{c.body}</p>
              <p className="mt-5 border-t border-seam pt-5 text-[0.9375rem] leading-[1.7] text-paper/80">
                {c.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-seam bg-seam md:grid-cols-3">
        {NO_UPLINK.points.map((p) => (
          <Reveal key={p.title} className="bg-hull">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <h3 className="text-base font-medium text-paper">{p.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-muted">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Payoff>{NO_UPLINK.payoff}</Payoff>
    </Section>
  );
}

const D = NO_UPLINK.diagram;

/**
 * Shared type styles for diagram labels.
 *
 * Sentence case, not the uppercase `tel` treatment used for eyebrows elsewhere.
 * Inside a diagram the labels are read as annotations on a drawing rather than
 * as section furniture, and letter-spaced caps at 11px fight the thin strokes
 * they sit next to. Tracking is loosened only slightly, enough to keep the mono
 * reading as instrumentation.
 */
const LABEL = "fill-faint font-mono text-[11px]";
const TEL = "fill-telemetry-dim font-mono text-[11px] tracking-[0.08em]";

/**
 * The closed onboard loop, drawn twice: a solid amber stadium, then the same
 * geometry again carrying the travelling highlight. `pathLength="100"` lets one
 * CSS rule drive both diagrams despite their different real path lengths.
 */
function Loop({ d }: { d: string }) {
  return (
    <>
      <path d={d} pathLength="100" className="fill-none stroke-elsa" strokeWidth="1" />
      <path
        d={d}
        pathLength="100"
        className="loop-chase fill-none stroke-elsa-hot"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  );
}

/** The one-way link from Earth. Drawn Earth-first so the dashes travel inbound. */
function Link({ d }: { d: string }) {
  return (
    <>
      <path d={d} pathLength="100" className="fill-none stroke-telemetry-dim/60" strokeWidth="1" />
      <path
        d={d}
        pathLength="100"
        className="link-crawl fill-none stroke-telemetry"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </>
  );
}

function WideDiagram() {
  return (
    <svg
      viewBox="0 0 1040 264"
      role="img"
      aria-labelledby="nu-wide-t nu-wide-d"
      className="hidden h-auto w-full sm:block"
    >
      <title id="nu-wide-t">{D.title}</title>
      <desc id="nu-wide-d">{D.desc}</desc>

      {/* ---- the hull ---- */}
      <text x="16" y="38" className={TEL}>
        {D.ship}
      </text>
      <rect
        x="16"
        y="52"
        width="360"
        height="196"
        rx="16"
        className="fill-none stroke-seam-lit"
        strokeWidth="1"
      />

      {/* ---- channel A: a closed loop, no line leaving the hull ---- */}
      <Loop d="M 116 104 H 276 a 30 30 0 0 1 0 60 H 116 a 30 30 0 0 1 0 -60 Z" />
      <circle cx="196" cy="104" r="3" className="fill-elsa" />
      <circle cx="150" cy="164" r="3" className="fill-elsa" />
      <circle cx="242" cy="164" r="3" className="fill-elsa" />
      <text x="196" y="92" textAnchor="middle" className={LABEL}>
        {D.nodes[1]}
      </text>
      <text x="150" y="182" textAnchor="middle" className={LABEL}>
        {D.nodes[0]}
      </text>
      <text x="242" y="182" textAnchor="middle" className={LABEL}>
        {D.nodes[2]}
      </text>
      <text x="196" y="222" textAnchor="middle" className={TEL}>
        {D.loop}
      </text>

      {/* ---- channel B: one thin line, the full width of the frame ---- */}
      <Link d="M 974 134 H 386" />
      <path
        d="M 396 128 L 386 134 L 396 140"
        className="fill-none stroke-telemetry"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="680" y="118" textAnchor="middle" className={TEL}>
        {D.delay}
      </text>
      <text x="680" y="158" textAnchor="middle" className={LABEL}>
        {D.payload}
      </text>

      {/* ---- Earth ---- */}
      <circle cx="1000" cy="134" r="20" className="fill-none stroke-telemetry-dim" strokeWidth="1" />
      <text x="1000" y="180" textAnchor="middle" className={TEL}>
        {D.earth}
      </text>
    </svg>
  );
}

/** Narrow: the same two channels, stacked, at unreduced size. */
function StackedDiagram() {
  return (
    <svg
      viewBox="0 0 360 620"
      role="img"
      aria-labelledby="nu-stack-t nu-stack-d"
      className="mx-auto h-auto w-full max-w-[360px] sm:hidden"
    >
      <title id="nu-stack-t">{D.title}</title>
      <desc id="nu-stack-d">{D.desc}</desc>

      <text x="20" y="26" className={TEL}>
        {D.ship}
      </text>
      <rect
        x="20"
        y="40"
        width="320"
        height="200"
        rx="16"
        className="fill-none stroke-seam-lit"
        strokeWidth="1"
      />

      <Loop d="M 110 100 H 250 a 30 30 0 0 1 0 60 H 110 a 30 30 0 0 1 0 -60 Z" />
      <circle cx="180" cy="100" r="3" className="fill-elsa" />
      <circle cx="145" cy="160" r="3" className="fill-elsa" />
      <circle cx="215" cy="160" r="3" className="fill-elsa" />
      <text x="180" y="88" textAnchor="middle" className={LABEL}>
        {D.nodes[1]}
      </text>
      <text x="145" y="178" textAnchor="middle" className={LABEL}>
        {D.nodes[0]}
      </text>
      <text x="215" y="178" textAnchor="middle" className={LABEL}>
        {D.nodes[2]}
      </text>
      <text x="180" y="216" textAnchor="middle" className={TEL}>
        {D.loop}
      </text>

      <Link d="M 180 534 V 262 " />
      <path
        d="M 174 272 L 180 262 L 186 272"
        className="fill-none stroke-telemetry"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="200" y="345" className={TEL}>
        {D.delay}
      </text>
      <text x="200" y="455" className={LABEL}>
        {D.payload}
      </text>

      <circle cx="180" cy="560" r="22" className="fill-none stroke-telemetry-dim" strokeWidth="1" />
      <text x="180" y="606" textAnchor="middle" className={TEL}>
        {D.earth}
      </text>
    </svg>
  );
}
