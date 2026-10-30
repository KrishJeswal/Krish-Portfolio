import { useEffect } from "react";

/*
  Some phones lay text out on a slightly different line height than the CSS
  declares, so a gradient spaced by --L drifts off the text within a few
  lines. The rules are respaced from the measured line height and anchored to
  the first line of text instead.
*/
export function ruleOffset(textTop: number, linesTop: number, lineHeight: number): number {
  return (((textTop - linesTop) % lineHeight) + lineHeight) % lineHeight;
}

function sync(): void {
  document.querySelectorAll<HTMLElement>(".paper.ruled, .tcard").forEach((card) => {
    const ref = card.querySelector<HTMLElement>(".by, .c, .formula > span, code");
    const lines = card.classList.contains("ruled") ? card : card.querySelector<HTMLElement>(".lines");
    if (!ref || !lines) return;
    const declared = parseFloat(getComputedStyle(ref).lineHeight);
    if (!declared) return;
    const lh = ref.offsetHeight / Math.max(1, Math.round(ref.offsetHeight / declared));
    lines.style.setProperty("--Lr", `${lh}px`);
    const offset = ruleOffset(ref.getBoundingClientRect().top, lines.getBoundingClientRect().top, lh);
    lines.style.backgroundPosition = `0 ${offset}px`;
  });
}

export function useLineGrid(key: string): void {
  useEffect(() => {
    sync();
    document.fonts.ready.then(sync);
    const late = window.setTimeout(sync, 2200);
    // A phone's address bar resizes the viewport height mid-scroll; only width changes reflow text.
    let width = window.innerWidth;
    let frame = 0;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(late);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [key]);
}
