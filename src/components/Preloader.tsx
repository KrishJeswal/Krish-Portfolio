import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, SCRAMBLE_CHARS } from "../lib/gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(() => {
    if (prefersReducedMotion()) {
      setDone(true);
      onComplete();
      return;
    }

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        onComplete();
      },
    });

    tl.to(nameRef.current, {
      duration: 1.4,
      scrambleText: {
        text: "KRISH JESWAL",
        chars: SCRAMBLE_CHARS,
        speed: 0.4,
      },
    })
      .to(
        counter,
        {
          value: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current)
              countRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
          },
        },
        0
      )
      .to(barRef.current, { scaleX: 1, duration: 2, ease: "power2.inOut" }, 0)
      .to(rootRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1,
        ease: "power4.inOut",
        delay: 0.15,
      });
  }, []);

  if (done) return null;

  return (
    <div className="preloader" ref={rootRef} style={{ clipPath: "inset(0 0 0% 0)" }}>
      <p className="preloader__name" ref={nameRef}>
        ////////////
      </p>
      <span className="preloader__count" ref={countRef}>
        000
      </span>
      <div className="preloader__bar">
        <div className="preloader__bar-fill" ref={barRef} />
      </div>
    </div>
  );
}
