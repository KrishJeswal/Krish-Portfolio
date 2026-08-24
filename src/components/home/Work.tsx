import { Link } from "react-router-dom";
import { projects } from "../../data/projects";

/** Depth 0 is the front card; 1, 2, 3 sit behind it. */
export function deckTransform(depth: number, index: number): string {
  const tilt = depth === 0 ? 0 : (index % 2 ? 1 : -1) * (2.8 + depth * 1.3);
  return `translate(-50%,-50%) translateY(${depth * -22}px) scale(${1 - depth * 0.045}) rotate(${tilt}deg)`;
}

export function deckDepth(cardIndex: number, active: number, count: number): number {
  return ((cardIndex - active) % count + count) % count;
}

export default function Work({ index }: { index: number }) {
  const count = projects.length;

  return (
    <section className="panel panel--flush" id="work" aria-label="Selected work">
      <span className="eyebrow">03 &nbsp;/&nbsp; Selected work</span>

      <div className="deck-stage">
        {projects.map((project, i) => {
          const depth = deckDepth(i, index, count);
          const front = depth === 0;
          return (
            <article
              className="deck-card"
              key={project.slug}
              style={{
                transform: deckTransform(depth, i),
                opacity: depth > 2 ? 0 : 1,
                zIndex: 50 - depth,
                filter: front ? "none" : `brightness(${1 - depth * 0.3})`,
                pointerEvents: front ? "auto" : "none",
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
                  draggable={false}
                />
                <div className="deck-foot">
                  <div className="deck-titles">
                    <h3 className="deck-title">{project.name}</h3>
                    <p className="deck-desc">{project.subtitle}</p>
                  </div>
                  <Link
                    className="deck-link"
                    to={`/work/${project.slug}`}
                    tabIndex={front ? 0 : -1}
                  >
                    Case study
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="deck-nav">
        <button type="button" className="deck-step" aria-label="Previous project">
          &#8592;
        </button>
        <span className="deck-counter">
          <span className="deck-counter-window">
            <span
              className="deck-counter-tape"
              style={{ transform: `translateY(${-index * 16}px)` }}
            >
              {projects.map((project, i) => (
                <span className="deck-counter-digit" key={project.slug}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              ))}
            </span>
          </span>
          <span>/ {String(count).padStart(2, "0")}</span>
        </span>
        <button type="button" className="deck-step" aria-label="Next project">
          &#8594;
        </button>
      </div>
    </section>
  );
}
