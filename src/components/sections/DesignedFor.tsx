import Image from "next/image";
import nasa from "../../../public/logos/nasa.png";
import esa from "../../../public/logos/esa.png";
import { DESIGNED_FOR } from "@/lib/content";
import { Section, Reveal } from "@/components/novel/Chrome";
import { DecodeText } from "@/components/novel/DecodeText";

const ART = { "nasa.png": nasa, "esa.png": esa } as const;

/**
 * "Who this is for" — the intended audience, stated as such.
 *
 * This is deliberately NOT a "trusted by" strip. E.L.S.A. is an independent
 * concept; neither agency has seen it. The eyebrow, the heading and the
 * disclaimer all say "designed for", never "used by", and the disclaimer is
 * part of the component rather than an optional prop so it cannot be dropped by
 * a later edit that only touches copy.
 *
 * Treatment: ESA publish a white mark for dark backgrounds, so theirs is
 * knocked to white in CSS and the asset in `public/` stays the unmodified
 * official artwork. NASA's insignia is left in its own colours — the meatball
 * is only ever correct in blue, and it reads properly against the void. Both
 * sit at reduced opacity so a logo row never out-shouts the argument above it.
 *
 * Server component, no JavaScript.
 */
export function DesignedFor() {
  return (
    <Section id="designed-for" className="!pt-0">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="tel !text-telemetry">{DESIGNED_FOR.eyebrow}</span>
          <span aria-hidden className="h-px flex-1 bg-seam" />
        </div>

        <h2 className="mt-5 font-display text-3xl leading-[1.12] text-paper text-balance sm:text-4xl md:text-5xl">
          <DecodeText text={DESIGNED_FOR.heading} />
        </h2>
      </Reveal>

      <Reveal className="mt-12">
        <div className="hull-panel flex flex-col items-center gap-8 rounded-sm px-6 py-10 sm:px-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-20">
            {DESIGNED_FOR.agencies.map((a, i) => (
              <li key={a.name} className="flex items-center gap-x-12 sm:gap-x-20">
                {i > 0 ? (
                  <span aria-hidden className="hidden h-10 w-px bg-seam-lit sm:block" />
                ) : null}
                <Image
                  src={ART[a.file]}
                  alt={`${a.full} (${a.name})`}
                  height={64}
                  className={
                    a.name === "ESA"
                      ? "h-14 w-auto opacity-80 [filter:brightness(0)_invert(1)] sm:h-16"
                      : "h-14 w-auto opacity-90 sm:h-16"
                  }
                />
              </li>
            ))}
          </ul>

          <p className="tel max-w-[62ch] text-center text-balance !normal-case !tracking-[0.02em] !text-faint">
            {DESIGNED_FOR.disclaimer}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
