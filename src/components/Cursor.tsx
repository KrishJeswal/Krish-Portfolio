import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [data-cursor]");
      ring.classList.toggle("is-hover", !!interactive);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
