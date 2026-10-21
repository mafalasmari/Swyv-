const STEPS = Array.from({ length: 51 }, (_, i) => i / 50);

/**
 * Calls `onEnter` once when `el` scrolls into view, then stops observing.
 * An element counts as in view when `threshold` of it is visible, or, for elements
 * taller than the screen, when it covers that share of the viewport.
 * Returns the disconnect function for effect cleanup.
 */
export function observeOnce(el: Element, onEnter: () => void, threshold = 0.15) {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      const viewport = entry.rootBounds?.height ?? window.innerHeight;
      if (entry.intersectionRatio >= threshold || entry.intersectionRect.height >= viewport * threshold) {
        io.disconnect();
        onEnter();
      }
    },
    // Fine steps so tall elements, whose visible ratio stays small, still get callbacks.
    { threshold: [threshold, ...STEPS] },
  );
  io.observe(el);
  return () => io.disconnect();
}
