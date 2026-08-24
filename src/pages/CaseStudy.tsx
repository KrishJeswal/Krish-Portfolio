import { Navigate, useParams } from "react-router-dom";
import {
  CASE_SECTIONS,
  isProjectSlug,
  projectBySlug,
  projects,
  type WrittenSectionId,
} from "../data/projects";
import CaseHeader from "../components/case/CaseHeader";
import CaseRail from "../components/case/CaseRail";
import CaseTop from "../components/case/CaseTop";
import CaseSectionView from "../components/case/CaseSectionView";
import CaseNext from "../components/case/CaseNext";

type WrittenSection = { id: WrittenSectionId; number: string; label: string };

const isWritten = (s: (typeof CASE_SECTIONS)[number]): s is (typeof CASE_SECTIONS)[number] & WrittenSection =>
  s.id !== "top";

const WRITTEN: readonly WrittenSection[] = CASE_SECTIONS.filter(isWritten);

export default function CaseStudy() {
  const { slug } = useParams();

  if (slug === undefined || !isProjectSlug(slug)) return <Navigate to="/" replace />;

  const project = projectBySlug(slug);
  const position = projects.findIndex((p) => p.slug === slug) + 1;
  const counter = `${String(position).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;

  return (
    <div className="case">
      <CaseHeader
        counter={counter}
        pillLabel={"01  Capture"}
        sheetOpen={false}
        onTogglePill={() => {}}
      />
      <CaseRail active="top" open={false} onNavigate={() => {}} />
      <div className="case-scrim" />

      <div className="case-shell">
        <article>
          <CaseTop project={project} />
          {WRITTEN.map((section) => (
            <CaseSectionView
              key={section.id}
              id={section.id}
              number={section.number}
              title={section.label}
              blocks={project.sections[section.id]}
              shown
            />
          ))}
          <CaseNext project={project} shown />
        </article>
      </div>
    </div>
  );
}
