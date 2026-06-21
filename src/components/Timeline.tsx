import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { timeline } from "../data/content";

export default function Timeline() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.utils.toArray<HTMLElement>(".log__item").forEach((i) => i.classList.add("is-lit"));
        return;
      }

      gsap.to(".log__spine span", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".log", start: "top 68%", end: "bottom 55%", scrub: 0.5 },
      });

      gsap.utils.toArray<HTMLElement>(".log__item").forEach((item) => {
        gsap.from(item, {
          x: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
            once: true,
            onEnter: () => item.classList.add("is-lit"),
          },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="sec" id="log" ref={rootRef}>
      <div className="sec__head">
        <span className="sec__chan">Chronology</span>
        <h2 className="sec__title">Log</h2>
        <span className="sec__meta">004</span>
      </div>

      <div className="log">
        <div className="log__spine">
          <span />
        </div>
        {timeline.map((t) => (
          <div className="log__item" key={t.period + t.title}>
            <span className="log__period">{t.period}</span>
            <div>
              <h3 className="log__title">{t.title}</h3>
              <p className="log__org">{t.org}</p>
              <p className="log__body">{t.body}</p>
              <span className="log__tag">{t.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
