"use client";

/**
 * A tiny synthesised "typing" tick — a short filtered noise burst — played as
 * text decodes in. There is no audio asset: it's generated with the Web Audio
 * API so it ships with the site and stays subtle.
 *
 * Browser audio policy: sound can only start after the user has interacted with
 * the page (a click, key, or touch). The context is created lazily and resumed
 * on the first such gesture; before that, ticks are silently skipped.
 */

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let lastTick = 0;
let muted = false;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;

  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    return null;
  }

  // One short noise buffer, reused for every tick.
  const dur = 0.04;
  noise = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;

  const resume = () => {
    if (ctx && ctx.state !== "running") ctx.resume().catch(() => {});
  };
  // Unlock on the first user gesture of any kind. Per browser policy a plain
  // desktop mouse-wheel scroll may not count on its own, but touch scrolling, any
  // click, or keyboard scrolling (space / page-down / arrows) unlocks it — after
  // which every scroll-in decode plays.
  const opts = { passive: true } as const;
  window.addEventListener("pointerdown", resume, opts);
  window.addEventListener("keydown", resume, opts);
  window.addEventListener("touchstart", resume, opts);
  window.addEventListener("touchmove", resume, opts);
  window.addEventListener("wheel", resume, opts);
  window.addEventListener("scroll", resume, opts);

  return ctx;
}

/** Create the context and attach the unlock listeners early (call on mount). */
export function primeTypeSound() {
  ensure();
}

/** Master mute for the UI sounds (typing ticks and the boot effect). */
export function setSoundMuted(next: boolean) {
  muted = next;
}

/** Resume the audio context from a user gesture — used by the sound toggle. */
export function unlockSound() {
  ensure()?.resume().catch(() => {});
}

/** True once the audio context has actually started (a gesture has unlocked it). */
export function isSoundUnlocked() {
  return !!ctx && ctx.state === "running";
}

let bootAudio: HTMLAudioElement | null = null;

/** The sci-fi power-up on "Initialize" — a real audio file from /public/sfx. */
export function bootSound() {
  if (typeof window === "undefined" || muted) return;
  try {
    if (!bootAudio) {
      bootAudio = new Audio("/sfx/boot.mp3");
      bootAudio.preload = "auto";
      bootAudio.volume = 0.32;
    }
    bootAudio.currentTime = 0;
    void bootAudio.play().catch(() => {});
  } catch {
    /* playback blocked — ignore */
  }
}

/** Play one subtle tick, throttled so a fast decode reads as typing, not a buzz. */
export function typeTick(minGapMs = 45) {
  if (muted) return;
  const c = ensure();
  if (!c || c.state !== "running" || !noise) return;

  const now = performance.now();
  if (now - lastTick < minGapMs) return;
  lastTick = now;

  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noise;

  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1400 + Math.random() * 1600;
  bp.Q.value = 0.7;

  const gain = c.createGain();
  const peak = 0.11 + Math.random() * 0.05;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

  src.connect(bp);
  bp.connect(gain);
  gain.connect(c.destination);
  src.start(t);
  src.stop(t + 0.04);
}
