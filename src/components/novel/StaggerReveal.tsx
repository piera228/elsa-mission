"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Staggered scroll entrance, with no way to strand content invisible.
 *
 * The obvious implementation — render at `opacity: 0` and let an
 * IntersectionObserver restore it — is what blanked everything below the fold
 * earlier in this project when the observer didn't run. So the logic is
 * inverted:
 *
 *  1. Server HTML paints fully visible. Nothing is hidden by default.
 *  2. On mount, the animation is *armed* only if the section is still well below
 *     the viewport, i.e. it is guaranteed to be scrolled into later. Arming sets
 *     the hidden state — off-screen, where the switch cannot be seen.
 *  3. The observer then reveals it on entry.
 *
 * If the element is already on screen at load, or the user prefers reduced
 * motion, it simply stays painted and no observer is created. A script failure
 * degrades to "no animation", never to "no content".
 */
export function StaggerReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only arm when comfortably off-screen, so the hidden state is never seen.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setArmed(true);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-animate={armed ? "on" : undefined}
      data-visible={visible ? "true" : undefined}
    >
      {children}
    </div>
  );
}

/**
 * One staggered child. `delay` is seconds, applied as a transition delay so the
 * items resolve in sequence rather than together.
 */
export function StaggerItem({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`sr-item ${className ?? ""}`}
      style={{ "--sr-delay": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
