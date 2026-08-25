import { useEffect, useState, type RefObject } from "react";

/**
 * Which panel is currently pinned.
 *
 * Measures real offsets rather than dividing scrollY by viewport height. When
 * the panels are sticky those two agree, but below 860px the panels are static
 * and taller than the viewport, and only the offset version stays correct.
 */
export function useActiveSection(ref: RefObject<HTMLElement | null>, count: number): number {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      const panels = Array.from(root.querySelectorAll<HTMLElement>(".panel"));

      /*
        An unstyled panel measures zero, and a stack of zero-height panels all
        sit above the spy line — which resolves to the *last* section rather
        than the first, so the nav opens on Contact 06. Nothing scrolls
        afterwards to correct it, so it would stay there for the whole visit.
        Wait for real heights instead; the observer below fires the moment
        they arrive.
      */
      if (panels.some((panel) => panel.offsetHeight === 0)) return;

      const line = window.scrollY + window.innerHeight * 0.5;

      /*
        Accumulate offsetHeight rather than reading each panel's offsetTop.
        On a sticky element offsetTop reports where it is *currently pinned*,
        not where it sits in the document — while stuck at top:0 every one of
        them returns the same value (the current scrollY), which makes them
        indistinguishable. offsetHeight is unaffected by stickiness, so
        summing it walks the true flow position. Works unchanged below 860px
        where the panels are static and their heights vary.
      */
      let flowTop = root.offsetTop;
      let next = 0;
      panels.forEach((panel, i) => {
        if (flowTop <= line) next = i;
        flowTop += panel.offsetHeight;
      });
      setActive(Math.min(next, count - 1));
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(read);
    };

    /*
      The panels resize without either a scroll or a window resize — the
      stylesheet arriving, a webfont swapping, the deck screenshot loading in.
      Each of those moves the boundaries the spy line is measured against, and
      the first of them is what turns the zero-height bail-out above into a
      real reading.
    */
    const observer = new ResizeObserver(schedule);
    observer.observe(root);

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, count]);

  return active;
}

/**
 * The covered panel recedes as the next one slides over it — a little smaller,
 * a little darker, so the stack reads as depth rather than as a colour change.
 *
 * Off when the panels are unstuck: a static panel taller than the viewport has
 * nothing to recede behind, and the scroll maths assumes one panel per screen.
 */
export function usePanelDepth(ref: RefObject<HTMLElement | null>, enabled: boolean): void {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const panels = Array.from(root.querySelectorAll<HTMLElement>(".panel"));
    const clear = () => {
      panels.forEach((panel) => {
        panel.style.transform = "";
        panel.style.filter = "";
      });
    };

    if (!enabled) {
      clear();
      return;
    }

    let frame = 0;
    const paint = () => {
      frame = 0;
      const vh = window.innerHeight;
      panels.forEach((panel, i) => {
        const t = Math.max(0, Math.min(1, (window.scrollY - i * vh) / vh));
        const e = t * t * (3 - 2 * t); // smoothstep
        panel.style.transform = `scale(${(1 - 0.085 * e).toFixed(4)}) translateY(${(-34 * e).toFixed(2)}px)`;
        panel.style.filter = `brightness(${(1 - 0.55 * e).toFixed(3)})`;
      });
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clear();
    };
  }, [ref, enabled]);
}

export type RollPhase = { offset: number; timing: string; duration: number };

const ROLL_STEP = 34;

/**
 * The numeral rolls to its new position, overshoots by 2px, then settles.
 * Two transitions rather than one bouncy curve, so the overshoot stays 2px
 * whether the tape moved one stop or five.
 */
export function useRollTape(active: number, reduced: boolean): RollPhase {
  const stop = -active * ROLL_STEP;
  const [phase, setPhase] = useState<RollPhase>({ offset: stop, timing: "linear", duration: 0 });

  useEffect(() => {
    if (reduced) {
      setPhase({ offset: stop, timing: "linear", duration: 0 });
      return;
    }

    setPhase((prev) => {
      if (prev.offset === stop) return prev;
      const direction = stop < prev.offset ? -1 : 1;
      return { offset: stop + direction * 2, timing: "cubic-bezier(.3,.9,.2,1)", duration: 420 };
    });

    const id = window.setTimeout(() => {
      setPhase({ offset: stop, timing: "cubic-bezier(.16,1,.3,1)", duration: 260 });
    }, 300);

    return () => window.clearTimeout(id);
  }, [stop, reduced]);

  return phase;
}
