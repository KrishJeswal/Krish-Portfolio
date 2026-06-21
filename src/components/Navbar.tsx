import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollSmoother, prefersReducedMotion } from "../lib/gsap";
import { navLinks } from "../data/content";

export default function Navbar({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const go = (href: string) => {
    setOpen(false);
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(href, true, "top 72px");
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const toTop = () => {
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(0, true);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // section tracking — highlight the link whose section crosses mid-viewport
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive("#" + e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useGSAP(() => {
    const menu = menuRef.current!;
    const links = menu.querySelectorAll("a");
    if (open) {
      gsap.set(menu, { visibility: "visible" });
      gsap.to(menu, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" });
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          links,
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06, delay: 0.22, ease: "power3.out" }
        );
      }
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
          className="nav__mark"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            toTop();
          }}
        >
          <b>Krish Jeswal</b>
        </a>
        <ul className="nav__links">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={active === l.href ? "is-active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.href);
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
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
      <div className="menu" ref={menuRef}>
        {navLinks.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => {
              e.preventDefault();
              go(l.href);
            }}
          >
            <small>0{i + 1}</small>
            {l.label}
          </a>
        ))}
        <a href="/Krish_Resume.pdf" target="_blank" rel="noreferrer">
          <small>0{navLinks.length + 1}</small>Resume ↗
        </a>
      </div>
    </>
  );
}
