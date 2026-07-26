"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The only affordance on the cover: a downward arrow that bobs to read
 * unambiguously as "scroll down", and is a real link to the next section so a
 * click (or keyboard activation) scrolls there. `scroll-behavior: smooth` on
 * <html> makes the jump smooth for free, and it still works with no JavaScript.
 *
 * The outer link carries `warp-type` so it fades in with the delayed titles; the
 * inner element owns the bob, so the two transforms never fight.
 */
export function CoverScrollCue() {
  const reduce = useReducedMotion();
  return (
    <a
      href="#the-silence"
      aria-label="Scroll to the next section"
      className="warp-type block cursor-pointer p-2 text-paper/65 transition-colors duration-300 hover:text-elsa focus-visible:text-elsa focus-visible:outline-none"
    >
      <motion.span
        aria-hidden
        className="block"
        animate={reduce ? undefined : { y: [0, 9, 0] }}
        transition={
          reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v14" />
          <path d="M6 13l6 6 6-6" />
        </svg>
      </motion.span>
    </a>
  );
}
