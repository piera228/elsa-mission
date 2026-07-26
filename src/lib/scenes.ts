/**
 * Scene manifest — the art hand-off contract.
 *
 * ART SPECIFICATION
 * =================
 * Drop files into `public/scenes/`, named `NN-slug.webp` (or `.png`/`.jpg`).
 * `Scene` checks the filesystem at render time, so **adding art requires no
 * code change** — the placeholder disappears on its own.
 *
 * For parallax, export three layers instead of one flat image:
 *   `NN-slug-bg.webp`   distant — space, planet
 *   `NN-slug-mid.webp`  middle  — window frame, structure
 *   `NN-slug-fg.webp`   near    — crew, console  (needs alpha)
 * Flat and layered both work; `Scene` detects which is present.
 *
 * THE RIM-LIGHT RULE — non-negotiable
 * -----------------------------------
 * Interiors and crew are lit from exactly two directions:
 *   warm amber #FFB067 from E.L.S.A.'s console
 *   cool blue  #6E9BD8 from the window
 * Amber light is ALWAYS her. Nothing else in any frame is ever amber. This is
 * the argument of the whole site expressed as lighting, and it is what makes
 * six separately-drawn scenes read as one book.
 *
 * PALETTE LOCK
 * ------------
 * void #05060A · hull #0A0D15 · amber #FFB067 / #FFD9A8
 * telemetry blue #6E9BD8 · paper #E9E5DE · alert #FF5F52 (scene 05 only)
 *
 * STYLE
 * -----
 * Silhouette-forward. Crew as dark backlit shapes; faces not required.
 * `01-cockpit.png` is the reference — match its grain, contrast and palette.
 * E.L.S.A. herself is never depicted. She is light, never a face.
 *
 * DELIVERY
 * --------
 * 2× intended display width (≥ 2560 px). WebP. Alpha only on `-fg` layers.
 */

export type SceneSlug =
  | "01-cockpit"
  | "02-ship-vs-saturn"
  | "03-night-console"
  | "04-message-home"
  | "05-airlock"
  | "06-earth-return";

export type SceneSpec = {
  slug: SceneSlug;
  /** CSS aspect-ratio for the frame before art arrives. */
  aspect: string;
  /** Alt text. Written for someone who will never see the image. */
  alt: string;
  /**
   * Horizontal focal point as a percentage, used for `object-position` when the
   * viewport is narrower than the art. Tuned so no crew member is ever clipped.
   */
  focalX: number;
  /** Parallax depth per layer, back to front. Ignored for flat art. */
  depths: { bg: number; mid: number; fg: number };
  /** What the illustrator needs to draw. Shown in the placeholder. */
  brief: string;
  priority: "supplied" | "essential" | "high" | "medium";
};

export const SCENES: Record<SceneSlug, SceneSpec> = {
  "01-cockpit": {
    slug: "01-cockpit",
    aspect: "1672 / 941",
    alt: "Four crew members seated with their backs to us on the flight deck of a spacecraft, silhouetted against a wide cockpit window. Saturn fills the view ahead, its rings cutting across the frame. Instrument panels glow amber above and below them.",
    // 16:9 framing. The outer crew sit ~11% and ~14% in from the edges, so a
    // centred focal point tolerates roughly 10% of horizontal crop before either
    // outer seat is touched. See the height cap in Cover.tsx.
    focalX: 50,
    depths: { bg: 0.05, mid: 0.02, fg: 0 },
    brief: "Flight deck, four crew from behind, Saturn ahead through the window.",
    priority: "supplied",
  },

  "02-ship-vs-saturn": {
    slug: "02-ship-vs-saturn",
    aspect: "21 / 9",
    alt: "An exterior view: the mission vehicle reduced to a bright sliver against the immense banded face of Saturn. Somewhere in the ring plane, a single pale blue point of light is Earth.",
    focalX: 50,
    depths: { bg: 0.08, mid: 0.03, fg: 0 },
    brief:
      "Exterior wide. Ship almost too small to find against Saturn. Earth a pale dot in the rings — the Cassini photograph, restaged.",
    priority: "medium",
  },

  "03-night-console": {
    slug: "03-night-console",
    aspect: "3 / 2",
    alt: "The ship at night. One crew member sits alone at a console, face and shoulders lit warm amber from the screens in front of them. The rest of the compartment falls away into darkness.",
    focalX: 50,
    depths: { bg: 0.04, mid: 0.02, fg: 0 },
    brief:
      "Interior, ship's night, one figure awake at a console. Amber light from the console is the only warm light in frame — this is her, present in the room.",
    priority: "medium",
  },

  "04-message-home": {
    slug: "04-message-home",
    aspect: "3 / 2",
    alt: "A crew member floats alone in the observation cupola holding a tablet. Taped to the bulkhead beside them is a child's crayon drawing of a ringed planet and two stick figures.",
    focalX: 50,
    depths: { bg: 0.06, mid: 0.025, fg: 0 },
    brief:
      "Cupola, one figure with a tablet, a child's drawing taped to the bulkhead. Quietest scene in the book — it carries the emotional peak, so keep it still.",
    priority: "high",
  },

  "05-airlock": {
    slug: "05-airlock",
    aspect: "3 / 2",
    alt: "The forward airlock. A pressure gauge and warning indicators wash the walls in hard red light. A suited figure is turning back toward the hatch.",
    focalX: 50,
    depths: { bg: 0.04, mid: 0.02, fg: 0 },
    brief:
      "Forward airlock, pressure falling, hard red alert wash. The ONLY scene permitted to use #FF5F52 — its impact depends on being the one red frame in the book.",
    priority: "high",
  },

  "06-earth-return": {
    slug: "06-earth-return",
    // Must match scene 01 exactly — the bookend depends on the same framing.
    aspect: "1672 / 941",
    alt: "The same flight deck window as the opening image, from the same seats — but ahead now is Earth, a small blue and white disc, growing.",
    focalX: 50,
    depths: { bg: 0.05, mid: 0.02, fg: 0 },
    brief:
      "The bookend. MUST reuse scene 01's exact window geometry, framing and seat positions — Earth ahead instead of Saturn. The whole ending depends on the viewer recognising the frame.",
    priority: "essential",
  },
};

/** Candidate filenames for a flat scene image, in preference order. */
export function flatCandidates(slug: SceneSlug): string[] {
  return [`${slug}.webp`, `${slug}.avif`, `${slug}.png`, `${slug}.jpg`, `${slug}.jpeg`];
}

/** Candidate filenames for one parallax layer, in preference order. */
export function layerCandidates(slug: SceneSlug, layer: "bg" | "mid" | "fg"): string[] {
  return [`${slug}-${layer}.webp`, `${slug}-${layer}.avif`, `${slug}-${layer}.png`];
}
