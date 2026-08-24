import { Fragment } from "react";
import { roles } from "../../data/home";

const WORDS = ["KRISH", "JESWAL"] as const;

export default function Hero() {
  return (
    <section className="panel panel--centred" id="hero" aria-label="Hero">
      <div className="hero-stack" data-knock-host>
        <h1 className="hero-name">
          {WORDS.map((word) => (
            <span className="hero-word" key={word}>
              {word}
            </span>
          ))}
        </h1>
        <div className="hero-roles">
          {roles.map((role, i) => (
            <Fragment key={role}>
              {i > 0 && <span className="role-bar" aria-hidden="true" />}
              <span className="role">{role}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
