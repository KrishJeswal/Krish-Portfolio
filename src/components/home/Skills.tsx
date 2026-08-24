import { drawers } from "../../data/home";

/** `open` is -1 when every drawer is pushed shut. */
export default function Skills({ open }: { open: number }) {
  return (
    <section className="panel" id="skills" aria-label="Skills">
      <span className="eyebrow">04 &nbsp;/&nbsp; Skills</span>
      <div className="drawers">
        {drawers.map((drawer, i) => {
          const isOpen = i === open;
          return (
            <div className={`drawer${isOpen ? " is-open" : ""}`} key={drawer.number}>
              <button
                type="button"
                className="drawer-head"
                aria-expanded={isOpen}
                aria-controls={`drawer-${drawer.number}`}
              >
                <span className="drawer-label">
                  <span className="drawer-num">{drawer.number}</span>
                  <span className="drawer-title">{drawer.title}</span>
                </span>
                <span className="drawer-pull" aria-hidden="true" />
              </button>
              <div className="drawer-body" id={`drawer-${drawer.number}`}>
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
        })}
      </div>
    </section>
  );
}
