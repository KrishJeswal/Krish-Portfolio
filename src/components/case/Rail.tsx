import type { ReactElement } from "react";
import { CASE_SECTIONS } from "../../data/projects";
import { scrollToId, scrollToTop } from "../../lib/motion";

export default function Rail({ current }: { current: string }): ReactElement {
  return (
    <nav className="rail" aria-label="Sections">
      {CASE_SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={s.id === current ? "true" : undefined}
          onClick={(e) => {
            e.preventDefault();
            if (s.id === "top") scrollToTop();
            else scrollToId(s.id, 70);
          }}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
