import type { ReactNode } from "react";
import { SCENES, type SceneSlug } from "@/lib/scenes";

/**
 * Coded stand-ins for scenes whose art hasn't been supplied yet.
 *
 * Written to look deliberate rather than broken: each one is an abstract
 * rendering of the actual composition in the scene's palette, so the page reads
 * as finished while production catches up. Each carries the brief in the corner,
 * which doubles as the hand-off note to the illustrator.
 */

function Frame({
  slug,
  children,
  className,
}: {
  slug: SceneSlug;
  children: ReactNode;
  className?: string;
}) {
  const spec = SCENES[slug];
  return (
    <div
      role="img"
      aria-label={spec.alt}
      className={`relative h-full w-full overflow-hidden rounded-sm border border-seam bg-hull ${className ?? ""}`}
    >
      {children}

      {/* Vignette, so the abstract shapes sit in the same darkness as the real art. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 35%, rgba(5,6,10,0.72) 100%)",
        }}
      />

      {/* Scrim behind the brief, so it never collides with the artwork beneath it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgba(5,6,10,0.94) 0%, rgba(5,6,10,0.7) 45%, transparent 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
        <p className="max-w-[46ch] font-mono text-[10px] leading-relaxed text-muted/80">
          {spec.brief}
        </p>
        <span className="tel shrink-0 !text-[9px] !text-faint/70">art pending · {slug}</span>
      </div>
    </div>
  );
}

/**
 * Stars scattered deterministically, so the markup is identical on the server
 * and the client and stable across renders.
 *
 * The generator state is built up-front rather than mutated inside the JSX map —
 * reassigning a closed-over variable during render is not safe under React's
 * rules, even when the output happens to be deterministic.
 */
function Stars({ count = 90, seed = 7 }: { count?: number; seed?: number }) {
  const stars = Array.from({ length: count }, () => 0);
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  const points = stars.map(() => ({
    cx: rand() * 1000,
    cy: rand() * 500,
    r: 0.4 + rand() * 1.1,
    warm: rand() > 0.85,
    opacity: 0.2 + rand() * 0.6,
  }));

  return (
    <g>
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill={p.warm ? "#fff0dc" : "#dfe8f6"}
          opacity={p.opacity}
        />
      ))}
    </g>
  );
}

/* ---------- 02 · exterior wide, ship against Saturn ---------- */
export function PlaceholderShipVsSaturn() {
  return (
    <Frame slug="02-ship-vs-saturn">
      <svg viewBox="0 0 1000 429" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          {/* Deliberately darker and higher-contrast than a diagram would be, so
              the placeholder sits in the same tonal world as the supplied art. */}
          <radialGradient id="p2-planet" cx="30%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#c9b795" />
            <stop offset="34%" stopColor="#8a7a60" />
            <stop offset="68%" stopColor="#3f3c3a" />
            <stop offset="100%" stopColor="#0c0e15" />
          </radialGradient>
          <linearGradient id="p2-ring" x1="0" x2="1">
            <stop offset="0%" stopColor="#6e9bd8" stopOpacity="0.05" />
            <stop offset="42%" stopColor="#e6dcc6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#6e9bd8" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <rect width="1000" height="429" fill="#05060a" />
        <Stars count={110} seed={19} />

        <circle cx="640" cy="150" r="215" fill="url(#p2-planet)" />
        <ellipse
          cx="640"
          cy="215"
          rx="420"
          ry="52"
          fill="none"
          stroke="url(#p2-ring)"
          strokeWidth="26"
        />
        <ellipse cx="640" cy="215" rx="360" ry="42" fill="none" stroke="#e6dcc6" strokeOpacity="0.16" strokeWidth="7" />

        {/* The ship: almost too small to find, which is the point of the frame. */}
        <g transform="translate(215 300)">
          <rect x="0" y="0" width="34" height="3.4" rx="1.7" fill="#e9e5de" opacity="0.9" />
          <rect x="9" y="-3.4" width="8" height="3.4" fill="#e9e5de" opacity="0.6" />
          <circle cx="36" cy="1.7" r="2.4" fill="#ffb067" />
        </g>

        {/* Earth, a pale point in the ring plane — the Cassini photograph. */}
        <circle cx="852" cy="238" r="2.2" fill="#a8c8f0" />
        <circle cx="852" cy="238" r="6" fill="#a8c8f0" opacity="0.22" />
      </svg>
    </Frame>
  );
}

