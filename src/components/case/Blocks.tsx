import type { ReactElement } from "react";
import type { Block } from "../../data/projects";
import { RichText, withXor } from "../RichText";
import Diagram from "./Diagram";

const NUMERIC = /^[\d.—–> -]|^middling$/;

export const isNumericTable = (rows: readonly (readonly string[])[]): boolean =>
  rows.every((row) => row.slice(1).every((cell) => NUMERIC.test(cell)));

function BlockView({ block }: { block: Block }): ReactElement | null {
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
      return null;
    case "metric":
      return (
        <div className="metric paper ruled">
          <span className="v">{block.value}</span>
          <span className="c">
            <RichText text={block.caption} />
          </span>
        </div>
      );
    case "formula":
      return (
        <div className="formula paper ruled">
          <span>{withXor(block.text)}</span>
        </div>
      );
    case "aside":
      return (
        <aside className="aside">
          <span className="mono">{block.label}</span>
          <p>
            <RichText text={block.text} />
          </p>
        </aside>
      );
    case "list":
      return (
        <div className={`list paper ${block.style}`}>
          <span className="mono">{block.label}</span>
          <ul>
            {block.items.map((item) => (
              <li key={item}>
                <RichText text={item} />
              </li>
            ))}
          </ul>
        </div>
      );
    case "code":
      return (
        <pre className="codeblock paper ruled">
          <code>{block.text}</code>
        </pre>
      );
    case "table": {
      const numeric = isNumericTable(block.rows);
      return (
        <div className={`table paper${numeric ? " num" : ""}`}>
          <table>
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell}>{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i} data-label={block.head[i]}>
                      <span>
                        <RichText text={cell} />
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "diagram":
      return <Diagram items={block.items} />;
  }
}

export default function Blocks({ blocks }: { blocks: readonly Block[] }): ReactElement {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockView block={block} key={i} />
      ))}
    </>
  );
}
