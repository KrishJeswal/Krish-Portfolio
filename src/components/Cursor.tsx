import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

/* A scope probe: crosshair + live coordinate readout that "locks" with corner
   brackets over interactive targets. Functional instrument language, not a
   decorative dot-and-ring. */
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const root = rootRef.current!;
    document.documentElement.classList.add("has-scope-cursor");

    const xTo = gsap.quickTo(root, "x", { duration: 0.12, ease: "power3" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.12, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      // The sphere field and the stack matrix get the same locked reticle as
      // interactive targets — brightened crosshair with corner brackets.
      const hot = !!t.closest("a, button, input, textarea, [data-cursor], .hero, #stack");
      root.classList.toggle("is-hot", hot);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      document.documentElement.classList.remove("has-scope-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <div className="scope-cursor" ref={rootRef} aria-hidden="true">
      <span className="scope-cursor__h" />
      <span className="scope-cursor__v" />
      <span className="scope-cursor__lock">
        <span />
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}
