import type { ReactElement } from "react";
import { shelf } from "../../data/home";

export default function Shelf(): ReactElement {
  return (
    <section id="experience" className="exp sheet dark">
      <div className="wrap">
        <div className="exp-head">
          <h2>So far.</h2>
        </div>
        <div className="shelf">
          {shelf.map((v) => (
            <div className="book-row" key={v.volume}>
              <div className={`book ${v.tone}`} style={{ width: `${v.width}%` }}>
                <span className="cap">VOL. {v.volume}</span>
                <span className="t">{v.title}</span>
                <span className="y">{v.years}</span>
              </div>
              <div className="detail">
                <span className="mono">{v.role}</span>
                <p>{v.detail}</p>
              </div>
            </div>
          ))}
          <div className="shelf-base" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
