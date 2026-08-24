import type { Block, WrittenSectionId } from "../../data/projects";
import Blocks from "./Blocks";

export default function CaseSectionView({
  id,
  number,
  title,
  blocks,
  shown,
}: {
  id: WrittenSectionId;
  number: string;
  title: string;
  blocks: readonly Block[];
  shown: boolean;
}) {
  return (
    <section
      className={`case-section case-enter${shown ? " is-shown" : ""}`}
      id={id}
      data-sec={id}
      data-enter={id}
    >
      <div className="case-section-inner">
        <div className="case-heading">
          <span className="case-heading-num">{number}</span>
          <h2>{title}</h2>
        </div>
        <Blocks blocks={blocks} />
      </div>
    </section>
  );
}
