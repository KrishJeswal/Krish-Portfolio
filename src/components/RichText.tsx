import { Fragment, type ReactElement, type ReactNode } from "react";

const TOKEN = /(`[^`]+`|\*[^*]+\*)/g;

// Courier Prime has no ⊕, so it gets a font that does.
export function withXor(text: string): ReactNode {
  if (!text.includes("⊕")) return text;
  return text.split("⊕").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <span className="xor">⊕</span>}
      {part}
    </Fragment>
  ));
}

export function RichText({ text }: { text: string }): ReactElement {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.length > 1 && part.startsWith("`") && part.endsWith("`")) {
          return <code key={i}>{withXor(part.slice(1, -1))}</code>;
        }
        if (part.length > 1 && part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={i}>{withXor(part)}</Fragment>;
      })}
    </>
  );
}
