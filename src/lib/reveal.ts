import type { CSSProperties } from "react";

/** Most items stagger in one after another; later ones share the last delay. */
export const REVEAL_MAX = 6;

/**
 * Class and stagger index for a direct child of a RevealGroup. Lists use it on
 * their own <li> (RevealGroup with wrap={false}) so the markup stays valid.
 * Plain module so server components can call it.
 */
export const revealItem = (i: number, max = REVEAL_MAX) => ({
  className: "reveal-item",
  style: { "--i": Math.min(i, max - 1) } as CSSProperties,
});
