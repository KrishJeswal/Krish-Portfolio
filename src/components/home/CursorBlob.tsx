import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { useFinePointer, useReducedMotion } from "../../lib/env";

/** How hard the blob chases the pointer each frame. */
const BLOB_LERP = 0.28;
const DOT_LERP = 0.4;
const RING_LERP = 0.11;
/** Wobble clock advance per frame. */
const WOBBLE_STEP = 0.042;
/** Pointer speed at which the blob's stretch tops out. */
const SPEED_CAP = 46;

const BLOB_MIN = 112;
const BLOB_MAX = 272;

/** Elements that a real copy of the pointer should react to. */
const HOT = "a,button,[role='button'],input,textarea,select";

export type Mirror = {
  /** The live element whose position and size the copy tracks. */
  ref: RefObject<HTMLElement | null>;
  /** Layout classes to reuse so the copy lays out identically. */
  className?: string;
  /** The same content, rendered again — not a DOM clone, so it stays in sync. */
  node: ReactNode;
};

/**
 * Custom pointer, plus the hero knockout blob.
 *
 * The blob only comes up over the hero, and only at the top of the page. All
 * of it is off on touch devices and under reduced motion, where the native
 * cursor is left alone.
 */
export default function CursorBlob({
  hostRef,
  sizeRef,
  mirrors,
}: {
  /** The area the blob comes up over. */
  hostRef: RefObject<HTMLElement | null>;
  /** Sized off the hero type, so the blob scales with the headline. */
  sizeRef: RefObject<HTMLElement | null>;
  mirrors: readonly Mirror[];
}) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const knockRef = useRef<HTMLDivElement>(null);
  const mirrorRefs = useRef<(HTMLDivElement | null)[]>([]);

  // The copies re-render whenever their content changes; the rAF loop only
  // ever needs the current list, so hold it in a ref rather than a dependency.
  // Depending on it would tear down and restart the loop on every render.
  const mirrorsRef = useRef(mirrors);
  mirrorsRef.current = mirrors;

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const knock = knockRef.current;
    if (!dot || !ring || !knock) return;

    document.documentElement.classList.add("is-blobbed");

    const half = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    // pointer, then the three things chasing it at their own rates
    let mx = half.x;
    let my = half.y;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let kx = mx;
    let ky = my;
    let clock = 0;
    let over = false;

    const showPointer = (visible: boolean) => {
      dot.classList.toggle("is-up", visible);
      ring.classList.toggle("is-up", visible);
    };

    const setOver = (next: boolean) => {
      if (next === over) return;
      over = next;
      if (over) {
        // start the blob where the pointer is, so it doesn't fly in
        kx = mx;
        ky = my;
      }
      knock.classList.toggle("is-up", over);
      showPointer(!over);
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;

      const host = hostRef.current;
      let inside = false;
      if (host && window.scrollY < 4) {
        const b = host.getBoundingClientRect();
        inside = mx > b.left && mx < b.right && my > b.top && my < b.bottom;
      }
      setOver(inside);

      if (!over) {
        // Unconditional, not folded into setOver: the native cursor is hidden
        // from mount, and setOver short-circuits when nothing changed — so if
        // the pointer's first move is outside the hero (the common case),
        // gating this on a state change leaves the page with no pointer at all.
        showPointer(true);
        const target = e.target;
        const hot = target instanceof Element && target.closest(HOT) !== null;
        ring.classList.toggle("is-hot", hot);
      }
    };

    const drop = () => setOver(false);

    // Sized off the headline so the blob scales with the type. Measured on
    // setup and on resize rather than per frame — getComputedStyle in a rAF
    // loop forces a style recalc on every tick, and the answer only changes
    // when the viewport does.
    let radiusPx = 0;
    const sizeBlob = () => {
      const word = sizeRef.current?.querySelector(".hero-word");
      const fontSize = word ? parseFloat(getComputedStyle(word).fontSize) : 90;
      const size = Math.max(BLOB_MIN, Math.min(BLOB_MAX, (fontSize || 90) * 1.32));
      radiusPx = size / 2;
      knock.style.width = `${size}px`;
      knock.style.height = `${size}px`;
    };
    sizeBlob();

    // Eight radii — four horizontal, four vertical — each summing two sine
    // waves on incommensurate periods, plus a speed term that stretches the
    // blob while the pointer is moving fast.
    const radius = (f1: number, p1: number, f2: number, p2: number, speed: number): string =>
      `${(
        50 +
        13 * Math.sin(clock * f1 + p1) +
        7 * Math.sin(clock * f2 + p2) +
        10 * speed * Math.sin(clock * 0.7 + p1)
      ).toFixed(2)}%`;

    let frame = 0;
    const loop = () => {
      dx += (mx - dx) * DOT_LERP;
      dy += (my - dy) * DOT_LERP;
      rx += (mx - rx) * RING_LERP;
      ry += (my - ry) * RING_LERP;
      dot.style.transform = `translate(${dx}px,${dy}px)`;
      ring.style.transform = `translate(${rx}px,${ry}px)`;

      if (over) {
        clock += WOBBLE_STEP;

        const vx = mx - kx;
        const vy = my - ky;
        kx += vx * BLOB_LERP;
        ky += vy * BLOB_LERP;
        const speed = Math.min(1, Math.hypot(vx, vy) / SPEED_CAP);

        // Centre on the pointer here rather than with a negative margin, so
        // the blob's top-left is exactly (kx - r, ky - r) — which is the
        // origin the mirror positioning below is measured against.
        const r = radiusPx;
        knock.style.transform = `translate(${kx - r}px,${ky - r}px)`;
        knock.style.borderRadius = [
          radius(1.0, 0.0, 2.3, 1.1, speed),
          radius(0.83, 2.2, 1.91, 4.0, speed),
          radius(1.21, 4.1, 2.07, 0.5, speed),
          radius(0.72, 5.7, 2.61, 2.8, speed),
          "/",
          radius(0.91, 1.4, 2.44, 3.3, speed),
          radius(1.13, 3.6, 1.77, 5.1, speed),
          radius(0.79, 5.2, 2.19, 1.8, speed),
          radius(1.07, 0.7, 2.53, 4.6, speed),
        ].join(" ");

        // Park each copy so it lands exactly over its source. The blob's
        // top-left in viewport space is (kx - r, ky - r).
        mirrorsRef.current.forEach((mirror, i) => {
          const source = mirror.ref.current;
          const copy = mirrorRefs.current[i];
          if (!source || !copy) return;
          const rect = source.getBoundingClientRect();
          copy.style.width = `${rect.width}px`;
          copy.style.height = `${rect.height}px`;
          copy.style.left = `${rect.left - (kx - r)}px`;
          copy.style.top = `${rect.top - (ky - r)}px`;
        });
      }

      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("resize", sizeBlob);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", drop, { passive: true });
    window.addEventListener("blur", drop);
    document.addEventListener("pointerleave", drop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", sizeBlob);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", drop);
      window.removeEventListener("blur", drop);
      document.removeEventListener("pointerleave", drop);
      document.documentElement.classList.remove("is-blobbed");
    };
  }, [enabled, hostRef, sizeRef]);

  if (!enabled) return null;

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="knock" ref={knockRef} aria-hidden="true" inert>
        {mirrors.map((mirror, i) => (
          <div
            key={i}
            className={`knock-mirror${mirror.className ? ` ${mirror.className}` : ""}`}
            ref={(el) => {
              mirrorRefs.current[i] = el;
            }}
          >
            {mirror.node}
          </div>
        ))}
      </div>
    </>
  );
}
