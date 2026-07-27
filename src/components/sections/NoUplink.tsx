import { NO_UPLINK } from "@/lib/content";
import { Section, SectionTitle, Reveal, Payoff } from "@/components/novel/Chrome";

/**
 * "Working without a link" — the section that answers the obvious objection.
 *
 * Structure: one diagram, then two paragraphs. It was previously a card, then
 * a two-column grid, then a three-column grid, which
 * re-explained in prose what the diagram had already shown and read as three
 * different treatments stacked. The two-column grid was the worst of it: two
 * equal boxes side by side is a comparison convention, and these two things are
 * not being compared. They are in different places, which is the entire point.
 *
 * So the explanation moved onto the drawing. One annotation inside the hull
 * beside the loop, one out along the line near the eighty-minute mark, each
 * sitting where the thing it describes actually is. No cards, no borders.
 *
 * The link from Earth terminates ON the speak node rather than stopping in
 * empty space beside the ship. That join is the argument in one stroke: Earth
 * sends words, and they come out of E.L.S.A.'s mouth. Drawn touching, they are
 * one system; drawn apart, they were two diagrams sharing a frame.
 *
 * Contrast: labels are `muted` (~5.8:1) and region labels `telemetry` (~6.6:1)
 * against the panel, both clearing WCAG AA. They were `faint` and
 * `telemetry-dim`, which measure ~2.9:1 and ~2.6:1 and failed it outright.
 *
 * On palette: the loop is the only amber here, including the annotations. Amber
 * is E.L.S.A.'s voice (invariant #1) and the loop is her voice, so spending it
 * anywhere else would blunt the one place it carries meaning.
 *
 * On animation: deliberately not `motion`. Its scroll entrances begin from an
 * `initial` hidden state baked into the server HTML, so the diagram would be
 * invisible until hydration and permanently invisible if a script failed —
 * the exact bug invariant #4 exists to prevent. Entrance is the site's own
 * `.reveal`; channel character is two CSS dash animations over solid base
 * paths. The section ships no JavaScript.
 */
export function NoUplink() {
  return (
    <Section id="no-uplink" className="!pt-0">
      <SectionTitle
        eyebrow={NO_UPLINK.eyebrow}
        heading={NO_UPLINK.heading}
        intro={NO_UPLINK.intro}
      />

      <Reveal>
        <div className="hull-panel rounded-sm px-4 py-8 sm:px-8 sm:py-10">
          <WideDiagram />
          <StackedDiagram />
        </div>
      </Reveal>

      <Payoff>{NO_UPLINK.payoff}</Payoff>

      <Reveal className="mt-14 space-y-6 text-[1.0625rem] leading-[1.72] text-muted sm:text-lg">
        <p>{NO_UPLINK.trust}</p>
        <p>{NO_UPLINK.real}</p>
      </Reveal>
    </Section>
  );
}

const D = NO_UPLINK.diagram;

/* Label styles. Sizes are up from 11px and colours up from faint/telemetry-dim;
   see the contrast note above. */
const NODE = "fill-muted font-mono text-[13px]";
const REGION = "fill-telemetry font-mono text-[12px] tracking-[0.08em]";
const NOTE = "fill-paper/90 font-mono text-[13px]";

