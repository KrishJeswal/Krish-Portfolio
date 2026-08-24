import { Link } from "react-router-dom";
import { nextProject, type Project } from "../../data/projects";

export default function CaseNext({ project, shown }: { project: Project; shown: boolean }) {
  const next = nextProject(project.slug);

  return (
    <section className={`case-next case-enter${shown ? " is-shown" : ""}`} data-sec="next">
      <a
        className="next-card next-card--source"
        href={project.repo}
        target="_blank"
        rel="noopener"
      >
        <span className="next-card-text">
          <span className="next-card-label">Source</span>
          <span className="next-card-title">{project.name} on GitHub</span>
        </span>
        <span className="next-card-arrow" aria-hidden="true">
          &#8599;
        </span>
      </a>

      <Link className="next-card" to={`/work/${next.slug}`}>
        <span className="next-card-text">
          <span className="next-card-label">Next case study</span>
          <span className="next-card-title">{next.name}</span>
        </span>
        <span className="next-card-arrow" aria-hidden="true">
          &#8594;
        </span>
      </Link>
    </section>
  );
}
