import type { ReactElement, ReactNode } from "react";
import type { Project } from "../../data/projects";

export default function CatalogueCard({
  project,
  label,
  className = "",
  children,
}: {
  project: Project;
  label: string;
  className?: string;
  children: ReactNode;
}): ReactElement {
  return (
    <div className={`tcard paper margin-line ${className}`}>
      <span className="lines ruled" aria-hidden="true" />
      <span className="redline" aria-hidden="true" />
      <div className="head-row">
        <div className="call">
          {project.card.shelf}
          <br />
          {project.card.number}
        </div>
        <div className="meta-row">
          <span className="mono">{label}</span>
          <span className="mono">{project.year}</span>
        </div>
      </div>
      {children}
      <span className="punch" aria-hidden="true" />
    </div>
  );
}
