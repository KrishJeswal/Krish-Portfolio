import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { projects } from "../data/projects";
import { skillIndex } from "../data/home";
import { isNumericTable } from "../components/case/Blocks";
import { RichText } from "../components/RichText";
import { ruleOffset } from "../lib/useLineGrid";

describe("project cards", () => {
  it("gives every project a unique shelf code", () => {
    const codes = projects.map((p) => `${p.card.shelf} ${p.card.number}`);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("case-study blocks", () => {
  it("has no leftover prose notes", () => {
    const kinds = projects.flatMap((p) =>
      Object.values(p.sections)
        .flat()
        .map((b) => b.kind),
    );
    expect(kinds).not.toContain("note");
  });

  it("right-aligns only tables whose value columns are figures", () => {
    expect(
      isNumericTable([
        ["Decision Tree", "0.1094", "148.86"],
        ["MLP + PCA", "middling", "16.36"],
      ]),
    ).toBe(true);
    expect(isNumericTable([["Key", "1 byte, 1 key", "full AES-128"]])).toBe(false);
  });
});

describe("skill index", () => {
  it("lists each skill once per group", () => {
    for (const group of skillIndex) {
      const names = group.skills.map((s) => s.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });
});

describe("RichText", () => {
  it("renders code, emphasis and swaps ⊕ into its fallback font", () => {
    const html = renderToStaticMarkup(<RichText text="fold `v ⊕ m` into *one* component" />);
    expect(html).toBe('fold <code>v <span class="xor">⊕</span> m</code> into <em>one</em> component');
  });
});

describe("ruleOffset", () => {
  it("anchors the rule pattern to the first text line, wrapping into one line height", () => {
    expect(ruleOffset(130, 100, 22)).toBe(8);
    expect(ruleOffset(100, 100, 22)).toBe(0);
    expect(ruleOffset(90, 100, 22)).toBe(12);
  });
});
