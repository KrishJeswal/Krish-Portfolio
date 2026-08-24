import { Link } from "react-router-dom";

export default function CaseHeader({
  counter,
  pillLabel,
  sheetOpen,
  onTogglePill,
}: {
  counter: string;
  pillLabel: string;
  sheetOpen: boolean;
  onTogglePill: () => void;
}) {
  return (
    <header className="case-header">
      <Link className="case-back" to="/">
        &#8592; &nbsp;Krish Jeswal
      </Link>

      <button
        type="button"
        className="case-pill"
        aria-expanded={sheetOpen}
        onClick={onTogglePill}
      >
        <span>{pillLabel}</span>
        <span className="case-pill-caret" aria-hidden="true">
          &#9662;
        </span>
      </button>

      <span className="case-counter">Case study &nbsp;{counter}</span>
    </header>
  );
}