/* ---------- 03 · interior, ship's night, one figure at a console ---------- */
export function PlaceholderNightConsole() {
  return (
    <Frame slug="03-night-console">
      <svg viewBox="0 0 1000 667" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="p3-glow" cx="50%" cy="72%" r="52%">
            <stop offset="0%" stopColor="#ffb067" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#c97a34" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ffb067" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1000" height="667" fill="#080a11" />

        {/* Bulkhead structure, barely readable in the dark. */}
        <g stroke="#1b2030" strokeWidth="2" fill="none">
          <path d="M0 120 H1000" />
          <path d="M140 120 V667" />
          <path d="M860 120 V667" />
          <rect x="60" y="180" width="52" height="150" rx="4" />
          <rect x="888" y="180" width="52" height="150" rx="4" />
        </g>

        <rect x="300" y="430" width="400" height="120" rx="6" fill="#0e1220" stroke="#2a3247" />
        {/* Console readouts — the only warm light in frame. This is her. */}
        <g fill="#ffb067">
          {Array.from({ length: 26 }, (_, i) => (
            <rect
              key={i}
              x={318 + (i % 13) * 29}
              y={i < 13 ? 452 : 486}
              width={11 + ((i * 7) % 13)}
              height="5"
              rx="2"
              opacity={0.35 + ((i * 13) % 10) / 14}
            />
          ))}
        </g>
        <ellipse cx="500" cy="470" rx="360" ry="230" fill="url(#p3-glow)" />

        {/* One crew member, awake, backlit by the console. */}
        <g fill="#05060a">
          <circle cx="500" cy="352" r="46" />
          <path d="M500 398 c-72 0-116 40-124 96 h248 c-8-56-52-96-124-96 z" />
        </g>
        <g stroke="#ffb067" strokeWidth="2.5" fill="none" opacity="0.55">
          <path d="M456 344 a46 46 0 0 1 26-36" />
          <path d="M392 486 a92 60 0 0 1 44-46" />
        </g>
      </svg>
    </Frame>
  );
}

/* ---------- 04 · cupola, a tablet, a child's drawing ---------- */
export function PlaceholderMessageHome() {
  return (
    <Frame slug="04-message-home">
      <svg viewBox="0 0 1000 667" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="p4-out" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#1a2133" />
            <stop offset="100%" stopColor="#05060a" />
          </radialGradient>
          <clipPath id="p4-win">
            <circle cx="560" cy="300" r="215" />
          </clipPath>
        </defs>

        <rect width="1000" height="667" fill="#090c14" />

        <circle cx="560" cy="300" r="215" fill="url(#p4-out)" />
        <g clipPath="url(#p4-win)">
          <Stars count={70} seed={41} />
          <ellipse cx="700" cy="180" rx="230" ry="30" fill="none" stroke="#e6dcc6" strokeOpacity="0.2" strokeWidth="12" />
          <circle cx="470" cy="330" r="2" fill="#a8c8f0" />
        </g>
        <circle cx="560" cy="300" r="215" fill="none" stroke="#2a3247" strokeWidth="14" />
        <circle cx="560" cy="300" r="228" fill="none" stroke="#1b2030" strokeWidth="10" />

        {/* Figure, floating, holding a tablet that lights them warm. */}
        <g fill="#05060a">
          <circle cx="470" cy="452" r="40" />
          <path d="M470 492 c-66 0-104 44-108 100 h216 c-4-56-42-100-108-100 z" />
        </g>
        <rect x="516" y="500" width="96" height="64" rx="5" fill="#ffb067" opacity="0.82" />
        <rect x="524" y="510" width="62" height="4" rx="2" fill="#05060a" opacity="0.35" />
        <rect x="524" y="522" width="78" height="4" rx="2" fill="#05060a" opacity="0.25" />

        {/* The child's drawing, taped to the bulkhead. Crayon on paper, in vacuum. */}
        <g transform="translate(122 388) rotate(-4)">
          <rect width="150" height="184" rx="2" fill="#e9e5de" opacity="0.9" />
          <circle cx="75" cy="72" r="30" fill="#c97a34" opacity="0.75" />
          <ellipse cx="75" cy="72" rx="54" ry="10" fill="none" stroke="#8f7f66" strokeWidth="4" />
          <g stroke="#3d5a7d" strokeWidth="3.4" fill="none">
            <path d="M52 132 v34 M52 141 l-13 12 M52 141 l13 12 M52 132 l0-9" />
            <circle cx="52" cy="124" r="8" />
            <path d="M99 132 v34 M99 141 l-13 12 M99 141 l13 12" />
            <circle cx="99" cy="124" r="8" />
          </g>
        </g>
      </svg>
    </Frame>
  );
}

