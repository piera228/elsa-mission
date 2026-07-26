"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; vx: number; vy: number };

/**
 * A very sparse, very slow starfield scoped to one section.
 *
 * Distinct from the global `Starfield`, which twinkles and parallaxes on scroll.
 * This one only drifts — a few dozen stars moving at fractions of a pixel per
 * frame, so the motion registers as unease rather than as animation. Kept
 * deliberately sparse because the global field also shows through here, and this
 * section should read emptier than the rest of the page, not busier.
 *
 * Sizes itself to its parent, so it works at any section height.
 */
export function DriftField({ count = 55 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const build = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 0.9,
        a: 0.12 + Math.random() * 0.5,
        // Fractions of a pixel per frame — imperceptible frame to frame.
        vx: (Math.random() - 0.5) * 0.055,
        vy: (Math.random() - 0.5) * 0.035,
      }));
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        // Wrap, so the field never empties out.
        if (s.x < -2) s.x = w + 2;
        else if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;
        else if (s.y > h + 2) s.y = -2;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    build();
    draw();

    const observer = new ResizeObserver(() => {
      build();
      draw();
    });
    observer.observe(parent);

    if (!reduceMotion) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [count]);

  // pointer-events-none is required: the canvas covers the whole section, and
  // without it the field swallows text selection and clicks.
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}
