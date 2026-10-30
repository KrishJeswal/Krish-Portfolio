import { useState, type ReactElement } from "react";
import { skillIndex } from "../../data/home";
import { projects, type ProjectSlug } from "../../data/projects";

export default function SkillIndex(): ReactElement {
  const [pinned, setPinned] = useState<ProjectSlug | null>(null);
  const [hovered, setHovered] = useState<ProjectSlug | null>(null);
  const active = hovered ?? pinned;

  return (
    <section id="index" className="index sheet light">
      <div className="wrap">
        <div className="index-head">
          <h2>Index.</h2>
        </div>
        <div className="keys" role="group" aria-label="Filter by project">
          <span className="mono">Used in</span>
          {projects.map((p) => (
            <button
              className="key"
              type="button"
              key={p.slug}
              aria-pressed={pinned === p.slug}
              onClick={() => setPinned((cur) => (cur === p.slug ? null : p.slug))}
              onMouseEnter={() => setHovered(p.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className={`idx${active ? " filtering" : ""}`}>
          {skillIndex.map((group) => (
            <div className="idx-group" key={group.name}>
              <div className="idx-cat">
                <h3>{group.name}</h3>
                <span className="mono">{group.skills.length} entries</span>
              </div>
              {group.skills.map((skill) => (
                <div
                  className={`idx-e${active && skill.usedIn.includes(active) ? " hit" : ""}`}
                  key={skill.name}
                >
                  <span className="n">{skill.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
