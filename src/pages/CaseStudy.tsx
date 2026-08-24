import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  CASE_SECTIONS,
  isProjectSlug,
  projectBySlug,
  projects,
  type CaseSectionId,
  type WrittenSectionId,
} from "../data/projects";
import { useIsSheet, useReducedMotion } from "../lib/env";
import { useEntered, useScrollSpy } from "../lib/useCaseScroll";
import { scrollToId } from "../lib/scroll";
import CaseHeader from "../components/case/CaseHeader";
import CaseRail from "../components/case/CaseRail";
import CaseTop from "../components/case/CaseTop";
import CaseSectionView from "../components/case/CaseSectionView";
import CaseNext from "../components/case/CaseNext";

type WrittenSection = { id: WrittenSectionId; number: string; label: string };

const isWritten = (
  s: (typeof CASE_SECTIONS)[number]
): s is (typeof CASE_SECTIONS)[number] & WrittenSection => s.id !== "top";

const WRITTEN: readonly WrittenSection[] = CASE_SECTIONS.filter(isWritten);
const SPY_IDS: readonly CaseSectionId[] = CASE_SECTIONS.map((s) => s.id);

export default function CaseStudy() {
  const { slug } = useParams();
  const valid = slug !== undefined && isProjectSlug(slug);

  const shellRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isSheet = useIsSheet();
  const reduced = useReducedMotion();

  const active = useScrollSpy(shellRef, SPY_IDS);
  const entered = useEntered(shellRef, !reduced);

  const project = valid ? projectBySlug(slug) : null;

  useEffect(() => {
    if (!project) return;
    document.title = `${project.name} — Krish Jeswal`;
    return () => {
      document.title = "Krish Jeswal";
    };
  }, [project]);

  // A new project is a new read — start it at the top.
  useEffect(() => {
    if (project) window.scrollTo({ top: 0, behavior: "auto" });
  }, [project]);

  // The sheet only exists below 1200px; widening past it must not leave the
  // page holding an open-sheet state it can no longer show.
  useEffect(() => {
    if (!isSheet) setSheetOpen(false);
  }, [isSheet]);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  if (!valid || !project) return <Navigate to="/" replace />;

  const position = projects.findIndex((p) => p.slug === project.slug) + 1;
  const counter = `${String(position).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
  const current = CASE_SECTIONS.find((s) => s.id === active) ?? CASE_SECTIONS[0];
  const pillLabel =
    current.number === null ? current.label : `${current.number}  ${current.label}`;

  const goTo = (id: CaseSectionId) => {
    setSheetOpen(false);
    // The header is fixed and opaque at the top, so land the heading below it
    // rather than underneath it. window.scrollTo ignores scroll-margin-top,
    // which is why the offset is measured rather than declared in CSS.
    const header = document.querySelector(".case-header");
    const clearance = header ? header.getBoundingClientRect().height : 0;
    scrollToId(id, clearance);
  };

  return (
    <div className="case">
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <CaseHeader
        counter={counter}
        pillLabel={pillLabel}
        sheetOpen={sheetOpen}
        onTogglePill={() => setSheetOpen((open) => !open)}
      />

      <CaseRail active={active} open={sheetOpen} onNavigate={goTo} />

      <div
        className={`case-scrim${sheetOpen ? " is-open" : ""}`}
        onClick={() => setSheetOpen(false)}
        aria-hidden="true"
      />

      <div className="case-shell" ref={shellRef}>
        <article>
          <CaseTop project={project} key={project.slug} />
          {WRITTEN.map((section) => (
            <CaseSectionView
              key={`${project.slug}-${section.id}`}
              id={section.id}
              number={section.number}
              title={section.label}
              blocks={project.sections[section.id]}
              shown={entered.has(section.id)}
            />
          ))}
          <CaseNext project={project} shown={entered.has("next")} />
        </article>
      </div>
    </div>
  );
}
