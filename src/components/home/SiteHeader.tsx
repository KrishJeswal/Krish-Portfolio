import { sections, profile, NAV_HOME_LABEL } from "../../data/home";

/**
 * Fixed top bar. The right side is a single roll window: a tape of all six
 * numerals behind a 44×34 aperture, with the current section's label beside it.
 */
export default function SiteHeader({ active }: { active: number }) {
  const label = active === 0 ? NAV_HOME_LABEL : sections[active].label;

  return (
    <header className="site-header">
      <a className="wordmark" href="#hero">
        Krish&nbsp;Jeswal
      </a>
      <nav className="roll" aria-label={`${profile.name} sections`}>
        <span className="roll-label">{label}</span>
        <div className="roll-window">
          <div className="roll-tape">
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
