import type { Block } from "../../data/projects";
import { RichText } from "../RichText";
import Diagram from "./Diagram";

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "lead":
      return (
        <p className="lead">
          <RichText text={block.text} />
        </p>
      );

    case "body":
      return (
        <p className="body">
          <RichText text={block.text} />
        </p>
      );

    case "meta":
      return (
        <div className="block-meta">
          {block.items.map((item) => (
            <div className="meta-cell" key={item.label}>
              <span className="meta-label">{item.label}</span>
              <span className="meta-value">{item.value}</span>
            </div>
          ))}
        </div>
      );

    case "metric":
      return (
        <div className="block-metric">
          <span className="metric-value">{block.value}</span>
          <span className="metric-caption">{block.caption}</span>
        </div>
      );

    case "formula":
      return (
        <div className="block-formula">
          <span>{block.text}</span>
        </div>
      );

    case "note":
      return (
        <div className="block-note">
          <span className="note-label">{block.label}</span>
          <p className="note-body">
            <RichText text={block.text} />
          </p>
        </div>
      );

    case "table":
      return (
        <div className="block-table">
          <div className="table-head">
            {block.head.map((cell) => (
              <span key={cell}>{cell}</span>
            ))}
          </div>
          {block.rows.map((row) => (
            <div className="table-row" key={row[0]}>
              {row.map((cell, i) => (
                <span key={i}>{cell}</span>
              ))}
            </div>
          ))}
        </div>
      );

    case "diagram":
      return <Diagram items={block.items} />;
  }
}

/**
 * `meta` and `diagram` break out of the 66ch reading measure; everything
 * narrative stays inside it.
 */
export default function Blocks({ blocks }: { blocks: readonly Block[] }) {
  const groups: Block[][] = [];
  for (const block of blocks) {
    const wide = block.kind === "meta";
    const last = groups[groups.length - 1];
    const lastWide = last !== undefined && last[0].kind === "meta";
    if (last === undefined || wide !== lastWide) groups.push([block]);
    else last.push(block);
  }

  return (
    <>
      {groups.map((group, i) =>
        group[0].kind === "meta" ? (
          group.map((block, j) => <BlockView block={block} key={`${i}-${j}`} />)
        ) : (
          <div className="case-prose" key={i}>
            {group.map((block, j) => (
              <BlockView block={block} key={`${i}-${j}`} />
            ))}
          </div>
        )
      )}
    </>
  );
}
