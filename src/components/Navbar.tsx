import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollSmoother } from "../lib/gsap";
import { navLinks } from "../data/content";

export default function Navbar({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const scrollTo = (href: string) => {
    setOpen(false);
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(href, true, "top 80px");
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  useGSAP(() => {
    const menu = menuRef.current!;
    const links = menu.querySelectorAll("a");
    if (open) {
      gsap.set(menu, { visibility: "visible" });
      gsap.to(menu, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" });
      gsap.fromTo(
        links,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06, delay: 0.25, ease: "power3.out" }
      );
    } else {
      gsap.to(menu, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "power4.inOut",
        onComplete: () => gsap.set(menu, { visibility: "hidden" }),
      });
    }
  }, [open]);

  return (
    <>
      <nav className={`nav ${visible ? "is-visible" : ""}`}>
        <a
          className="nav__logo"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            ScrollSmoother.get()?.scrollTo(0, true);
          }}
        >
          Krish Jeswal <span>©</span>
        </a>
        <ul className="nav__links">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(l.href);
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="nav__cta" href="/Krish_Resume.pdf" target="_blank" rel="noreferrer">
          Resume ↗
        </a>
        <button
          className={`nav__burger ${open ? "is-open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
      <div className="mobile-menu" ref={menuRef}>
        {navLinks.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(l.href);
            }}
          >
            <small>0{i + 1}</small>
            {l.label}
          </a>
        ))}
        <a href="/Krish_Resume.pdf" target="_blank" rel="noreferrer">
          <small>06</small>Resume ↗
        </a>
      </div>
    </>
  );
}
