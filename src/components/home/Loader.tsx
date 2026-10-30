import { useLayoutEffect, useRef, useState, type ReactElement } from "react";
import gsap from "gsap";
import { finishLoader, loaderPending } from "../../lib/loader";
import { prefersReducedMotion } from "../../lib/motion";

export default function Loader(): ReactElement | null {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !loaderPending() || prefersReducedMotion()) {
      setGone(true);
      finishLoader();
      return;
    }
    document.documentElement.classList.add("is-loading");
    const count = el.querySelector<HTMLElement>(".loader-count")!;
    const progress = { v: 0 };

    const ctx = gsap.context(() => {
      gsap.set(el, { animation: "none" });
      const tl = gsap.timeline();
      tl.from(".loader-in > *", { y: 14, opacity: 0, stagger: 0.07, duration: 0.5, ease: "power2.out" })
        .to(
          progress,
          {
            v: 100,
            duration: 1.3,
            ease: "power2.inOut",
            onUpdate: () => {
              count.textContent = String(Math.round(progress.v)).padStart(3, "0");
            },
          },
          0.15,
        )
        .fromTo(".loader-rule i", { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0.15)
        .add(() => {
          tl.pause();
          document.fonts.ready.then(() => tl.resume());
        })
        .to(".loader-in", { y: -24, opacity: 0, duration: 0.45, ease: "power2.in" }, "+=0.15")
        .add(() => {
          document.documentElement.classList.remove("is-loading");
          finishLoader();
        }, "-=0.1")
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" }, "<")
        .add(() => setGone(true));
    }, el);

    return () => {
      ctx.revert();
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (gone) return null;

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader-in">
        <span className="mono loader-eyebrow">Retrieving from the stacks</span>
        <span className="loader-count">000</span>
        <span className="loader-rule">
          <i />
        </span>
      </div>
    </div>
  );
}
