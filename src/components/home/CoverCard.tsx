import type { ReactElement } from "react";
import { cover, disciplines, profile } from "../../data/home";

const [first, last] = profile.name.split(" ");

export default function CoverCard(): ReactElement {
  return (
    <section className="hero" id="top">
      <div className="hero-stage">
        <div className="ghost g2" aria-hidden="true" />
        <div className="ghost g1" aria-hidden="true" />
        <article className="cat paper margin-line" aria-label={`${profile.name} — ${disciplines.join(", ")}`}>
          <span className="lines ruled" aria-hidden="true" />
          <span className="redline" aria-hidden="true" />
          <div className="head-row">
            <div className="cat-call">KJ</div>
            <div className="cat-head">
              <span className="mono">Author card</span>
              <span className="mono">{profile.location}</span>
            </div>
          </div>
          <div className="cat-main">
            <h1 className="cat-name">
              {[first, last].map((word) => (
                <span className="clip" key={word}>
                  {[...word].map((ch, i) => (
                    <span className="ch" key={i}>
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <div className="cat-body">
              {cover.lines.map((line) => (
                <p className="line" key={line}>
                  {line}
                </p>
              ))}
            </div>
            <p className="cat-foot mono">
              {disciplines.map((d, i) => (
                <span key={d}>
                  {i > 0 && <i aria-hidden="true">·</i>}
                  {d}
                </span>
              ))}
            </p>
          </div>
          <span className="punch" aria-hidden="true" />
        </article>
        <div className="hero-shade" aria-hidden="true" />
      </div>
      <div className="hero-foot mono" aria-hidden="true">
        <span>{cover.footLeft}</span>
        <span>{cover.footRight}</span>
      </div>
    </section>
  );
}
