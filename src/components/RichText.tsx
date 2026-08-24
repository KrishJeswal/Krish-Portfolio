import { Fragment, type ReactElement } from "react";

/**
 * Renders the two inline markers used by the case-study copy:
 *   `code` → <code>   *em* → <em>
 *
 * Case-study prose is stored as data, so it can't carry JSX. Both markers are
 * non-nesting and never span a paragraph, which is why a split is enough and a
 * parser isn't.
 */

const TOKEN = /(`[^`]+`|\*[^*]+\*)/g;

export function RichText({ text }: { text: string }): ReactElement {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
