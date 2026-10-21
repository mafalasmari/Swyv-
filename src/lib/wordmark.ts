/**
 * Poppins ExtraBold outlines for "Swyv" (font units, 1000 per em, baseline at
 * y = 1050), extracted from the font so the wordmark never depends on it loading.
 * Shared by the site logo and the intro loader.
 */
export const GLYPHS = [
  {
    char: "S",
    advance: 620,
    d: "M35 831H244Q247 868 266 885Q285 902 315 902Q342 902 359.5 888.5Q377 875 377 851Q377 820 348 803Q319 786 254 765Q185 742 142.5 720.5Q100 699 68.5 657.5Q37 616 37 549Q37 481 71 432.5Q105 384 165 359Q225 334 301 334Q424 334 497.5 391.5Q571 449 576 553H363Q362 521 343.5 505Q325 489 296 489Q274 489 260 502Q246 515 246 539Q246 559 261.5 573.5Q277 588 300 598.5Q323 609 368 625Q435 648 478.5 670.5Q522 693 553.5 733.5Q585 774 585 836Q585 899 553.5 949Q522 999 462.5 1028Q403 1057 322 1057Q199 1057 120 998.5Q41 940 35 831Z",
  },
  { char: "w", advance: 885, d: "M885 489 742 1050H522L444 710L363 1050H144L2 489H197L260 861L343 489H553L639 862L701 489Z" },
  { char: "y", advance: 655, d: "M660 489 304 1317H91L225 1026L-5 489H213L331 807L445 489Z" },
  { char: "v", advance: 649, d: "M325 865 430 489H639L446 1050H202L9 489H218Z" },
] as const;

/** The wordmark's -0.045em tracking, in font units. */
export const TRACKING = -45;

/** x offset of each letter once tracking is applied. */
export const LETTER_X = GLYPHS.reduce<number[]>(
  (xs, g, i) => [...xs, i === 0 ? 0 : xs[i - 1] + GLYPHS[i - 1].advance + TRACKING],
  [],
);

/**
 * The filled V chevron after the "v" (brand device: down = inbound, up = returns).
 * Same geometry as the original text logo: 0.42em wide (420 × 350 units), 82 units
 * after the "v", its base 30 units above the baseline.
 */
const CHEVRON_X = LETTER_X[3] + GLYPHS[3].advance + 82;
const u = 35; // the 12 × 10 chevron grid scaled to 420 × 350
export const CHEVRON_PATH = `M${CHEVRON_X} 635h${3.6 * u}L${CHEVRON_X + 6 * u} ${635 + 4.2 * u} ${CHEVRON_X + 8.4 * u} 635H${CHEVRON_X + 12 * u}L${CHEVRON_X + 6 * u} ${635 + 10 * u}Z`;

/** Tight box around letters + chevron: cap height (334) to the "y" descender (1317). */
export const WORDMARK_VIEWBOX = `20 330 ${CHEVRON_X + 12 * u - 10} 990`;
