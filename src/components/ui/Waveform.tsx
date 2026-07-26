"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * A horizontal waveform of E.L.S.A.'s voice — the console counterpart to the
 * radial `VoiceOrb`. It rhymes with the waveform hologram in the cockpit
 * illustration, but stays amber, because amber is only ever her voice.
 *
 * Reads amplitude from a ref (see `useElsaVoice`) rather than props, so it
 * animates at display rate without a single React re-render. Idle it holds a low
 * breathing baseline; speaking it pulses. Static under reduced motion.
 */
export function Waveform({
  levelRef,
  active,
  tone = "elsa",
  height = 120,
  bars = 64,
}: {
  levelRef: RefObject<number>;
  /** True while speaking — drives the pulse. */
  active: boolean;
  /** "elsa" = amber (her voice); "crew" = cold blue (a human asking). */
  tone?: "elsa" | "crew";
  height?: number;
  bars?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mirrored into refs so the render loop reads the latest values without being
  // torn down each time they flip (React forbids syncing during render).
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const toneRef = useRef(tone);
  useEffect(() => {
    toneRef.current = tone;
  }, [tone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let width = 0;
    const resize = () => {
      width = canvas.clientWidth || canvas.parentElement?.clientWidth || 600;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Per-bar phase offsets give the field an organic, non-symmetrical response.
    const phases = Array.from({ length: bars }, (_, i) => (i * 2.399) % (Math.PI * 2));
    let smooth = 0;
    let raf = 0;

    const render = (time: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const target = activeRef.current ? (levelRef.current ?? 0) : 0;
      smooth += (target - smooth) * 0.16;

      const t = reduceMotion ? 0 : time * 0.001;
      const breath = 0.5 + 0.5 * Math.sin(t * 0.9);
      const idle = activeRef.current ? 0 : 0.05 + breath * 0.04;
      const energy = Math.max(idle, smooth);

      const mid = height / 2;
      const gap = width / bars;
      const barW = Math.max(1.5, gap * 0.42);
      const isCrew = toneRef.current === "crew";

      for (let i = 0; i < bars; i += 1) {
        const x = gap * (i + 0.5);
        // Centre-weighted so the middle bars run tallest, like a real trace.
        const center = 1 - Math.abs(i / (bars - 1) - 0.5) * 2;
        const centerEnv = 0.32 + 0.68 * Math.pow(Math.max(0, center), 0.8);
        const wobble =
          0.55 +
          0.45 * Math.sin(phases[i] + t * 3.1) * Math.sin(phases[i] * 1.7 + t * 1.3);
        const amp = energy * centerEnv * wobble;
        const h = Math.max(barW, amp * height * 0.9);

        const alpha = 0.22 + energy * 0.7 * (0.5 + wobble * 0.5);
        ctx.fillStyle = isCrew
          ? `rgba(${Math.round(110 - energy * 12)}, ${Math.round(155 + energy * 45)}, 216, ${alpha})`
          : `rgba(255, ${Math.round(176 + energy * 45)}, ${Math.round(103 + energy * 75)}, ${alpha})`;
        ctx.beginPath();
        const bx = x - barW / 2;
        const by = mid - h / 2;
        if (ctx.roundRect) ctx.roundRect(bx, by, barW, h, barW / 2);
        else ctx.rect(bx, by, barW, h);
        ctx.fill();
      }

      // Faint centre baseline so the trace has a horizon even when quiet.
      ctx.strokeStyle = isCrew
        ? `rgba(150, 185, 230, ${0.1 + energy * 0.2})`
        : `rgba(255, 217, 168, ${0.12 + energy * 0.22})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(width, mid);
      ctx.stroke();

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [levelRef, height, bars]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ width: "100%", height }}
      className="block select-none"
    />
  );
}
