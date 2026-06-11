import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { projects, profile, type Project } from "../data/content";

function Motif({ kind }: { kind: Project["motif"] }) {
  switch (kind) {
    case "trace":
      return (
        <svg className="bento__motif" viewBox="0 0 300 160" fill="none">
          <path
            d="M0 80 L30 80 L38 30 L46 130 L54 50 L62 110 L70 80 L110 80 L118 20 L126 140 L134 40 L142 100 L150 80 L200 80 L208 60 L216 95 L224 80 L300 80"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M0 120 L300 120 M0 40 L300 40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 6" />
        </svg>
      );
    case "noir":
      return (
        <svg className="bento__motif" viewBox="0 0 300 160" fill="none">
          {[260, 220, 180, 140, 100, 60].map((w, i) => (
            <rect key={w} x={(300 - w) / 2} y={i * 26} width={w} height="10" fill="currentColor" opacity={0.5 + i * 0.08} rx="2" />
          ))}
        </svg>
      );
    case "grid":
      return (
        <svg className="bento__motif" viewBox="0 0 300 160" fill="none">
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 7 }).map((_, c) => (
              <rect key={`${r}-${c}`} x={c * 42} y={r * 32} width="38" height="28" stroke="currentColor" strokeWidth="1" fill={(r + c) % 3 === 0 ? "currentColor" : "none"} fillOpacity="0.25" />
            ))
          )}
        </svg>
      );
    case "net":
      return (
        <svg className="bento__motif" viewBox="0 0 300 160" fill="none">
          <path
            d="M150 22 L42 80 L150 138 L258 80 Z M150 22 L150 138 M42 80 L258 80"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {[[150, 22], [42, 80], [258, 80], [150, 138], [150, 80]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="7" fill="currentColor" />
          ))}
        </svg>
      );
  }
}

function Card({ p }: { p: Project }) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (!prefersReducedMotion()) {
      const rx = ((y / r.height) - 0.5) * -4;
      const ry = ((x / r.width) - 0.5) * 4;
      gsap.to(el, { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
    }
  };

  const onLeave = () => {
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1, 0.6)" });
  };

  return (
    <article
      className={`bento__card bento__card--${p.size}`}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor
    >
      <div className="bento__top">
        <span className="bento__index">/{p.index}</span>
        <span className="bento__arrow" aria-hidden="true">↗</span>
      </div>
      <div>
        <h3 className="bento__title">{p.title}</h3>
        <p className="bento__subtitle">{p.subtitle}</p>
      </div>
      <p className="bento__desc">{p.description}</p>
      <div className="bento__metric">
        <strong>{p.metric}</strong>
        <span>{p.metricLabel}</span>
      </div>
      <ul className="bento__tags">
        {p.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <Motif kind={p.motif} />
    </article>
  );
}

export default function Projects() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".bento__card", {
        y: 90,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".bento", start: "top 82%" },
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="section" id="projects" ref={rootRef}>
      <div className="section-head">
        <h2>Selected Work</h2>
        <span className="index">002 / TRACES</span>
      </div>
      <div className="bento">
        {projects.map((p) => (
          <Card key={p.title} p={p} />
        ))}
      </div>
      <a className="projects__github" href={profile.github} target="_blank" rel="noreferrer">
        <span>Full archive — github.com/KrishJeswal</span>
        <span>↗</span>
      </a>
    </section>
  );
}
