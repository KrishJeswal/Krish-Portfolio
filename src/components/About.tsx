import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, prefersReducedMotion } from "../lib/gsap";
import { profile } from "../data/content";

const stats = [
  { value: "72", label: "classifier configs evaluated" },
  { value: "<100ms", label: "production RAG retrieval" },
  { value: "10+", label: "shipped projects" },
  { value: "2026", label: "targeting IEEE ISCAS" },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      document.fonts.ready.then(() => {
        const statement = rootRef.current?.querySelector(".about__statement");
        if (!statement || statement.querySelector(".word")) return;
        const split = new SplitText(statement, { type: "words", wordsClass: "word" });
        gsap.to(split.words, {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: ".about__statement",
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.6,
          },
        });
        gsap.fromTo(
          ".about__meta-item",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".about__meta", start: "top 85%" },
          }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="section" id="about" ref={rootRef}>
      <div className="section-head">
        <h2>About</h2>
        <span className="index">001 / SIGNAL</span>
      </div>
      <p className="about__statement">{profile.summary}</p>
      <div className="about__meta">
        {stats.map((s) => (
          <div className="about__meta-item" key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
