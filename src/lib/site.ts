/**
 * Site-level identity. Edit these before deploying.
 */
export const SITE = {
  name: "E.L.S.A.",
  expansion: "Eleven Labs Stellar Assistant",
  slogan: "The Human Voice From Home",
  description:
    "E.L.S.A. — a concept for the onboard voice of a crewed deep-space mission, and the case that space is where voice AI stops being convenient and becomes critical. Built on ElevenLabs.",

  author: "Piera Malatrassi",
  linkedin: "https://www.linkedin.com/in/piera-malatrassi/",

  email: "pieramalatrassi.mb@gmail.com",
  github: "https://github.com/piera228",
  /** Drives metadataBase and the OpenGraph URL in layout.tsx. */
  url: "https://elsa-mission.vercel.app",
} as const;

/**
 * Mission figures quoted on the site, kept here so they cannot drift between
 * sections. All of them are real.
 *
 * Light time to Saturn is 66–86 minutes one way depending on where the two
 * planets sit in their orbits, so the round trip to anyone who could help runs
 * to 2h 53m at worst. That single fact is why the voice has to be onboard.
 */
export const MISSION = {
  /** One-way light time, minutes, at the point the site is set. */
  owltMinutes: 80,
  /** Worst-case round trip to Mission Control. */
  roundTrip: "2h 53m",
  roundTripSeconds: 10_380,
  /** Full onboard hear → reason → speak loop. */
  onboardSeconds: 0.8,
  crew: 4,
  missionYears: 7,
  /** Pressure held by an EVA glove against vacuum. */
  glovePsi: 4.3,
} as const;
