import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion";

const onView = (trigger: gsap.DOMTarget, start = "top 85%"): ScrollTrigger.Vars => ({
  trigger,
  start,
  toggleActions: "play none none none",
});

export function useCaseMotion(key: string): void {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.1 })
        .from(".head .tcard", { yPercent: -60, duration: 1.2, ease: "expo.out" })
        .from(".head h1", { yPercent: 40, opacity: 0, duration: 0.8, ease: "expo.out" }, "-=0.7")
        .fromTo(
          ".head .by, .head .field",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.5, stagger: 0.18, ease: "steps(30)" },
          "-=0.4",
        )
        .from(
          ".head .tfoot, .head .meta-row, .head .call",
          { opacity: 0, y: 6, stagger: 0.06, duration: 0.4 },
          "-=0.3",
        )
        .from(".bar", { opacity: 0, duration: 0.5 }, "-=0.5");

      gsap.set(".rail", { autoAlpha: 0, x: -14 });
      ScrollTrigger.create({
        trigger: "#capture",
        endTrigger: "#residual",
        start: "top 55%",
        end: "bottom 75%",
        onToggle: (st) =>
          gsap.to(".rail", {
            autoAlpha: st.isActive ? 1 : 0,
            x: st.isActive ? 0 : -14,
            duration: 0.45,
            ease: "power2.out",
            overwrite: true,
          }),
      });

      gsap.utils
        .toArray<HTMLElement>(".ch-head")
        .forEach((h) =>
          gsap.from(h.children, {
            y: 26,
            opacity: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: onView(h),
          }),
        );
      gsap.utils
        .toArray<HTMLElement>(".metric, .formula, .table, .list, .codeblock")
        .forEach((el) =>
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: onView(el, "top 90%"),
          }),
        );
      gsap.utils
        .toArray<HTMLElement>(".aside")
        .forEach((el) =>
          gsap.from(el, {
            y: 20,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: onView(el, "top 92%"),
          }),
        );
      gsap.utils.toArray<HTMLElement>(".diagram").forEach((d) =>
        gsap.from(d.querySelectorAll(".dg-node, .dg-link, .dg-group"), {
          opacity: 0,
          y: 10,
          stagger: 0.025,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: onView(d, "top 80%"),
        }),
      );
      gsap.from(".next-card .tcard", {
        yPercent: 40,
        ease: "none",
        scrollTrigger: { trigger: ".next", start: "top bottom", end: "bottom bottom", scrub: true },
      });
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [key]);
}
