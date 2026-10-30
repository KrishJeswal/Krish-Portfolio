import type { ReactElement } from "react";
import type { DiagramItem, DiagramNode } from "../../data/projects";

function Node({ node }: { node: DiagramNode }): ReactElement {
  const [title, ...rest] = node.lines;
  return (
    <div className={`dg-node${node.accent ? " accent" : ""}${node.store ? " store" : ""}`}>
      <b>{title}</b>
      {rest.map((line, i) => (
        <span key={i}>{line}</span>
      ))}
    </div>
  );
}

function Item({ item }: { item: DiagramItem }): ReactElement {
  switch (item.kind) {
    case "node":
      return <Node node={item} />;
    case "link":
      return (
        <div
          className={`dg-link${item.dashed ? " dashed" : ""}${item.accent ? " accent" : ""}`}
          aria-hidden="true"
        >
          {item.label !== undefined && <span>{item.label}</span>}
        </div>
      );
    case "row":
      return (
        <div className="dg-row" style={{ gridTemplateColumns: `repeat(${item.columns}, minmax(0, 1fr))` }}>
          {item.nodes.map((node, i) => (
            <Node node={node} key={i} />
          ))}
        </div>
      );
    case "group":
      return (
        <div className="dg-group">
          <span className="mono">{item.label}</span>
          {item.items.map((child, i) => (
            <Item item={child} key={i} />
          ))}
        </div>
      );
  }
}

export default function Diagram({ items }: { items: readonly DiagramItem[] }): ReactElement {
  return (
    <figure className="diagram" aria-label="Architecture diagram">
      {items.map((item, i) => (
        <Item item={item} key={i} />
      ))}
    </figure>
  );
}
