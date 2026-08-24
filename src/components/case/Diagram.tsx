import type { DiagramItem, DiagramNode } from "../../data/projects";

function Node({ node }: { node: DiagramNode }) {
  return (
    <div className={`dg-node${node.accent ? " is-key" : ""}${node.store ? " is-store" : ""}`}>
      {node.lines.map((line, i) => (
        <span key={i}>{line}</span>
      ))}
    </div>
  );
}

function Item({ item }: { item: DiagramItem }) {
  switch (item.kind) {
    case "node":
      return <Node node={item} />;

    case "link":
      return (
        <div className="dg-link" aria-hidden="true">
          <span className={`dg-line${item.dashed ? " is-dashed" : ""}${item.accent ? " is-key" : ""}`} />
          {item.label !== undefined && (
            <>
              <span className="dg-link-label">{item.label}</span>
              <span className={`dg-line${item.dashed ? " is-dashed" : ""}${item.accent ? " is-key" : ""}`} />
            </>
          )}
        </div>
      );

    case "row":
      return (
        <div className="dg-row" data-columns={item.columns}>
          {item.nodes.map((node, i) => (
            <Node node={node} key={i} />
          ))}
        </div>
      );

    case "group":
      return (
        <div className="dg-group">
          <span className="dg-group-label">{item.label}</span>
          {item.items.map((child, i) => (
            <Item item={child} key={i} />
          ))}
        </div>
      );
  }
}

/**
 * Architecture flowcharts are native markup, not images — they stay legible at
 * any width, reflow on phones, and are readable by a screen reader.
 */
export default function Diagram({ items }: { items: readonly DiagramItem[] }) {
  return (
    <div className="diagram">
      {items.map((item, i) => (
        <Item item={item} key={i} />
      ))}
    </div>
  );
}