/**
 * The closed onboard loop: a solid amber stadium, then the same geometry again
 * carrying the travelling highlight. `pathLength="100"` lets one CSS rule drive
 * both diagrams despite their different real path lengths.
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

/** The one-way link. Drawn Earth-first so the dashes travel inbound, toward speak. */
function Link({ d }: { d: string }) {
  return (
    <>
      <path d={d} pathLength="100" className="fill-none stroke-telemetry-dim" strokeWidth="1" />
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
      viewBox="0 0 1120 300"
      role="img"
      aria-labelledby="nu-wide-t nu-wide-d"
      className="hidden h-auto w-full sm:block"
    >
      <title id="nu-wide-t">{D.title}</title>
      <desc id="nu-wide-d">{D.desc}</desc>

      {/* ---- the hull ---- */}
      <text x="24" y="52" className={REGION}>
        {D.ship}
      </text>
      <rect
        x="24"
        y="64"
        width="380"
        height="210"
        rx="16"
        className="fill-none stroke-telemetry-dim"
        strokeWidth="1"
      />

      {/* ---- the closed loop. `speak` sits at the rightmost point, which is
              where the link from Earth lands. ---- */}
      <Loop d="M 130 110 H 280 a 30 30 0 0 1 0 60 H 130 a 30 30 0 0 1 0 -60 Z" />
      <circle cx="215" cy="110" r="3.5" className="fill-elsa" />
      <circle cx="160" cy="170" r="3.5" className="fill-elsa" />
      <circle cx="310" cy="140" r="4" className="fill-elsa" />
      <text x="215" y="98" textAnchor="middle" className={NODE}>
        {D.nodes[1]}
      </text>
      <text x="160" y="192" textAnchor="middle" className={NODE}>
        {D.nodes[0]}
      </text>
      <text x="310" y="192" textAnchor="middle" className={NODE}>
        {D.nodes[2]}
      </text>

      {/* Annotation inside the hull, beside the loop it describes. */}
      {D.shipNote.map((line, i) => (
        <text key={line} x="214" y={214 + i * 20} textAnchor="middle" className={NOTE}>
          {line}
        </text>
      ))}

      {/* ---- the link, terminating on `speak` ---- */}
      <text x="680" y="104" textAnchor="middle" className={REGION}>
        {D.line}
      </text>
      <text x="680" y="126" textAnchor="middle" className={REGION}>
        {D.delay}
      </text>
      <Link d="M 1036 140 H 310" />
      <path
        d="M 332 132 L 320 140 L 332 148"
        className="fill-none stroke-telemetry"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {D.lineNote.map((line, i) => (
        <text key={line} x="680" y={172 + i * 20} textAnchor="middle" className={NOTE}>
          {line}
        </text>
      ))}

      {/* ---- Earth ---- */}
      <circle cx="1060" cy="140" r="22" className="fill-none stroke-telemetry-dim" strokeWidth="1" />
      <text x="1060" y="186" textAnchor="middle" className={REGION}>
        {D.earth}
      </text>
    </svg>
  );
}

/**
 * Narrow: the ship above, Earth below, the connector rotated to vertical. The
 * long empty run between them is kept deliberately — making eighty minutes
 * something you can see is what the diagram is for, so it is not compressed to
 * save height.
 */
function StackedDiagram() {
  return (
    <svg
      viewBox="0 0 360 780"
      role="img"
      aria-labelledby="nu-stack-t nu-stack-d"
      className="mx-auto h-auto w-full max-w-[360px] sm:hidden"
    >
      <title id="nu-stack-t">{D.title}</title>
      <desc id="nu-stack-d">{D.desc}</desc>

      <text x="16" y="32" className={REGION}>
        {D.ship}
      </text>
      <rect
        x="16"
        y="44"
        width="328"
        height="250"
        rx="16"
        className="fill-none stroke-telemetry-dim"
        strokeWidth="1"
      />

      {/*
        The connector runs down x=280, not down the middle. Centred, it drew
        straight through the annotation and the "line to Earth" label, which
        made the diagram look broken rather than connected. `speak` therefore
        stays at the loop's rightmost point (as in the wide version) and every
        label is centred at x=140, clear of the line's column.
      */}
      <Loop d="M 110 100 H 250 a 30 30 0 0 1 0 60 H 110 a 30 30 0 0 1 0 -60 Z" />
      <circle cx="180" cy="100" r="3.5" className="fill-elsa" />
      <circle cx="140" cy="160" r="3.5" className="fill-elsa" />
      <circle cx="280" cy="130" r="4" className="fill-elsa" />
      <text x="180" y="88" textAnchor="middle" className={NODE}>
        {D.nodes[1]}
      </text>
      <text x="140" y="182" textAnchor="middle" className={NODE}>
        {D.nodes[0]}
      </text>
      <text x="292" y="122" className={NODE}>
        {D.nodes[2]}
      </text>

      {D.shipNote.map((line, i) => (
        <text key={line} x="140" y={214 + i * 22} textAnchor="middle" className={NOTE}>
          {line}
        </text>
      ))}

      <text x="262" y="340" textAnchor="end" className={REGION}>
        {D.line}
      </text>

      <Link d="M 280 700 V 130" />
      <path
        d="M 272 154 L 280 142 L 288 154"
        className="fill-none stroke-telemetry"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="268" y1="400" x2="292" y2="400" className="stroke-telemetry-dim" strokeWidth="1" />
      <text x="258" y="404" textAnchor="end" className={REGION}>
        {D.delay}
      </text>

      {D.lineNoteNarrow.map((line, i) => (
        <text key={line} x="140" y={476 + i * 22} textAnchor="middle" className={NOTE}>
          {line}
        </text>
      ))}

      <circle cx="280" cy="724" r="22" className="fill-none stroke-telemetry-dim" strokeWidth="1" />
      <text x="280" y="770" textAnchor="middle" className={REGION}>
        {D.earth}
      </text>
    </svg>
  );
}
