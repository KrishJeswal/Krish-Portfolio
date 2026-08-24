import type { RefObject } from "react";
import { sections } from "../../data/home";
import { useRollTape } from "../../lib/useHomeScroll";
import { useReducedMotion } from "../../lib/env";

/**
 * The bar's contents, separate from the fixed bar itself so the cursor blob
 * can render a second copy knocked out in the background colour.
 */
export function HeaderContent({ active, onHome }: { active: number; onHome?: () => void }) {
  const reduced = useReducedMotion();
  const tape = useRollTape(active, reduced);

  return (
    <>
      <a
        className="wordmark"
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          onHome?.();
        }}
      >
        Krish&nbsp;Jeswal
      </a>
      <nav className="roll" aria-label="Current section">
        <span className="roll-label">{sections[active].label}</span>
        <div className="roll-window">
          {}
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
    </>
  );
}

export default function SiteHeader({
  active,
  onHome,
  elRef,
}: {
  active: number;
  onHome: () => void;
  elRef: RefObject<HTMLElement | null>;
}) {
  return (
    <header className="site-header" ref={elRef}>
      <HeaderContent active={active} onHome={onHome} />
    </header>
  );
}
