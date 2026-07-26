"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  /** Base alpha; twinkle modulates around it. */
  a: number;
  /** Twinkle phase offset so stars don't pulse in unison. */
  p: number;
  /** Parallax depth, 0 (far) to 1 (near). */
  d: number;
};

/**
 * A canvas starfield with gentle parallax on scroll.
 *
 * Canvas rather than DOM nodes because we want ~400 stars without 400 elements,
 * and it lets us respect prefers-reduced-motion by simply not running the loop.
 */
export function Starfield({ density = 0.00022 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let stars: Star[] = [];
    let raf = 0;
    let dpr = 1;

    const build = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const count = Math.floor(w * h * density);
      stars = Array.from({ length: count }, () => {
        const d = Math.random();
        return {
          x: Math.random() * w,
          // Distribute over 2 viewport heights so parallax always has material.
          y: Math.random() * h * 2,
          r: 0.35 + d * 1.05,
          a: 0.25 + Math.random() * 0.6,
          p: Math.random() * Math.PI * 2,
          d,
        };
      });
    };

    const draw = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scrollY = window.scrollY;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        // Nearer stars drift more against the scroll.
        const parallax = scrollY * (0.02 + s.d * 0.09);
        // Continuous forward travel: the field streams past even when the page
        // is still, so it reads as motion through space. Nearer stars move
        // faster, which is what gives the sense of depth and speed.
        const travel = reduceMotion ? 0 : time * (0.0035 + s.d * 0.011);
        let y = s.y - parallax + travel;
        // Wrap within the 2h band so the field never runs out.
        const band = h * 2;
        y = ((y % band) + band) % band;
        if (y > h + 2) continue;

        const twinkle = reduceMotion ? 1 : 0.72 + 0.28 * Math.sin(time * 0.0011 + s.p);
        ctx.globalAlpha = Math.min(1, s.a * twinkle);
        // Warmer tint on the nearest stars keeps the field from reading blue-grey.
        ctx.fillStyle = s.d > 0.82 ? "#fff0dc" : "#dfe8f6";
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    build();
    if (reduceMotion) {
      draw(0);
      const onScroll = () => draw(0);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", () => {
        build();
        draw(0);
      });
      return () => window.removeEventListener("scroll", onScroll);
    }

    raf = requestAnimationFrame(loop);
    const onResize = () => build();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)" }}
    />
  );
}
