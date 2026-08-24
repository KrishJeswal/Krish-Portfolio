import { useEffect, useRef, useState } from "react";
import { drawers } from "../../data/home";
import SectionEyebrow from "./SectionEyebrow";

export default function Skills() {
  const [open, setOpen] = useState(0);

  return (
    <section className="panel" id="skills" aria-label="Skills">
      <SectionEyebrow id="skills" />
      <div className="drawers">
        {drawers.map((drawer, i) => (
          <DrawerView
            key={drawer.number}
            drawer={drawer}
            isOpen={i === open}
            onToggle={() => setOpen((prev) => (prev === i ? -1 : i))}
          />
        ))}
      </div>
    </section>
  );
}

function DrawerView({
  drawer,
  isOpen,
  onToggle,
}: {
  drawer: (typeof drawers)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  // max-height has to be a real number to animate, but a fixed one would clip
  // the grid if it reflows, so it is released to `none` once the slide is over.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    if (!isOpen) {
      setMaxHeight("0px");
      return;
    }

    setMaxHeight(`${body.scrollHeight}px`);
    const id = window.setTimeout(() => setMaxHeight("none"), 620);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  return (
    <div className={`drawer${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        className="drawer-head"
        aria-expanded={isOpen}
        aria-controls={`drawer-${drawer.number}`}
        onClick={onToggle}
      >
        <span className="drawer-label">
          <span className="drawer-num">{drawer.number}</span>
          <span className="drawer-title">{drawer.title}</span>
        </span>
        <span className="drawer-pull" aria-hidden="true" />
      </button>
      <div className="drawer-body" id={`drawer-${drawer.number}`} ref={bodyRef} style={{ maxHeight }}>
        <div className="drawer-grid">
          {drawer.tiles.map((tile) => (
            <span className="tile" key={tile}>
              {tile}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
