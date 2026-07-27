/**
 * Site-level identity. Edit these before deploying.
 */
export const SITE = {
  name: "E.L.S.A.",
  expansion: "Eleven Labs Stellar Assistant",
  slogan: "The Human Voice From Home",
  description:
    "E.L.S.A. is a concept for the onboard voice of a crewed deep-space mission, and the case that space is where voice AI stops being convenient and becomes critical. Built on ElevenLabs.",

  author: "Piera Malatrassi",
  linkedin: "https://www.linkedin.com/in/piera-malatrassi/",

  email: "pieramalatrassi.mb@gmail.com",
  /** The repository, not the profile: both places that use it mean "the source". */
  github: "https://github.com/piera228/elsa-mission",
  /** Drives metadataBase and the OpenGraph URL in layout.tsx. */
  url: "https://elsa-mission.vercel.app",
} as const;

/**
 * Mission figures quoted on the site, kept here so they cannot drift between
 * sections. All of them are real.
 *
 * Light time to Saturn runs 66–86 minutes one way depending on where the two
 * planets sit in their orbits. The site fixes on 80, and every other figure
 * below follows from it: the round trip is exactly twice that. It used to
 * quote the worst case (86.5 one way, 2h 53m round trip) alongside the 80,
 * which meant two sections stated two different round trips. One number, doubled,
 * is easier to trust than two correct ones that disagree.
 *
 * That single fact is why the voice has to be onboard.
 */
export const MISSION = {
  /** One-way light time, minutes, at the point the site is set. */
  owltMinutes: 80,
  /**
   * The same distance in kilometres, for the places that state it as a
   * distance rather than a delay: 299,792.458 km/s × 4,800 s = 1,439,003,798 km,
   * quoted to three significant figures. It matches the 1.44 billion km that
   * Cassini's pale-blue-dot frame is already given at elsewhere in the copy.
   *
   * Light-years are the wrong unit by six orders of magnitude here — this is
   * 0.00015 of one — and AU (9.62) means nothing to a general reader.
   *
   * This lives in MISSION rather than in the headline because that headline has
   * now been restated four different ways, and every one of them had to agree
   * with owltMinutes to be true.
   */
  distanceKm: "1.44 billion kilometres",
  /** Round trip to Mission Control: owltMinutes, there and back. */
  roundTrip: "2h 40m",
  roundTripSeconds: 9_600,
  /** Full onboard hear → reason → speak loop. */
  onboardSeconds: 0.8,
  crew: 4,
  missionYears: 7,
  /** Pressure held by an EVA glove against vacuum. */
  glovePsi: 4.3,
} as const;
