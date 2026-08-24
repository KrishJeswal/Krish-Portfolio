import { CASE_SECTIONS, type CaseSectionId } from "../../data/projects";

export default function CaseRail({
  active,
  open,
  onNavigate,
}: {
  active: CaseSectionId;
  open: boolean;
  onNavigate: (id: CaseSectionId) => void;
}) {
  return (
    <nav className={`rail${open ? " is-open" : ""}`} aria-label="Sections">
      {CASE_SECTIONS.map((section) => (
        <a
          className={`rail-link${section.id === active ? " is-active" : ""}`}
          key={section.id}
          href={`#${section.id}`}
          aria-current={section.id === active ? "true" : undefined}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(section.id);
          }}
        >
          <span className="rail-tick" aria-hidden="true" />
          {section.label}
        </a>
      ))}
    </nav>
  );
}
