import { useState } from "react";
import { reelPanels, roles } from "../../data/home";
import SectionEyebrow from "./SectionEyebrow";

export default function About() {
  const [index, setIndex] = useState(0);

  return (
    <section className="panel panel--centred" id="about" aria-label="About">
      <SectionEyebrow id="about" />
      <div className="reel">
        <div className="reel-panel">
          <div className="reel-tape" style={{ transform: `translateX(${-index * 100}%)` }}>
            {reelPanels.map((panel, i) => (
              <div className="reel-slide" key={panel.number} aria-hidden={i !== index}>
                <span className="reel-eyebrow">
                  {panel.number} &nbsp;{panel.channel}
                </span>
                <h3 className="reel-title">{panel.title}</h3>
                <p className="reel-lead">{panel.lead}</p>
                <p className="reel-body">{panel.body}</p>
                <div className="reel-facts">
                  {panel.facts.map((fact) => (
                    <div className="fact" key={fact.label}>
                      <span className="fact-label">{fact.label}</span>
                      <span className="fact-value">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="reel-buttons" role="tablist" aria-label="Discipline">
          {roles.map((role, i) => (
            <button
              type="button"
              role="tab"
              className="reel-btn"
              key={role}
              aria-selected={i === index}
              onClick={() => setIndex(i)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
