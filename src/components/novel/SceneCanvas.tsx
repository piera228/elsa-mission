"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { SceneSpec } from "@/lib/scenes";

type Layers = { bg: string; mid: string | null; fg: string };

/**
 * Renders a scene's art with scroll parallax when layers are supplied.
 *
 * `bleed` scenes go edge-to-edge on wide viewports and become framed panels
 * below `lg` — the cover art is 2.11:1, which would lose ~80% of the frame to a
 * `cover` crop on a phone. A bordered panel is both more legible and more
 * graphic-novel than a crop.
 */
export function SceneCanvas({
  spec,
  flat,
  layers,
  bleed,
  priority,
  className,
}: {
  spec: SceneSpec;
  flat: string | null;
  layers: Layers | null;
  bleed: boolean;
  priority: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Depth is expressed as a fraction of the frame height; nearer layers move less.
  const bgY = useTransform(scrollYProgress, [0, 1], [`${spec.depths.bg * -100}%`, `${spec.depths.bg * 100}%`]);
  const midY = useTransform(scrollYProgress, [0, 1], [`${spec.depths.mid * -100}%`, `${spec.depths.mid * 100}%`]);

  const objectPosition = `${spec.focalX}% 50%`;

  const frame = bleed
    ? "relative w-full overflow-hidden"
    : "relative w-full overflow-hidden rounded-sm border border-seam";

  if (flat && !layers) {
    return (
      <div ref={ref} className={`${frame} ${className ?? ""}`} style={{ aspectRatio: spec.aspect }}>
        <Image
          src={flat}
          alt={spec.alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
        <SceneGrain />
      </div>
    );
  }

  if (!layers) return null;

  return (
    <div ref={ref} className={`${frame} ${className ?? ""}`} style={{ aspectRatio: spec.aspect }}>
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y: bgY }}>
        <Image
          src={layers.bg}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      </motion.div>

      {layers.mid ? (
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y: midY }}>
          <Image src={layers.mid} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition }} />
        </motion.div>
      ) : null}

      {/* Foreground carries the alt text — it's the layer with the subject in it. */}
      <div className="absolute inset-0">
        <Image
          src={layers.fg}
          alt={spec.alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>

      <SceneGrain />
    </div>
  );
}

/**
 * Fine film grain over every scene.
 *
 * Two jobs: it ties supplied art and coded placeholders into one visual family,
 * and it masks softness when an image is displayed above its native resolution
 * (the cover is 1823 px wide, which a retina viewport will upscale).
 */
export function SceneGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
