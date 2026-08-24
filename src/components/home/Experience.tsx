import { ledger } from "../../data/home";

export default function Experience({ index }: { index: number }) {
  const active = ledger[index];

  return (
    <section className="panel panel--centred" id="experience" aria-label="Experience">
      <span className="eyebrow">05 &nbsp;/&nbsp; Experience</span>
      <div className="ledger">
        <div className="ledger-head">
          <span className="ledger-year">{active.year}</span>
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
            >
              <span className="ledger-org">{row.org}</span>
              <span className="ledger-role">{row.role}</span>
            </div>
          ))}
        </div>

        {/* all four sit stacked; only the active one is on screen */}
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
