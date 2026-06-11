import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { timeline } from "../data/content";

export default function Timeline() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.to(".timeline__spine-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline__wrap",
          start: "top 70%",
          end: "bottom 55%",
          scrub: 0.5,
        },
      });

      gsap.utils.toArray<HTMLElement>(".timeline__item").forEach((item) => {
        gsap.from(item, {
          x: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            onEnter: () => item.classList.add("is-lit"),
          },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="section" id="timeline" ref={rootRef}>
      <div className="section-head">
        <h2>Timeline</h2>
        <span className="index">004 / LOG</span>
      </div>
      <div className="timeline__wrap">
        <div className="timeline__spine">
          <div className="timeline__spine-fill" />
        </div>
        {timeline.map((t) => (
          <div className="timeline__item" key={t.period + t.title}>
            <span className="timeline__period">{t.period}</span>
            <div className="timeline__body">
              <h3>{t.title}</h3>
              <h4>{t.org}</h4>
              <p>{t.body}</p>
              <span className="timeline__tag">{t.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