/* ---------- 05 · the forward airlock. The one red frame in the book. ---------- */
export function PlaceholderAirlock() {
  return (
    <Frame slug="05-airlock">
      <svg viewBox="0 0 1000 667" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="p5-alert" cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#ff5f52" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#ff5f52" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1000" height="667" fill="#0a0b10" />
        <rect width="1000" height="667" fill="url(#p5-alert)" />

        {/* Hatch. */}
        <circle cx="500" cy="300" r="180" fill="#0e1118" stroke="#2a3247" strokeWidth="16" />
        <circle cx="500" cy="300" r="132" fill="none" stroke="#1b2030" strokeWidth="8" />
        <g stroke="#ff5f52" strokeWidth="6" strokeLinecap="round" opacity="0.8">
          <path d="M500 148 v-34" />
          <path d="M500 486 v34" />
          <path d="M348 300 h-34" />
          <path d="M686 300 h34" />
        </g>
        {/* Locking dogs. */}
        <g fill="#2a3247">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <rect
              key={a}
              x="494"
              y="130"
              width="12"
              height="30"
              rx="3"
              transform={`rotate(${a} 500 300)`}
            />
          ))}
        </g>

        {/* Pressure readout, falling. */}
        <g>
          <rect x="742" y="452" width="192" height="94" rx="5" fill="#0e1220" stroke="#3a2530" />
          <text x="758" y="486" fill="#ff5f52" fontFamily="monospace" fontSize="15" opacity="0.9">
            FWD LOCK
          </text>
          <text x="758" y="522" fill="#ff5f52" fontFamily="monospace" fontSize="27">
            3.9 psi
          </text>
          <path d="M902 470 v52 l-12-14 M902 522 l12-14" stroke="#ff5f52" strokeWidth="3" fill="none" />
        </g>

        {/* Suited figure, turning back. */}
        <g fill="#05060a">
          <circle cx="250" cy="404" r="54" />
          <path d="M250 458 c-82 0-130 52-136 118 h272 c-6-66-54-118-136-118 z" />
        </g>
        <g stroke="#ff5f52" strokeWidth="3" fill="none" opacity="0.6">
          <path d="M204 392 a54 54 0 0 1 30-42" />
        </g>
        <circle cx="250" cy="396" r="34" fill="#1a2133" opacity="0.55" />
      </svg>
    </Frame>
  );
}

/* ---------- 06 · the bookend. Same window as the cover, Earth ahead. ---------- */
export function PlaceholderEarthReturn() {
  return (
    <Frame slug="06-earth-return">
      <svg viewBox="0 0 1000 473" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="p6-earth" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#cfe4ff" />
            <stop offset="45%" stopColor="#5b8fd9" />
            <stop offset="88%" stopColor="#16406e" />
            <stop offset="100%" stopColor="#0a1420" />
          </radialGradient>
          <radialGradient id="p6-halo" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#6e9bd8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6e9bd8" stopOpacity="0" />
          </radialGradient>
          <clipPath id="p6-glass">
            <path d="M92 40 h816 a26 26 0 0 1 26 26 v196 c0 26-22 44-52 48 l-360 22 -360-22 c-30-4-52-22-52-48 V66 a26 26 0 0 1 26-26 z" />
          </clipPath>
        </defs>

        <rect width="1000" height="473" fill="#05060a" />

        <g clipPath="url(#p6-glass)">
          <rect width="1000" height="473" fill="#070910" />
          <Stars count={80} seed={73} />
          <circle cx="500" cy="176" r="120" fill="url(#p6-halo)" />
          <circle cx="500" cy="176" r="62" fill="url(#p6-earth)" />
        </g>

        {/* Window mullions — must match the cover's geometry when redrawn. */}
        <g stroke="#2a3247" strokeWidth="9" fill="none" strokeLinecap="round">
          <path d="M92 40 h816 a26 26 0 0 1 26 26 v196 c0 26-22 44-52 48 l-360 22 -360-22 c-30-4-52-22-52-48 V66 a26 26 0 0 1 26-26 z" />
          <path d="M300 44 L318 322" />
          <path d="M700 44 L682 322" />
        </g>

        {/* Four seats, four heads, the same arrangement as the opening frame. */}
        <g fill="#05060a">
          {[
            [188, 404, 40],
            [396, 392, 44],
            [604, 392, 44],
            [812, 404, 40],
          ].map(([x, y, r]) => (
            <g key={x}>
              <circle cx={x} cy={y} r={r} />
              <path d={`M${x} ${y + r} c-${r * 1.7} 0-${r * 2.3} ${r * 1.1}-${r * 2.4} ${r * 2} h${r * 4.8} c-0.1-${r * 0.9}-${r * 0.7}-${r * 2}-${r * 2.4}-${r * 2} z`} />
            </g>
          ))}
        </g>
        <g fill="#ffb067" opacity="0.7">
          {Array.from({ length: 22 }, (_, i) => (
            <rect key={i} x={120 + i * 36} y={352} width={10} height="4" rx="2" opacity={0.3 + ((i * 11) % 10) / 13} />
          ))}
        </g>
      </svg>
    </Frame>
  );
}

export const PLACEHOLDERS: Record<Exclude<SceneSlug, "01-cockpit">, ReactNode> = {
  "02-ship-vs-saturn": <PlaceholderShipVsSaturn />,
  "03-night-console": <PlaceholderNightConsole />,
  "04-message-home": <PlaceholderMessageHome />,
  "05-airlock": <PlaceholderAirlock />,
  "06-earth-return": <PlaceholderEarthReturn />,
};
