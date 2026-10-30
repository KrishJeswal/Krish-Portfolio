import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { moreWork, profile } from "../../data/home";
import { projects } from "../../data/projects";
import Art from "../ink/Art";

export default function Drawer(): ReactElement {
  return (
    <section id="work" className="work sheet dark">
      <div className="wrap work-head">
        <h2>Projects.</h2>
        <div className="right">
          <span className="count">The drawer · 2025</span>
        </div>
      </div>
      <div className="stage">
        {projects.map((p) => (
          <Link className="pcard paper margin-line" to={`/work/${p.slug}`} key={p.slug}>
            <span className="lines ruled" aria-hidden="true" />
            <span className="redline" aria-hidden="true" />
            <div className="head-row">
              <div className="call">
                {p.card.shelf}
                <br />
                {p.card.number}
              </div>
              <div className="meta">
                <span className="mono">{p.card.label}</span>
                <span className="mono">{p.year}</span>
              </div>
            </div>
            <div className="flow">
              <div className="main">
                <h3>{p.name}</h3>
                <div className="rec">
                  <p className="by">{p.subtitle}</p>
                  <p>{p.card.summary}</p>
                  <p className="stack">{p.card.stack}</p>
                </div>
              </div>
              <figure className="art" aria-hidden="true">
                <Art kind={p.card.art} />
              </figure>
            </div>
            <div className="foot">
              <span className="mono">{p.card.subjects}</span>
              <span className="mono go">Read</span>
            </div>
            <span className="punch" aria-hidden="true" />
            <span className="shade" aria-hidden="true" />
          </Link>
        ))}
        <a className="pcard paper more" href={profile.github} target="_blank" rel="noopener noreferrer">
          <span className="mono">{moreWork.eyebrow}</span>
          <h3>{moreWork.title}</h3>
          <p>{moreWork.body}</p>
          <span className="go">{moreWork.link}</span>
        </a>
        <div className="drawer" aria-hidden="true">
          <span className="drawer-label">Catalogue</span>
        </div>
      </div>
    </section>
  );
}
