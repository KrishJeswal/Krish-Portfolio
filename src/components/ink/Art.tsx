import type { ReactElement } from "react";
import { shapesFor, VIEWBOX, type ArtKind } from "./shapes";

export default function Art({ kind }: { kind: ArtKind }): ReactElement {
  return (
    <svg className="ink" viewBox={VIEWBOX[kind]} aria-hidden="true" focusable="false">
      {shapesFor(kind).map((s, i) => {
        const common = { className: s.cls, pathLength: s.cls === "fill" ? undefined : 1 };
        switch (s.kind) {
          case "path":
            return <path key={i} {...common} d={s.d} />;
          case "circle":
            return <circle key={i} {...common} cx={s.cx} cy={s.cy} r={s.r} />;
          case "rect":
            return <rect key={i} {...common} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} />;
          case "ellipse":
            return <ellipse key={i} {...common} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} />;
        }
      })}
    </svg>
  );
}
