"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TALK, THE_SILENCE } from "@/lib/content";

const TARGET = THE_SILENCE.ctaTarget;

/**
 * A standing invitation to the console, for readers who scrolled past the one
 * in "The silence" without taking it.
 *
 * It is the same link as that button, not a second mechanism: an anchor to
 * #use-case-talk, which is what mounts TalkToElsa (the section listens for that
 * hash and scrolls itself into view once it opens). Keeping it an <a> means
 * keyboard activation, middle-click and the no-JavaScript path all behave, and
 * there is nothing to keep in sync if the hand-off ever changes.
 *
 * It appears only when it can help, which is the whole point of it:
 *
 *  - Not over the cover. It waits until the reader is a screen down, so the
 *    opening frame is never covered by a floating control.
 *  - Not once the console is open. At that point the section exists in the page
 *    and the button would be offering to take you somewhere you already are.
 *    Landing on a #use-case-talk URL therefore never shows it at all.
 *
 * Amber, matching the CTA it duplicates: this is an offer to hear her, and
 * amber is her voice (invariant #1). The panel is tinted and blurred rather
 * than solid so it reads as an overlay on the page instead of a hole in it.
 */
export function TalkFab() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const sync = () => {
      const opened = window.location.hash === `#${TARGET}`;
      const pastCover = window.scrollY > window.innerHeight * 0.9;
      setVisible(pastCover && !opened);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("hashchange", sync);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          key="talk-fab"
          href={`#${TARGET}`}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="group fixed bottom-5 left-5 z-50 inline-flex items-center gap-2.5 rounded-sm border border-elsa/45 bg-void/85 px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-elsa shadow-[0_8px_30px_-12px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-colors duration-300 hover:border-elsa hover:bg-elsa/[0.12] focus-visible:border-elsa focus-visible:outline-none sm:bottom-8 sm:left-8 sm:px-5 sm:py-3.5 sm:text-xs"
        >
          <span aria-hidden className="signal-pulse block h-2 w-2 shrink-0 rounded-full bg-elsa" />
          <span>{TALK.heading}</span>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
