import type { Project } from "../../data/projects";

export default function CaseTop({ project }: { project: Project }) {
  return (
    <section className="case-top" id="top" data-sec="top">
      <div className="case-top-head">
        <span className="case-eyebrow">
          {project.domain}&nbsp;&middot;&nbsp;{project.year}
        </span>
        {}
        <h1 className="case-title" aria-label={project.name}>
          {[...project.name].map((letter, i) => (
            <span key={i} aria-hidden="true" style={{ animationDelay: `${i * 42}ms` }}>
              {letter}
            </span>
          ))}
        </h1>
        <p className="case-subtitle">{project.subtitle}</p>
      </div>
      <img
        className="case-hero-img"
        src={project.image}
        alt={project.imageAlt}
        width={1672}
        height={941}
        decoding="async"
      />
    </section>
  );
}
