import { useEffect, useState } from "react";
import { ledger } from "../../data/home";
import SectionEyebrow from "./SectionEyebrow";

export default function Experience() {
  const [index, setIndex] = useState(0);
  const active = ledger[index];

  // The year drops out and rises back rather than cross-fading in place, so
  // it reads as a counter rolling over. One frame hidden, then released.
  const [swapping, setSwapping] = useState(false);
  useEffect(() => {
    setSwapping(true);
    const id = requestAnimationFrame(() => setSwapping(false));
    return () => cancelAnimationFrame(id);
  }, [index]);

  return (
    <section className="panel panel--centred" id="experience" aria-label="Experience">
      <SectionEyebrow id="experience" />
      <div className="ledger">
        <div className="ledger-head">
          <span className={`ledger-year${swapping ? " is-swapping" : ""}`}>{active.year}</span>
          <span className="ledger-range">{active.range}</span>
        </div>

        <div className="ledger-rows">
          {ledger.map((row, i) => (
            <div
              className={`ledger-row${i === index ? " is-active" : ""}`}
              key={row.org}
              tabIndex={0}
              role="button"
              aria-pressed={i === index}
              onMouseEnter={() => setIndex(i)}
              onFocus={() => setIndex(i)}
              onClick={() => setIndex(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIndex(i);
                }
              }}
            >
              <span className="ledger-org">{row.org}</span>
              <span className="ledger-role">{row.role}</span>
            </div>
          ))}
        </div>

        <div className="ledger-details">
          {ledger.map((row, i) => (
            <p className={`ledger-detail${i === index ? " is-active" : ""}`} key={row.org}>
              {row.detail}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
