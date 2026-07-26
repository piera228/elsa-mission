"use client";

import { useEffect, useRef, useState } from "react";
import { primeTypeSound, typeTick } from "@/lib/type-sound";

/** Glyphs the scramble draws from. Restrained — signal noise, not Matrix rain. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|<>=+*·:";

const DURATION_MS = 700;
/**
 * How many characters are actively scrambling ahead of the resolve point, as a
 * fraction of the string. A narrow window keeps word shapes readable, so it
 * reads as a signal locking on rather than as noise.
 */
const WINDOW_FRACTION = 0.18;

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Per-character decode reveal, resolving left to right.
 *
 * Two constraints shape the whole implementation:
 *
 * **1. Content must never depend on JavaScript.** The real string is server
 * rendered, in flow, and visible. The effect is armed only when the element is
 * still below the fold — off-screen, where switching to the hidden state cannot
 * be seen — and skipped entirely under reduced motion or if already on screen.
 * A failed script degrades to "no animation", never to "no text".
 *
 * **2. It must not shift layout.** Scrambling a proportional serif changes glyph
 * widths, which would reflow the headline and shove the page around for the
 * duration. So the real text always stays in flow and owns the box; the
 * scrambling copy renders in an `absolute inset-0` overlay where differing
 * widths cannot affect anything.
 *
 * Accessibility: the wrapper carries `aria-label` with the true string and the
 * animating layer is `aria-hidden`, so assistive tech never sees scramble output.
 */
export function DecodeText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [scrambled, setScrambled] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only arm when comfortably below the viewport, so the switch to the
    // scrambled overlay is never visible as a flash.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    // Attach the audio unlock listeners early so a click before this scrolls into
    // view is enough to let the typing ticks play.
    primeTypeSound();

    const chars = Array.from(text);
    const windowSize = Math.max(3, Math.floor(chars.length * WINDOW_FRACTION));

    const run = () => {
      const start = performance.now();

      const frame = () => {
        const t = Math.min(1, (performance.now() - start) / DURATION_MS);
        // Everything left of `resolved` is final; a short window past it churns.
        const resolved = t * chars.length;

        let out = "";
        for (let i = 0; i < chars.length; i += 1) {
          const ch = chars[i];
          // Spaces and punctuation are never scrambled — they preserve word
          // shape, which is what keeps the line legible while it resolves.
          if (i < resolved || ch === " " || /[.,'’—-]/.test(ch)) {
            out += ch;
          } else if (i < resolved + windowSize) {
            out += randomGlyph();
          } else {
            // Not yet reached: blank, so the line appears to arrive rather than
            // sit there as a full block of noise.
            out += " ";
          }
        }

        if (t >= 1) {
          setScrambled(null);
          rafRef.current = null;
          return;
        }
        // A subtle keyboard-style tick as the line types in (self-throttled).
        typeTick();
        setScrambled(out);
        rafRef.current = requestAnimationFrame(frame);
      };

      rafRef.current = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            io.disconnect();
            run();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [text]);

  const decoding = scrambled !== null;

  return (
    <span ref={ref} className={`relative inline-block ${className ?? ""}`} aria-label={text}>
      {/* Always in flow — owns the layout box whether decoding or not. */}
      <span aria-hidden={decoding} style={{ opacity: decoding ? 0 : 1 }}>
        {text}
      </span>

      {decoding ? (
        <span aria-hidden className="absolute inset-0">
          {scrambled}
        </span>
      ) : null}
    </span>
  );
}
