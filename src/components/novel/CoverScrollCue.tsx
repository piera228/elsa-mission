"use client";

import type { MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * The only affordance on the cover: a downward arrow that bobs to read
 * unambiguously as "scroll down", and is a real link to the next section so a
 * click (or keyboard activation) scrolls there.
 *
 * It stays an `<a href="#the-silence">` so it works with no JavaScript, but the
 * click is intercepted and the scroll done by hand, because the native jump
 * writes "#the-silence" into the address bar and leaves it there. A stuck hash
 * is not cosmetic: reload, reopen the tab, or share that URL and the page opens
 * halfway down with the cover never seen. Scrolling without touching history
 * avoids that entirely.
 *
 * Modified clicks are left alone so open-in-new-tab still behaves, and if the
 * target is somehow missing the handler falls through to the native jump rather
 * than swallowing the click.
 *
 * The outer link carries `warp-type` so it fades in with the delayed titles; the
 * inner element owns the bob, so the two transforms never fight.
 */
export function CoverScrollCue() {
  const reduce = useReducedMotion();

  const scrollDown = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById("the-silence");
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <a
      href="#the-silence"
      onClick={scrollDown}
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
