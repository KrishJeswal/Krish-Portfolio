import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import HeroScene from "./HeroScene";

const marqueeItems = [
  "Side-Channel Research",
  "RAG Pipelines",
  "Full-Stack Engineering",
  "Embedded Systems",
  "PyTorch",
  "GCP Cloud Run",
  "React / TypeScript",
];

export default function Hero({ play }: { play: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(".hero__canvas", { opacity: 0 });
      gsap.set(".hero__title .line-inner", { yPercent: 110 });
      gsap.set([".hero__eyebrow", ".hero__sub"], { opacity: 0, y: 16 });
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      if (!play || prefersReducedMotion()) return;

      const tl = gsap.timeline();
      tl.to(".hero__canvas", { opacity: 1, duration: 1.4, ease: "power2.out" }, 0)
        .to(
          ".hero__title .line-inner",
          { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "power4.out" },
          0
        )
        .to(
          [".hero__eyebrow", ".hero__sub"],
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          0.1
        );

      gsap.to(".hero__content", {
        yPercent: -18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { dependencies: [play], scope: rootRef }
  );

  return (
    <>
      <section className="hero" ref={rootRef} id="top">
        <HeroScene />
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="dot" />
            <span className="mono-label">
              Available for research & internships — {new Date().getFullYear()}
            </span>
          </div>
          <h1 className="hero__title" aria-label="Krish Jeswal">
            <span className="line-mask">
              <span className="line-inner" style={{ display: "block" }}>
                Krish
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner outline" style={{ display: "block" }}>
                Jeswal
              </span>
            </span>
          </h1>
          <div className="hero__sub">
            <p className="hero__role">
              <span className="acid">&gt;_</span> Full-Stack Developer & ML Scientist —
              Electronics & Telecom @ RVCE, Bengaluru
            </p>
            <span className="hero__scroll">scroll</span>
          </div>
        </div>
      </section>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {marqueeItems.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <div className="marquee__track">
          {marqueeItems.map((m) => (
            <span key={`b-${m}`}>{m}</span>
          ))}
        </div>
      </div>
    </>
  );
}
