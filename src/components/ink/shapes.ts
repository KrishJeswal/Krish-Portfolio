export type Shape =
  | { readonly kind: "path"; readonly d: string; readonly cls: string }
  | { readonly kind: "circle"; readonly cx: number; readonly cy: number; readonly r: number; readonly cls: string }
  | { readonly kind: "rect"; readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly rx?: number; readonly cls: string }
  | { readonly kind: "ellipse"; readonly cx: number; readonly cy: number; readonly rx: number; readonly ry: number; readonly cls: string };

export type ArtKind = "net" | "web" | "chip" | "trace" | "rag" | "hub" | "map";

export const VIEWBOX: Record<ArtKind, string> = {
  net: "0 0 320 240",
  web: "0 0 320 240",
  chip: "0 0 320 240",
  trace: "0 0 320 200",
  rag: "0 0 320 200",
  hub: "0 0 320 200",
  map: "0 0 320 200",
};

const DRAW = "draw";
const SOFT = "draw soft";

function seeded(seed: number): (amp: number) => number {
  let s = seed;
  return (amp) => {
    s = (s * 16807) % 2147483647;
    return (s / 2147483647 - 0.5) * 2 * amp;
  };
}

function build(kind: ArtKind): Shape[] {
  const out: Shape[] = [];
  const p = (d: string, cls = DRAW) => out.push({ kind: "path", d, cls });
  const c = (cx: number, cy: number, r: number, cls = DRAW) => out.push({ kind: "circle", cx, cy, r, cls });
  const rect = (x: number, y: number, w: number, h: number, rx?: number, cls = DRAW) =>
    out.push({ kind: "rect", x, y, w, h, rx, cls });

  switch (kind) {
    case "net": {
      const layers: [number, number[]][] = [[40, [70, 120, 170]], [120, [50, 95, 145, 190]], [200, [70, 120, 170]], [270, [120]]];
      for (let i = 0; i < layers.length - 1; i++)
        for (const a of layers[i][1]) for (const b of layers[i + 1][1]) p(`M${layers[i][0]} ${a} L${layers[i + 1][0]} ${b}`, SOFT);
      for (const [x, ys] of layers) for (const y of ys) c(x, y, 8);
      break;
    }
    case "web": {
      rect(20, 46, 190, 140, 10);
      p("M20 72 H210");
      for (const x of [36, 50, 64]) c(x, 59, 4);
      p("M86 98 C72 98 78 116 68 120 C78 124 72 142 86 142");
      p("M144 98 C158 98 152 116 162 120 C152 124 158 142 144 142");
      p("M124 94 L106 146");
      p("M214 120 H252");
      p("M244 113 L253 120 L244 127");
      out.push({ kind: "ellipse", cx: 282, cy: 92, rx: 24, ry: 8, cls: DRAW });
      p("M258 92 V150 C258 161 306 161 306 150 V92");
      p("M258 121 C258 132 306 132 306 121", SOFT);
      break;
    }
    case "chip": {
      rect(140, 80, 100, 100, 8);
      c(160, 100, 5);
      for (let i = 0; i < 4; i++) {
        const o = 96 + i * 22;
        p(`M${o + 60} 80 V64`);
        p(`M${o + 60} 180 V196`);
        p(`M140 ${o} H124`);
        p(`M240 ${o} H256`);
      }
      p("M60 162 V78");
      p("M46 104 L60 78 L74 104");
      p("M44 62 Q60 48 76 62");
      p("M34 50 Q60 28 86 50", SOFT);
      p("M24 38 Q60 8 96 38", SOFT);
      p("M60 162 H124");
      let d = "M40 222";
      for (let x = 42; x <= 280; x += 2) d += ` L${x} ${(222 - Math.sin(((x - 40) / 80) * Math.PI * 2) * 8).toFixed(1)}`;
      p(d, SOFT);
      break;
    }
    case "trace": {
      const jit = seeded(29);
      let d = "M14 120";
      for (let x = 14; x <= 306; x += 3) {
        const spike = Math.exp(-((x - 196) ** 2) / 30) * 70;
        d += ` L${x} ${(120 + jit(10) - spike).toFixed(1)}`;
      }
      p(d);
      out.push({ kind: "ellipse", cx: 196, cy: 72, rx: 22, ry: 34, cls: DRAW });
      p("M14 170 H306", SOFT);
      for (let x = 14; x <= 306; x += 36) p(`M${x} 166 V174`, SOFT);
      break;
    }
    case "rag": {
      for (const [x, y] of [[24, 40], [40, 56], [56, 72]]) rect(x, y, 74, 92, 4);
      for (let i = 0; i < 4; i++) p(`M66 ${92 + i * 14} H${116 - (i % 2) * 14}`, SOFT);
      p("M142 118 H182");
      p("M174 111 L183 118 L174 125");
      const ns = [[220, 80], [262, 64], [290, 106], [250, 120], [226, 156], [276, 158]];
      for (const [a, b] of [[0, 1], [1, 2], [0, 3], [2, 3], [3, 4], [3, 5], [4, 5]])
        p(`M${ns[a][0]} ${ns[a][1]} L${ns[b][0]} ${ns[b][1]}`, SOFT);
      ns.forEach(([x, y], i) => c(x, y, i === 3 ? 9 : 5));
      break;
    }
    case "hub": {
      c(160, 100, 24);
      p("M150 100 H170 M160 90 V110", SOFT);
      for (const [x, y] of [[40, 26], [236, 26], [40, 146], [236, 146]]) {
        rect(x, y, 46, 30, 5);
        const ex = x < 160 ? x + 46 : x;
        const ey = y + 15;
        p(`M${ex} ${ey} C${(ex + 160) / 2} ${ey} ${(ex + 160) / 2} 100 ${x < 160 ? 136 : 184} 100`, SOFT);
      }
      p("M52 41 H74", SOFT);
      p("M248 41 H270", SOFT);
      p("M52 161 L60 156 L52 151", SOFT);
      c(259, 161, 5, SOFT);
      break;
    }
    case "map": {
      for (const [x, y, w, h] of [[20, 20, 80, 60], [100, 20, 70, 60], [170, 20, 130, 60], [20, 120, 110, 60], [130, 120, 60, 60], [190, 120, 110, 60]])
        rect(x, y, w, h, undefined, SOFT);
      p("M20 100 H300", SOFT);
      p("M60 52 V100 H240 V150");
      c(60, 52, 6);
      c(240, 150, 6);
      c(240, 150, 2.5, "fill");
      rect(272, 132, 18, 34);
      p("M276 145 L281 139 L286 145 M276 153 L281 159 L286 153", SOFT);
      break;
    }
  }
  return out;
}

const cache = new Map<ArtKind, Shape[]>();

export function shapesFor(kind: ArtKind): readonly Shape[] {
  let shapes = cache.get(kind);
  if (!shapes) {
    shapes = build(kind);
    cache.set(kind, shapes);
  }
  return shapes;
}
