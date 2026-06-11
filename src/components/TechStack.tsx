import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { stack } from "../data/content";

const PILL_CHARS = "<>{}#$%&01";

export default function TechStack() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".stack__card",
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".stack__grid", start: "top 82%" },
        }
      );
    },
    { scope: rootRef }
  );

  const scramble = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget;
    el.style.minWidth = `${el.offsetWidth}px`;
    gsap.to(el, {
      duration: 0.6,
      scrambleText: { text: el.dataset.text!, chars: PILL_CHARS, speed: 0.8 },
      overwrite: true,
    });
  };

  const spotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section className="section" id="stack" ref={rootRef}>
      <div className="section-head">
        <h2>Tech Stack</h2>
        <span className="index">003 / TOOLKIT</span>
      </div>
      <div className="stack__grid">
        {stack.map((row, i) => (
          <div className="stack__card" key={row.category} onMouseMove={spotlight} data-cursor>
            <div className="stack__card-head">
              <h3>{row.category}</h3>
              <span>/0{i + 1}</span>
            </div>
            <ul className="stack__items">
              {row.items.map((item) => (
                <li key={item}>
                  <span
                    className="stack__pill"
                    data-text={item}
                    onMouseEnter={scramble}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <span className="stack__num" aria-hidden="true">
              0{i + 1}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
