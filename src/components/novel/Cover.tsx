import Image from "next/image";
import Link from "next/link";
import cockpit from "../../../public/scenes/01-cockpit.png";
import { COVER } from "@/lib/content";
import { SCENES } from "@/lib/scenes";
import { SceneGrain } from "./SceneCanvas";
import { CoverScrollCue } from "./CoverScrollCue";
import { CoverFilm } from "./CoverFilm";

/**
 * The cover.
 *
 * The art is statically imported rather than resolved off the filesystem like
 * other scenes, which buys three things for the first paint: Next derives the
 * intrinsic dimensions, generates a blur placeholder automatically, and with
 * `priority` emits a preload link for what is unambiguously the LCP element.
 *
 * The arrival animation (`warp-image` / `warp-type`) is pure CSS, so it starts on
 * the first paint instead of waiting for hydration. See globals.css.
 *
 * Layout: the art is 16:9. Height is capped at 62vw so the container ratio never
 * falls far below 1.78, holding horizontal crop to about 5% per side — the outer
 * crew sit ~11% and ~14% in from the edges. At 2560px and wider the crop reaches
 * zero. Below `lg` it becomes a framed panel, because a cover crop against a
 * portrait phone viewport would still discard most of the frame.
 */
export function Cover() {
  const spec = SCENES["01-cockpit"];

  return (
    <header className="relative isolate w-full">
      {/* ---- Wide: full-bleed cinematic ---- */}
      <div className="relative hidden h-[min(100svh,62vw)] min-h-[560px] w-full overflow-hidden lg:block">
        <div className="warp-image absolute inset-0">
          <Image
            src={cockpit}
            alt={spec.alt}
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: `${spec.focalX}% 50%` }}
          />
        </div>
        {/*
          Layered over the still, never instead of it — see CoverFilm. Desktop
          only, and absent entirely under reduced motion.
        */}
        <CoverFilm src="/scenes/01-cockpit.mp4" poster={cockpit.src} focalX={spec.focalX} />
        <SceneGrain />
        <Scrims />

        <div className="absolute inset-0 flex flex-col items-center justify-between px-8 pb-10 pt-9">
          <TelemetryStrip />
          {/*
            Biased upward into the window rather than sitting dead centre. The
            16:9 reframe added headroom above the crew, and a centred stack
            dropped the intro paragraph onto the brightest console cluster.
          */}
          <Titles className="mb-[9vh]" />
          <CoverScrollCue />
        </div>
      </div>

      {/* ---- Narrow: framed panel, art intact ---- */}
      <div className="relative flex min-h-[100svh] w-full flex-col justify-between gap-8 px-5 pb-12 pt-8 sm:px-8 lg:hidden">
        <TelemetryStrip />

        {/*
          The warp transform must live on an *inner* element. Putting `scale(1.11)`
          on the same node that carries `overflow-hidden` expands the layout box
          instead of being clipped by it, which overflowed the viewport
          horizontally on narrow screens for the duration of the animation.
        */}
        <div className="relative overflow-hidden rounded-sm border border-seam">
          <div className="warp-image">
            <Image
              src={cockpit}
              alt={spec.alt}
              priority
              placeholder="blur"
              sizes="100vw"
              className="h-auto w-full"
            />
          </div>
          <SceneGrain />
        </div>

        <Titles />
      </div>
    </header>
  );
}

/**
 * Gradient scrims top and bottom. The art's corners carry bright instrument
 * panels and its lower half carries the consoles, so overlaid type needs
 * guaranteed contrast — a scrim buys it without visibly darkening the image.
 */
function Scrims() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[26%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,6,10,0.86) 0%, rgba(5,6,10,0.45) 50%, transparent 100%)",
        }}
      />
      {/*
        Centre scrim. The title stack sits over Saturn's bright crescent — the
        single brightest region of the frame — so centred type needs its own
        darkening. A soft ellipse keeps the planet readable while giving the type
        a contrast floor; a flat overlay would have flattened the art.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 38% 40% at 50% 44%, rgba(5,6,10,0.74) 0%, rgba(5,6,10,0.5) 52%, rgba(5,6,10,0.12) 82%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%]"
        style={{
          background:
            "linear-gradient(to top, rgba(5,6,10,0.95) 0%, rgba(5,6,10,0.7) 32%, transparent 100%)",
        }}
      />
    </>
  );
}

/** The centred title stack. Reads as one line: E.L.S.A. to Earth — The Human Voice From Home. */
function Titles({ className }: { className?: string }) {
  return (
    <div className={`warp-type flex flex-col items-center text-center ${className ?? ""}`}>
      <h1 className="font-display text-[3.25rem] leading-[0.95] tracking-[0.05em] text-paper sm:text-7xl lg:text-8xl xl:text-[7.5rem]">
        {COVER.wordmark}
      </h1>

      {/* Contrast on the cover is set against the brightest part of the art, not
          against the void, so these run lighter than the same roles elsewhere. */}
      <p className="tel mt-3 !tracking-[0.42em] !text-paper/70">{COVER.toEarth}</p>

      <p className="mt-5 font-display text-2xl leading-tight text-elsa-hot sm:text-3xl lg:text-[2.6rem]">
        {COVER.slogan}
      </p>

      <span aria-hidden className="mt-7 h-px w-16 bg-elsa/50" />

      <p className="tel mt-6 !tracking-[0.26em] !text-elsa">{COVER.expansion}</p>

      <p className="mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed text-paper/75 sm:text-base">
        {COVER.intro}
      </p>
    </div>
  );
}

function TelemetryStrip() {
  return (
    <div className="warp-type flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {COVER.telemetry.map((item, i) => (
        <span key={item} className="flex items-center gap-5">
          {i > 0 ? <span aria-hidden className="hidden h-2.5 w-px bg-seam-lit sm:block" /> : null}
          <span className="tel !text-telemetry-dim">{item}</span>
        </span>
      ))}
      <span className="flex items-center gap-5">
        <span aria-hidden className="hidden h-2.5 w-px bg-seam-lit sm:block" />
        <Link
          href="/about"
          className="tel !text-telemetry-dim underline-offset-4 transition-colors hover:!text-elsa hover:underline"
        >
          Learn about the project ↗
        </Link>
      </span>
    </div>
  );
}
