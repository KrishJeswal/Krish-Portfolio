import { useRef, useState } from "react";
import { sections } from "../data/home";
import { useIsUnstuck, useReducedMotion } from "../lib/env";
import { useActiveSection, usePanelDepth } from "../lib/useHomeScroll";
import Loader from "../components/home/Loader";
import CursorBlob, { type Mirror } from "../components/home/CursorBlob";
import SiteHeader, { HeaderContent } from "../components/home/SiteHeader";
import Hero, { HeroContent } from "../components/home/Hero";
import About from "../components/home/About";
import Work from "../components/home/Work";
import Skills from "../components/home/Skills";
import Experience from "../components/home/Experience";
import Contact from "../components/home/Contact";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);

  const unstuck = useIsUnstuck();
  const reduced = useReducedMotion();

  const active = useActiveSection(mainRef, sections.length);
  usePanelDepth(mainRef, !unstuck && !reduced);

  const goHome = () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

  // What the blob draws inside itself: the same two components again, so the
  // knockout tracks the live nav numeral and the hero's deal without any
  // bookkeeping of its own.
  const mirrors: readonly Mirror[] = [
    { ref: heroContentRef, node: <HeroContent play={loaded} /> },
    { ref: headerRef, className: "site-header", node: <HeaderContent active={active} /> },
  ];

  return (
    <>
      <a className="skip-link" href="#hero">
        Skip to content
      </a>
      <Loader onDone={() => setLoaded(true)} />
      <CursorBlob hostRef={heroSectionRef} sizeRef={heroContentRef} mirrors={mirrors} />
      <SiteHeader active={active} onHome={goHome} elRef={headerRef} />
      <main ref={mainRef}>
        <Hero play={loaded} sectionRef={heroSectionRef} contentRef={heroContentRef} />
        <About />
        <Work active={active === 2} />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
