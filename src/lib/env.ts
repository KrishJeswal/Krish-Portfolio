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
function useMediaQuery(query: string): boolean {
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

export const useReducedMotion = (): boolean =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

export const useFinePointer = (): boolean => useMediaQuery("(hover: hover) and (pointer: fine)");

const UNSTICK_BREAKPOINT = 860;

export const useIsUnstuck = (): boolean =>
  useMediaQuery(`(max-width: ${UNSTICK_BREAKPOINT}px)`);

const RAIL_BREAKPOINT = 1200;

export const useIsSheet = (): boolean => useMediaQuery(`(max-width: ${RAIL_BREAKPOINT}px)`);
