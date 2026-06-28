import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { projects, profile, type Project } from "../data/content";

/* Hover animations are CSS-driven off `.capture:hover` (lines draw, accents pulse). */

function LeakFigure() {
  // Oscilloscope trace — a faint waveform at rest that re-acquires (a bright
  // trace draws across it) on hover, with the peak sample lighting up.
  const d =
    "M8 40 L26 40 L30 32 L34 40 L52 40 L56 31 L60 40 L86 40 L92 12 L98 40 L120 40 L124 33 L128 40 L150 40 L154 35 L158 40 L172 40";
  return (
    <svg className="fig" viewBox="0 0 180 56" role="img" aria-label="Signal trace re-acquired on hover">
      <line className="fig-rail" x1={8} y1={40} x2={172} y2={40} />
      <path className="fig-rail" d={d} />
      <path className="fig-link" d={d} pathLength={1} />
      <circle className="fig-stage" cx={92} cy={12} r={3} />
    </svg>
  );
}

function RetrieveFigure() {
  // vector k-NN — a query point retrieving its nearest neighbours
  const dots: [number, number][] = [
    [26, 14], [52, 40], [70, 18], [120, 12], [150, 36],
    [40, 30], [164, 18], [104, 44], [134, 28], [88, 8], [60, 52],
  ];
  const query: [number, number] = [96, 28];
  const near = [[70, 18], [120, 12], [104, 44], [134, 28]] as [number, number][];
  return (
    <svg className="fig" viewBox="0 0 180 56" role="img" aria-label="Nearest-neighbour retrieval">
      {near.map(([x, y], i) => (
        <line key={i} className="fig-link" x1={query[0]} y1={query[1]} x2={x} y2={y} pathLength={1} style={{ transitionDelay: `${i * 0.06}s` }} />
      ))}
      {dots.map(([x, y], i) => (
        <circle key={i} className="fig-dot" cx={x} cy={y} r={1.8} />
      ))}
      <circle className="fig-query" cx={query[0]} cy={query[1]} r={3.2} />
    </svg>
  );
}

function MapFigure() {
  // column → schema mapping — each row connects to its matched schema field
  const ys = [8, 20, 32, 44];
  const links = [
    [0, 0], [1, 2], [2, 1], [3, 3],
  ];
  return (
    <svg className="fig" viewBox="0 0 180 56" role="img" aria-label="Column to schema mapping">
      {links.map(([l, r], i) => (
        <line key={i} className="fig-link" x1={42} y1={ys[l] + 4} x2={138} y2={ys[r] + 4} pathLength={1} style={{ transitionDelay: `${i * 0.06}s` }} />
      ))}
      {ys.map((y, i) => (
        <rect key={`l${i}`} className="fig-node" x={30} y={y} width={12} height={8} />
      ))}
      {ys.map((y, i) => (
        <rect key={`r${i}`} className="fig-node" x={138} y={y} width={12} height={8} />
      ))}
    </svg>
  );
}

function PipelineFigure() {
  // Scope acquire — a static crosshair and outer range ring at rest; on hover
  // the inner rings and a sweep draw in and lock onto a target blip. Radial
  // read, distinct from the other figures; not literal.
  return (
    <svg className="fig" viewBox="0 0 180 56" role="img" aria-label="Scope rings and sweep locking onto a target">
      {/* static crosshair + outer ring */}
      <line className="fig-rail" x1={10} y1={28} x2={170} y2={28} />
      <line className="fig-rail" x1={90} y1={4} x2={90} y2={52} />
      <circle className="fig-rail" cx={90} cy={28} r={24} />
      {/* inner range rings draw in on hover */}
      <circle className="fig-link" cx={90} cy={28} r={9} pathLength={1} />
      <circle className="fig-link" cx={90} cy={28} r={17} pathLength={1} style={{ transitionDelay: "0.1s" }} />
      {/* sweep to the locked target */}
      <line className="fig-link" x1={90} y1={28} x2={105} y2={19} pathLength={1} style={{ transitionDelay: "0.22s" }} />
      <circle className="fig-stage" cx={105} cy={19} r={3} style={{ transitionDelay: "0.32s" }} />
    </svg>
  );
}

function Figure({ kind }: { kind: Project["figure"] }) {
  switch (kind) {
    case "leak":
      return <LeakFigure />;
    case "retrieve":
      return <RetrieveFigure />;
    case "map":
      return <MapFigure />;
    case "pipeline":
      return <PipelineFigure />;
  }
}

function Capture({ p }: { p: Project }) {
  return (
    <article className={`capture ${p.featured ? "capture--featured" : ""}`} data-cursor>
      <div className="capture__head">
        <span className="capture__cap">{p.capture}</span>
        <span className="capture__domain">{p.domain}</span>
      </div>
      <h3 className="capture__title">{p.title}</h3>
      <p className="capture__sub">{p.subtitle}</p>
      <p className="capture__desc">{p.description}</p>

      <div className="capture__fig">
        <Figure kind={p.figure} />
      </div>

      <div className="capture__foot">
        <div className="capture__metric">
          <b>{p.metric}</b>
          <span>{p.metricLabel}</span>
        </div>
        <ul className="capture__tags">
          {p.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Projects() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".capture", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".work", start: "top 85%", once: true },
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="sec" id="captures" ref={rootRef}>
      <div className="sec__head">
        <span className="sec__chan">Captures</span>
        <h2 className="sec__title">Recovered work</h2>
        <span className="sec__meta">002</span>
      </div>

      <div className="work">
        {projects.map((p) => (
          <Capture key={p.title} p={p} />
        ))}
      </div>

      <a className="work__more" href={profile.github} target="_blank" rel="noreferrer" data-cursor>
        <span>Full archive — github.com/KrishJeswal</span>
        <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
