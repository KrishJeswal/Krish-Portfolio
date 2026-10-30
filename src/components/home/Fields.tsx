import type { ReactElement } from "react";
import { fields } from "../../data/home";
import Art from "../ink/Art";

export default function Fields(): ReactElement {
  return (
    <section id="fields" className="fields">
      <div className="wrap fields-head">
        <h2>
          Three fields,
          <br />
          one habit.
        </h2>
      </div>
      <div className="deck">
        {fields.map((f, i) => (
          <article className={`guide paper${i ? " dim" : ""}`} key={f.code}>
            <div className="tab">
              {f.code} <span>{f.name}</span>
            </div>
            <div className="guide-in">
              <div className="guide-art">
                <Art kind={f.art} />
              </div>
              <div className="guide-txt">
                <span className="mono eyebrow">{f.eyebrow}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                <ul className="chips">
                  {f.chips.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className="filed">
                  <span className="mono">Filed here</span> {f.filed}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
