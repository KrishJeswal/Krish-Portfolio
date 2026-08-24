import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../lib/env";

const TICK_MS = 26;
const STEP = 2;
/** Beat after the count lands, before the card is thrown. */
const HOLD_MS = 260;
/** The hero starts dealing while the loader is still fading. */
const HERO_MS = 170;
const GONE_MS = 820;

/**
 * A plate dealt onto the page, counting up, then thrown aside. Announces when
 * it's done so the hero can deal its own name in behind it.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [dealt, setDealt] = useState(false);
  const [spent, setSpent] = useState(false);
  const [gone, setGone] = useState(reduced);

  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (reduced) {
      done.current();
      return;
    }

    const frame = requestAnimationFrame(() => setDealt(true));
    const timers: number[] = [];

    const interval = window.setInterval(() => {
      setCount((prev) => {
        const next = prev + STEP;
        if (next < 100) return next;

        window.clearInterval(interval);
        timers.push(
          window.setTimeout(() => {
            setSpent(true);
            timers.push(window.setTimeout(() => done.current(), HERO_MS));
            timers.push(window.setTimeout(() => setGone(true), GONE_MS));
          }, HOLD_MS)
        );
        return 100;
      });
    }, TICK_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(interval);
      timers.forEach(window.clearTimeout);
    };
  }, [reduced]);

  if (gone) return null;

  return (
    <div className={`loader${spent ? " is-clearing" : ""}`} aria-hidden="true">
      <div className={`loader-card${dealt ? " is-dealt" : ""}${spent ? " is-spent" : ""}`}>
        <span className="loader-title">Loading</span>
        <span className="loader-count">{String(count).padStart(3, "0")}</span>
        <div className="loader-track">
          <div className="loader-bar" style={{ width: `${count}%` }} />
        </div>
      </div>
    </div>
  );
}
