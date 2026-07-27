"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The cover film — a slow dolly-in through the cockpit, layered over the still.
 *
 * Three things this deliberately does NOT do:
 *
 * 1. It never replaces the still. `Cover` keeps rendering the `<Image>`
 *    underneath, so the LCP element, the blur placeholder and the no-JavaScript
 *    experience are all exactly what they were before the video existed
 *    (invariant #4 — content is never gated behind a script having run). The
 *    film fades in on top once it can actually play, and if it never can, the
 *    page is simply the page it was.
 *
 * 2. It does not mount under `prefers-reduced-motion`. No CSS can stop a video
 *    autoplaying, and globals.css commits to honouring the OS setting
 *    completely — so the only correct implementation is to not create the
 *    element at all.
 *
 * 3. It does not mount below `lg`. The wide cover is `hidden lg:block`, but
 *    `hidden` does not stop a browser fetching a video source — a phone would
 *    have paid 2.4 MB for an element it never displays. The width is therefore
 *    checked in JS rather than left to CSS, and re-checked on resize so a
 *    desktop window dragged narrow and back still behaves.
 *
 * It sits outside the `warp-image` wrapper on purpose: that animation is a
 * 3.4s scale-and-settle, and the clip already dollies in. Compounding the two
 * would read as a lurch rather than an arrival.
 *
 * It plays once and holds its final frame — deliberately not looped. A slow
 * dolly-in that restarts snaps the camera back to wide every six seconds, which
 * reads as a jump cut. Playing through and settling is the same one-shot
 * "arriving" language as `warp-image`, and a video that has ended keeps its last
 * frame painted, so the cover simply comes to rest.
 */
export function CoverFilm({
  src,
  poster,
  focalX,
}: {
  src: string;
  poster: string;
  /** Matches the still's object-position so the fade doesn't shift the frame. */
  focalX: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wide = window.matchMedia("(min-width: 1024px)");
    const sync = () => setMounted(wide.matches);
    sync();
    wide.addEventListener("change", sync);
    return () => wide.removeEventListener("change", sync);
  }, []);

  // Safari can restore a paused video from bfcache; nudge it once it exists.
  useEffect(() => {
    if (mounted) videoRef.current?.play().catch(() => {});
  }, [mounted]);

  if (!mounted) return null;

  return (
    <video
      ref={videoRef}
      aria-hidden
      autoPlay
      muted
      playsInline
      preload="auto"
      poster={poster}
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
      style={{ objectPosition: `${focalX}% 50%` }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
