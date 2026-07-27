import { Cover } from "@/components/novel/Cover";
import { Starfield } from "@/components/ui/Starfield";
import { TalkFab } from "@/components/ui/TalkFab";
import { TheSilence } from "@/components/sections/TheSilence";
import { TalkToElsa } from "@/components/sections/TalkToElsa";
import { Highlights } from "@/components/sections/Highlights";
import { Personalize } from "@/components/sections/Personalize";
import { PoweredBy } from "@/components/sections/PoweredBy";
import { NoUplink } from "@/components/sections/NoUplink";
import { DesignedFor } from "@/components/sections/DesignedFor";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Starfield />
      <TalkFab />
      <main className="relative">
        <Cover />
        <TheSilence />
        <TalkToElsa />
        <Highlights />
        <Personalize />
        <PoweredBy />
        <NoUplink />
        <DesignedFor />
      </main>
      <footer className="relative z-10 border-t border-seam px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2">
          <div className="space-y-2">
            <p className="text-base text-paper/90">
              Project built by{" "}
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-paper underline decoration-seam-lit underline-offset-4 transition-colors hover:text-elsa hover:decoration-elsa"
              >
                Piera Malatrassi
              </a>
              {" · "}
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-paper underline decoration-seam-lit underline-offset-4 transition-colors hover:text-elsa hover:decoration-elsa"
              >
                GitHub
              </a>
            </p>
            <p className="text-sm text-muted">
              ChatGPT (illustrations) · ElevenLabs (voice, and film with Veo 3.1) · Claude Code · Kimi 3
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
