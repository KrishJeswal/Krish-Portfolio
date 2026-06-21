import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../lib/gsap";
import { layers } from "../data/content";

const metrics = [
  { value: "0.46", label: "guessing entropy recovered" },
  { value: "72", label: "classifier configs evaluated" },
  { value: "<100ms", label: "production RAG retrieval" },
  { value: "2026", label: "IEEE submission" },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Reveals created synchronously so their triggers exist before the
      // global refresh — keeps them from getting stuck hidden.
      gsap.from(".layer", {
        y: 36,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".layers", start: "top 85%", once: true },
      });
      gsap.from(".metric", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".metrics", start: "top 88%", once: true },
      });

      // Word de-noise needs loaded fonts for accurate splitting.
      document.fonts.ready.then(() => {
        const statement = rootRef.current?.querySelector(".thesis__statement");
        if (statement && !statement.querySelector(".word")) {
          const split = new SplitText(statement, { type: "words", wordsClass: "word" });
          gsap.to(split.words, {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: { trigger: statement, start: "top 80%", end: "bottom 55%", scrub: 0.6 },
          });
        }
        ScrollTrigger.refresh();
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="sec" id="thesis" ref={rootRef}>
      <div className="sec__head">
        <span className="sec__chan">CH·00 / Thesis</span>
        <h2 className="sec__title">Signal from noise</h2>
        <span className="sec__meta">001</span>
      </div>

      <div className="thesis__grid">
        <div>
          <p className="thesis__statement">
            Most of what matters is buried in noise. My work is pulling the signal back out.
          </p>
          <div className="metrics" style={{ marginTop: "clamp(2rem,5vw,3rem)" }}>
            {metrics.map((m) => (
              <div className="metric" key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="layers">
          {layers.map((l) => (
            <div className="layer" key={l.id}>
              <span className="layer__id">{l.id}</span>
              <div>
                <span className="layer__chan">{l.channel}</span>
                <h3 className="layer__title">{l.title}</h3>
                <p className="layer__body">{l.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
