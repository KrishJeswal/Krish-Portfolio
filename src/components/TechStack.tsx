import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, NOISE_CHARS } from "../lib/gsap";
import { stack } from "../data/content";

export default function TechStack() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".stack__row", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".stack", start: "top 86%", once: true },
      });
    },
    { scope: rootRef }
  );

  const scramble = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget;
    el.style.minWidth = `${el.offsetWidth}px`;
    gsap.to(el, {
      duration: 0.5,
      scrambleText: { text: el.dataset.text!, chars: NOISE_CHARS, speed: 0.9 },
      overwrite: true,
    });
  };

  return (
    <section className="sec" id="stack" ref={rootRef}>
      <div className="sec__head">
        <span className="sec__chan">Toolkit</span>
        <h2 className="sec__title">The instrument</h2>
        <span className="sec__meta">003</span>
      </div>

      <div className="stack">
        {stack.map((row) => (
          <div className="stack__row" key={row.category}>
            <span className="stack__cat">{row.category}</span>
            <ul className="stack__items">
              {row.items.map((item) => (
                <li key={item}>
                  <span className="stack__pill" data-text={item} onMouseEnter={scramble}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <span className="stack__idx tnum">{String(row.items.length).padStart(2, "0")} modules</span>
          </div>
        ))}
      </div>
    </section>
  );
}
