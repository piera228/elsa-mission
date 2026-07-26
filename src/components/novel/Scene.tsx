import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { SCENES, flatCandidates, layerCandidates, type SceneSlug } from "@/lib/scenes";
import { SceneCanvas } from "./SceneCanvas";

const SCENES_DIR = path.join(process.cwd(), "public", "scenes");

/**
 * Resolve the first candidate filename that actually exists on disk.
 *
 * This runs at build time — the page is statically rendered, so the result is
 * baked into the output and there is no filesystem access at request time.
 * The effect is that dropping art into `public/scenes/` activates it on the next
 * build with no code change, and until then the coded placeholder is used.
 */
function resolveArt(candidates: string[]): string | null {
  for (const name of candidates) {
    if (fs.existsSync(path.join(SCENES_DIR, name))) return `/scenes/${name}`;
  }
  return null;
}

export type SceneProps = {
  slug: SceneSlug;
  /** Coded stand-in shown until real art exists. */
  placeholder: ReactNode;
  /** Full-bleed on wide viewports, framed panel on narrow ones. */
  bleed?: boolean;
  /** Set on the cover only — emits a preload link for the LCP element. */
  priority?: boolean;
  className?: string;
};

export function Scene({
  slug,
  placeholder,
  bleed = false,
  priority = false,
  className,
}: SceneProps) {
  const spec = SCENES[slug];

  // Layered art wins over flat art when both are present.
  const bg = resolveArt(layerCandidates(slug, "bg"));
  const mid = resolveArt(layerCandidates(slug, "mid"));
  const fg = resolveArt(layerCandidates(slug, "fg"));
  const flat = resolveArt(flatCandidates(slug));

  const layers = bg && fg ? { bg, mid, fg } : null;

  if (!layers && !flat) {
    return (
      <div className={className} style={{ aspectRatio: spec.aspect }}>
        {placeholder}
      </div>
    );
  }

  return (
    <SceneCanvas
      spec={spec}
      flat={flat}
      layers={layers}
      bleed={bleed}
      priority={priority}
      className={className}
    />
  );
}
