"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * The signature visual: E.L.S.A.'s voice as a radial spectrum around a warm core.
 *
 * Reads its amplitude from a ref (see `useElsaVoice`) rather than from props, so
 * it animates at display rate without triggering a single React re-render.
 * Idle it breathes; speaking it blooms.
 */
export function VoiceOrb({
  levelRef,
  active,
  size = 320,
  spokes = 96,
}: {
  levelRef: RefObject<number>;
  /** True while speaking — drives bloom and spoke reactivity. */
  active: boolean;
  size?: number;
  spokes?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mirrored into a ref so the render loop can read the latest value without
  // being torn down and rebuilt every time `active` flips. Synced in an effect
  // rather than during render, which React does not allow.
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    // Per-spoke phase offsets give the ring an organic, non-symmetrical response.
    const phases = Array.from({ length: spokes }, (_, i) => (i * 2.399) % (Math.PI * 2));
    // Smoothed level so the ring eases rather than snapping.
    let smooth = 0;
    let raf = 0;

    const render = (time: number) => {
      const cx = size / 2;
      const cy = size / 2;
      const baseR = size * 0.235;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const target = activeRef.current ? (levelRef.current ?? 0) : 0;
      smooth += (target - smooth) * 0.16;

      const t = reduceMotion ? 0 : time * 0.001;
      // Idle breathing keeps her present when she isn't speaking.
      const breath = 0.5 + 0.5 * Math.sin(t * 0.9);
      const idle = activeRef.current ? 0 : 0.06 + breath * 0.05;
      const energy = Math.max(idle, smooth);

      /* --- Core glow ------------------------------------------------ */
      const glowR = baseR * (1.25 + energy * 0.9);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0, `rgba(255, 217, 168, ${0.34 + energy * 0.4})`);
      glow.addColorStop(0.42, `rgba(255, 176, 103, ${0.16 + energy * 0.26})`);
      glow.addColorStop(1, "rgba(255, 176, 103, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      /* --- Radial spectrum ----------------------------------------- */
      for (let i = 0; i < spokes; i += 1) {
        const angle = (i / spokes) * Math.PI * 2 - Math.PI / 2;
        const wobble =
          0.55 +
          0.45 *
            Math.sin(phases[i] + t * 2.6) *
            Math.sin(phases[i] * 1.7 + t * 1.13);
        const len = size * 0.028 + energy * wobble * size * 0.15;

        const x1 = cx + Math.cos(angle) * baseR;
        const y1 = cy + Math.sin(angle) * baseR;
        const x2 = cx + Math.cos(angle) * (baseR + len);
        const y2 = cy + Math.sin(angle) * (baseR + len);

        const alpha = 0.2 + energy * 0.7 * (0.5 + wobble * 0.5);
        ctx.strokeStyle = `rgba(255, ${Math.round(176 + energy * 45)}, ${Math.round(103 + energy * 75)}, ${alpha})`;
        ctx.lineWidth = size * 0.0055;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      /* --- Inner ring + core --------------------------------------- */
      ctx.strokeStyle = `rgba(255, 217, 168, ${0.38 + energy * 0.45})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.stroke();

      const coreR = baseR * (0.2 + energy * 0.14);
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      core.addColorStop(0, `rgba(255, 245, 230, ${0.85 + energy * 0.15})`);
      core.addColorStop(1, "rgba(255, 176, 103, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [levelRef, size, spokes]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ width: size, height: size }}
      className="select-none"
    />
  );
}
