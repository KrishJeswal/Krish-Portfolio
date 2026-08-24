import { sections } from "../../data/home";
import { useRollTape } from "../../lib/useHomeScroll";
import { useReducedMotion } from "../../lib/env";

/**
 * Fixed top bar. The right side is a single roll window: a tape of all six
 * numerals behind a 44×34 aperture, with the current section's label beside it.
 */
export default function SiteHeader({
  active,
  onHome,
}: {
  active: number;
  onHome: () => void;
}) {
  const reduced = useReducedMotion();
  const tape = useRollTape(active, reduced);

  return (
    <header className="site-header">
      <a
        className="wordmark"
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          onHome();
        }}
      >
        Krish&nbsp;Jeswal
      </a>
      <nav className="roll" aria-label="Current section">
        <span className="roll-label">{sections[active].label}</span>
        <div className="roll-window">
          <div
            className="roll-tape"
            style={{
              transform: `translateY(${tape.offset}px)`,
              transitionDuration: `${tape.duration}ms`,
              transitionTimingFunction: tape.timing,
            }}
          >
            {sections.map((s) => (
              <span className="roll-digit" key={s.id}>
                {s.number}
              </span>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
