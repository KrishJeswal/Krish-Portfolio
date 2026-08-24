import { sections, type SectionId } from "../../data/home";

/**
 * The numbered heading above each section — "03 / Selected work". Read from
 * the same section list that drives the nav roll, so the numerals cannot drift
 * out of step with it if the order changes.
 */
export default function SectionEyebrow({ id }: { id: SectionId }) {
  const section = sections.find((s) => s.id === id) ?? sections[0];
  return <span className="eyebrow">{`${section.number}  /  ${section.eyebrow}`}</span>;
}
