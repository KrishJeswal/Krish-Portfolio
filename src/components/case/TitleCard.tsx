import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { projects, type Project } from "../../data/projects";
import CatalogueCard from "./CatalogueCard";

export default function TitleCard({ project }: { project: Project }): ReactElement {
  const position = projects.findIndex((p) => p.slug === project.slug) + 1;
  const meta = project.sections.capture.find((b) => b.kind === "meta");
  return (
    <header className="head" id="top">
      <CatalogueCard
        project={project}
        label={`${project.domain} · Case study ${position} of ${projects.length}`}
      >
        <div className="tflow">
          <h1>{project.name}</h1>
          <p className="by">{project.subtitle}</p>
          {meta && (
            <dl className="meta-fields">
              {meta.items.map((m) => (
                <div className={`field${m.label === "Headline" ? " hl" : ""}`} key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="tfoot">
          <a href={project.repo} target="_blank" rel="noopener">
            Source on GitHub →
          </a>
          <Link to="/#work">Back to the drawer</Link>
        </div>
      </CatalogueCard>
    </header>
  );
}
