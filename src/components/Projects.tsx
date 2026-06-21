import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { projects, profile, type Project } from "../data/content";

/* Each figure is a minimal diagram of the project's actual method. Hover
   animations are CSS-driven off `.capture:hover` (lines draw, accents pulse). */

function LeakFigure() {
  // SHAP leakage localization — flat importance with one sharp peak (the leak)
  const bars = Array.from({ length: 26 }, (_, i) => {
    const peak = Math.exp(-Math.pow((i - 17) / 1.5, 2));
    const base = 0.1 + 0.09 * Math.abs(Math.sin(i * 1.27));
    return Math.min(1, base + peak);
  });
  return (
    <svg className="fig" viewBox="0 0 180 56" role="img" aria-label="Leakage localized at one sample">
      {bars.map((hNorm, i) => {
        const h = hNorm * 42;
        const isPeak = i === 17;
        return (
          <rect
            key={i}
            className={isPeak ? "fig-peak" : "fig-bar"}
            x={6 + i * 6.5}
            y={52 - h}
            width={3.4}
            height={h}
          />
        );
      })}
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
  // column → schema mapping — matched rows connect, one stays unmatched
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
        <rect key={`r${i}`} className={i === 1 ? "fig-node fig-node--off" : "fig-node"} x={138} y={y} width={12} height={8} />
      ))}
    </svg>
  );
}

function PipelineFigure() {
  // CI/CD stages — design → CI → build → prod, shipped
  const nodes = [22, 68, 114, 160];
  return (
    <svg className="fig" viewBox="0 0 180 56" role="img" aria-label="CI/CD pipeline, shipped">
      <line className="fig-rail" x1={22} y1={28} x2={160} y2={28} />
      {nodes.map((x, i) => (
        <circle key={i} className="fig-stage" cx={x} cy={28} r={4} style={{ transitionDelay: `${i * 0.08}s` }} />
      ))}
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
    <section className="sec" id="work" ref={rootRef}>
      <div className="sec__head">
        <span className="sec__chan">CH·01–04 / Captures</span>
        <h2 className="sec__title">Selected work</h2>
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
