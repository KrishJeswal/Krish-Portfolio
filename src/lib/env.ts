import { useEffect, useState } from "react";

/**
 * Subscribes to a media query.
 *
 * Always starts false and resolves in an effect, rather than reading
 * matchMedia during render. The pages are prerendered to static HTML at build
 * time, where there is no window at all — and even in the browser, reading the
 * real value on the first render would disagree with the prerendered markup
 * and trip a hydration mismatch. One extra tick is cheaper than that.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Motion is clamped, not just shortened — entering elements are forced visible. */
export const useReducedMotion = (): boolean =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/** The cursor blob and any hover-only affordance need a real pointer. */
export const useFinePointer = (): boolean => useMediaQuery("(hover: hover) and (pointer: fine)");

/** Below this the home page's sticky full-height panels are disabled. */
export const UNSTICK_BREAKPOINT = 860;

export const useIsUnstuck = (): boolean =>
  useMediaQuery(`(max-width: ${UNSTICK_BREAKPOINT}px)`);

/** Below this the case-study rail becomes a bottom sheet. */
export const RAIL_BREAKPOINT = 1200;

export const useIsSheet = (): boolean => useMediaQuery(`(max-width: ${RAIL_BREAKPOINT}px)`);
