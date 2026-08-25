import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../../data/projects";
import SectionEyebrow from "./SectionEyebrow";

const FLING_THRESHOLD = 80;
/** Below this the gesture hasn't committed to an axis yet. */
const AXIS_SLOP = 5;
/** Opacity floor while dragging, reached after this much travel. */
const FADE_TRAVEL = 560;
/** The fling transition, after which the deck advances. */
const FLING_MS = 380;

/** Depth 0 is the front card; 1, 2, 3 sit behind it. */
function deckTransform(depth: number, index: number): string {
  const tilt = depth === 0 ? 0 : (index % 2 ? 1 : -1) * (2.8 + depth * 1.3);
  return `translate(-50%,-50%) translateY(${depth * -22}px) scale(${1 - depth * 0.045}) rotate(${tilt}deg)`;
}

function depthOf(cardIndex: number, active: number, count: number): number {
  return (((cardIndex - active) % count) + count) % count;
}

type Fling = { card: number; dir: 1 | -1 };

/**
 * The deck.
 *
 * Releasing past the threshold throws the card off toward the drag direction,
 * but the deck always advances forward — swiping left and swiping right both
 * go to the next project. A tap advances too, so clicking cycles the deck.
 */
export default function Work({ active }: { active: boolean }) {
  const count = projects.length;
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState<number | null>(null);
  const [fling, setFling] = useState<Fling | null>(null);
  const [snap, setSnap] = useState<number | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const flingTimer = useRef<number | undefined>(undefined);

  // Live gesture bookkeeping. None of this belongs in state — it changes on
  // every pointer event and only the resulting offset needs to render.
  const gesture = useRef({
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    dx: 0,
    axis: null as "x" | "y" | null,
    moved: false,
  });

  const advance = (step: number) => {
    // A queued fling has to be settled before the next gesture, or its card
    // would animate back across the screen from wherever it was thrown.
    window.clearTimeout(flingTimer.current);
    if (fling) {
      setSnap(fling.card);
      setFling(null);
    }
    setIndex((prev) => (((prev + step) % count) + count) % count);
  };

  // Release the one-frame transition suppression once the snapped card has
  // been painted in its new place.
  useEffect(() => {
    if (snap === null) return;
    const id = requestAnimationFrame(() => setSnap(null));
    return () => cancelAnimationFrame(id);
  }, [snap]);

  useEffect(() => () => window.clearTimeout(flingTimer.current), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        advance(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        advance(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, fling, count]);

  const endGesture = () => {
    const g = gesture.current;
    if (g.pointerId === null) return;
    const { dx, moved } = g;
    g.pointerId = null;
    g.axis = null;
    setDragX(null);

    if (Math.abs(dx) > FLING_THRESHOLD) {
      const dir: 1 | -1 = dx > 0 ? 1 : -1;
      setFling({ card: index, dir });
      window.clearTimeout(flingTimer.current);
      flingTimer.current = window.setTimeout(() => {
        setSnap(index);
        setFling(null);
        setIndex((prev) => (prev + 1) % count);
      }, FLING_MS);
    } else if (!moved) {
      advance(1);
    }
    // moved but under the threshold: the card springs back on its own, because
    // clearing dragX restores the resting transform with the deck's easing.

    g.moved = false;
    g.dx = 0;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (g.pointerId !== null || fling) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // a link inside the card is a link, not a handle
    if ((e.target as Element).closest("a")) return;
    /*
      Only the card is the handle. The stage stretches the full height of the
      panel so that the deck can be centred in it, which left a tall band of
      empty space above and below the card — and a tap anywhere in that band
      came through here, ended as a no-movement gesture, and advanced the
      deck. The cards behind the front one carry pointer-events: none, so
      this can only ever match the one on top.
    */
    if (!(e.target as Element).closest(".deck-card")) return;

    g.pointerId = e.pointerId;
    g.startX = e.clientX;
    g.startY = e.clientY;
    g.dx = 0;
    g.axis = null;
    g.moved = false;
    stageRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (g.pointerId === null || e.pointerId !== g.pointerId) return;

    const mx = e.clientX - g.startX;
    const my = e.clientY - g.startY;

    if (!g.axis) {
      if (Math.abs(mx) < AXIS_SLOP && Math.abs(my) < AXIS_SLOP) return;
      g.axis = Math.abs(mx) > Math.abs(my) ? "x" : "y";
      // a vertical drag is the page scrolling — hand it back immediately
      if (g.axis === "y") {
        endGesture();
        return;
      }
    }

    e.preventDefault();
    g.dx = mx;
    g.moved = true;
    setDragX(mx);
  };

  return (
    <section className="panel panel--flush" id="work" aria-label="Selected work">
      <SectionEyebrow id="work" />

      <div
        className="deck-stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onLostPointerCapture={endGesture}
      >
        {projects.map((project, i) => {
          const depth = depthOf(i, index, count);
          const front = depth === 0;
          const isDragging = dragX !== null && front;
          const isFlying = fling?.card === i;

          let transform = deckTransform(depth, i);
          let opacity = depth > 2 ? 0 : 1;

          if (isDragging) {
            transform = `translate(-50%,-50%) translateX(${dragX}px) rotate(${dragX / 30}deg)`;
            opacity = Math.max(0.25, 1 - Math.abs(dragX) / FADE_TRAVEL);
          } else if (isFlying) {
            const throwX = fling.dir * window.innerWidth * 0.9;
            transform = `translate(-50%,-50%) translateX(${throwX}px) rotate(${fling.dir * 24}deg)`;
            opacity = 0;
          }

          return (
            <article
              className={`deck-card${isDragging ? " is-dragging" : ""}${isFlying ? " is-flying" : ""}`}
              key={project.slug}
              style={{
                transform,
                opacity,
                zIndex: isFlying ? 60 : 50 - depth,
                filter: front ? "none" : `brightness(${1 - depth * 0.3})`,
                pointerEvents: front ? "auto" : "none",
                transition: snap === i ? "none" : undefined,
              }}
              aria-hidden={!front}
            >
              <div className="deck-card-body" style={{ opacity: front ? 1 : 0 }}>
                <div className="deck-head">
                  <span className="deck-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="deck-rule" />
                </div>
                <img
                  className="deck-img"
                  src={project.image}
                  alt={project.imageAlt}
                  width={1672}
                  height={941}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <div className="deck-foot">
                  <div className="deck-titles">
                    <h3 className="deck-title">{project.name}</h3>
                    <p className="deck-desc">{project.subtitle}</p>
                  </div>
                  <Link className="deck-link" to={`/work/${project.slug}`} tabIndex={front ? 0 : -1}>
                    Case study
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="deck-nav">
        <button
          type="button"
          className="deck-step"
          aria-label="Previous project"
          onClick={() => advance(-1)}
        >
          &#8592;
        </button>
        <span className="deck-counter">
          <span className="deck-counter-window">
            <span className="deck-counter-tape" style={{ transform: `translateY(${-index * 16}px)` }}>
              {projects.map((project, i) => (
                <span className="deck-counter-digit" key={project.slug}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              ))}
            </span>
          </span>
          <span>/ {String(count).padStart(2, "0")}</span>
        </span>
        <button
          type="button"
          className="deck-step"
          aria-label="Next project"
          onClick={() => advance(1)}
        >
          &#8594;
        </button>
      </div>
    </section>
  );
}
