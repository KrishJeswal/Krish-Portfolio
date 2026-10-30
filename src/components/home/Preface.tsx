import { Fragment, type ReactElement } from "react";
import { preface } from "../../data/home";

export default function Preface(): ReactElement {
  return (
    <section id="preface" className="preface sheet light">
      <div className="wrap">
        <div className="preface-side">
          <span className="mono">Preface</span>
          <span className="typed">p. vii</span>
        </div>
        <div>
          <h2>
            {preface.heading.split(" ").map((w, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="w">{w}</span>
              </Fragment>
            ))}
          </h2>
          <div className="preface-cols">
            {preface.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
