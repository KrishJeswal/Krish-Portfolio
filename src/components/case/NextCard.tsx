import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { nextProject, projects, type Project } from "../../data/projects";
import CatalogueCard from "./CatalogueCard";

export default function NextCard({ project }: { project: Project }): ReactElement {
  const next = nextProject(project.slug);
  const position = projects.findIndex((p) => p.slug === next.slug) + 1;
  return (
    <section className="next" aria-label="Next case study">
      <div className="next-top">
        <span className="mono">Next card in the drawer</span>
        <Link to="/#work">← Back to the drawer</Link>
      </div>
      <Link className="next-card" to={`/work/${next.slug}`}>
        <CatalogueCard project={next} label={`Case study ${position} of ${projects.length}`}>
          <div className="tflow">
            <h2>{next.name}</h2>
            <p className="by">{next.subtitle}</p>
          </div>
        </CatalogueCard>
      </Link>
    </section>
  );
}
