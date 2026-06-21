import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, prefersReducedMotion } from "../lib/gsap";
import HeroScene from "./HeroScene";

export default function Hero({ play }: { play: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const l1Ref = useRef<HTMLSpanElement>(null);
  const l2Ref = useRef<HTMLSpanElement>(null);

  // hide the pieces up front (motion only) so there's no flash before play
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(".hero__canvas", { opacity: 0 });
      gsap.set(".hero__title", { autoAlpha: 0 });
      gsap.set([".hero__eyebrow", ".hero__foot"], { autoAlpha: 0, y: 18 });
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      if (!play || prefersReducedMotion()) return;

      gsap.to(".hero__canvas", { opacity: 1, duration: 1.5, ease: "power2.out" });

      let splits: SplitText[] = [];
      document.fonts.ready.then(() => {
        if (!l1Ref.current || !l2Ref.current) return;
        splits = [
          new SplitText(l1Ref.current, { type: "chars", charsClass: "ch" }),
          new SplitText(l2Ref.current, { type: "chars", charsClass: "ch" }),
        ];
        const chars1 = splits[0].chars;
        const chars2 = splits[1].chars;

        gsap.set(".hero__title", { autoAlpha: 1 });
        gsap.set([...chars1, ...chars2], { yPercent: 125, opacity: 0 });

        const tl = gsap.timeline();
        tl.to(".hero__eyebrow", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" })
          // name cascades in character by character, line 1 then line 2
          .to(
            chars1,
            { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.042, ease: "power4.out" },
            0.15
          )
          .to(
            chars2,
            { yPercent: 0, opacity: 1, duration: 1, stagger: 0.038, ease: "power4.out" },
            0.34
          )
          // a breath of overshoot settle on the whole name
          .fromTo(
            ".hero__title",
            { scale: 1.025, transformOrigin: "left bottom" },
            { scale: 1, duration: 1.1, ease: "power3.out" },
            0.2
          )
          .to(".hero__foot", { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.7);
      });

      // Parallax only the name block; the role/now text stays fully legible.
      gsap.to(".hero__top", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });

      return () => splits.forEach((s) => s.revert());
    },
    { dependencies: [play], scope: rootRef }
  );

  return (
    <section className="hero" id="top" ref={rootRef}>
      <HeroScene />

      <div className="hero__inner hero__top">
        <div className="hero__eyebrow">
          <span className="dot" />
          <span className="eyebrow">Portfolio — 2026 · Bengaluru</span>
        </div>
        <h1 className="hero__title" aria-label="Krish Jeswal">
          <span className="ln">
            <span ref={l1Ref}>Krish</span>
          </span>
          <span className="ln">
            <span className="stroke" ref={l2Ref}>
              Jeswal
            </span>
          </span>
        </h1>
      </div>

      <div className="hero__inner hero__foot">
        <div>
          <p className="hero__role">
            <b>ML researcher</b> recovering signal from noise — side-channel attacks on masked AES,
            submitted to IEEE. <b>Full-stack engineer</b> shipping RAG on GCP.
          </p>
          <p className="hero__now">
            <b>Now</b> — masked-AES leakage · RAG on Cloud Run
          </p>
        </div>
        <span className="hero__scroll">
          Scroll <i />
        </span>
      </div>
    </section>
  );
}
