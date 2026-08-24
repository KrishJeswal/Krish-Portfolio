import { useEffect, useState, type RefObject } from "react";
import type { CaseSectionId } from "../data/projects";

/** Where on screen a section counts as "the one you're reading". */
const SPY_LINE = 0.36;

/**
 * Active section = the last one whose top has passed the spy line.
 * Not an IntersectionObserver: sections here are taller than the viewport, so
 * two are usually intersecting at once and "which is active" is a decision
 * about a single line, not about overlap.
 */
export function useScrollSpy(
  ref: RefObject<HTMLElement | null>,
  ids: readonly CaseSectionId[]
): CaseSectionId {
  const [active, setActive] = useState<CaseSectionId>(ids[0]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * SPY_LINE;
      let next = ids[0];
      for (const id of ids) {
        const el = root.querySelector<HTMLElement>(`[data-sec="${id}"]`);
        if (el && el.offsetTop <= line) next = id;
      }
      setActive(next);
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, ids]);

  return active;
}

/**
 * Which sections have entered view at least once. Entering is a one-way trip —
 * scrolling back up must not replay the animation.
 */
export function useEntered(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean
): ReadonlySet<string> {
  const [entered, setEntered] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-enter]"));

    if (!enabled) {
      setEntered(new Set(targets.map((el) => el.dataset.enter ?? "")));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const arrived = entries.filter((e) => e.isIntersecting).map((e) => (e.target as HTMLElement).dataset.enter ?? "");
        if (arrived.length === 0) return;
        setEntered((prev) => {
          const next = new Set(prev);
          arrived.forEach((id) => next.add(id));
          return next;
        });
      },
      { rootMargin: "0px 0px -18% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref, enabled]);

  return entered;
}
