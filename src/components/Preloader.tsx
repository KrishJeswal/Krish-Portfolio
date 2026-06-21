import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, NOISE_CHARS } from "../lib/gsap";

const WAVE =
  "M0 32 L60 32 L74 10 L88 54 L102 18 L116 46 L130 32 L210 32 L224 8 L238 56 L252 22 L266 42 L280 32 L520 32";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(() => {
    if (prefersReducedMotion()) {
      setDone(true);
      onComplete();
      return;
    }

    const path = pathRef.current!;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        onComplete();
      },
    });

    tl.to(path, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0)
      .to(
        nameRef.current,
        { duration: 1.3, scrambleText: { text: "KRISH JESWAL", chars: NOISE_CHARS, speed: 0.5 } },
        0.25
      )
      .to(
        counter,
        {
          v: 100,
          duration: 1.9,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0
      )
      .to(barRef.current, { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0)
      .to(rootRef.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power4.inOut" }, "+=0.2");
  }, []);

  if (done) return null;

  return (
    <div className="preload" ref={rootRef} style={{ clipPath: "inset(0 0 0% 0)" }}>
      <div className="preload__inner">
        <div className="preload__row">
          <span>Acquiring signal</span>
          <span className="preload__name" ref={nameRef}>
            ░░░░░ ░░░░░░
          </span>
        </div>
        <div className="preload__scope">
          <svg viewBox="0 0 520 64" preserveAspectRatio="none">
            <path ref={pathRef} d={WAVE} />
          </svg>
        </div>
        <div className="preload__bar">
          <span ref={barRef} />
        </div>
        <div className="preload__row">
          <span>CH·01 / TRACE LOCK</span>
          <span className="preload__count" ref={countRef}>
            000
          </span>
        </div>
      </div>
    </div>
  );
}
