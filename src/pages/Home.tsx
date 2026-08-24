import { useRef, useState } from "react";
import { sections } from "../data/home";
import { useIsUnstuck, useReducedMotion } from "../lib/env";
import { useActiveSection, usePanelDepth } from "../lib/useHomeScroll";
import Loader from "../components/home/Loader";
import SiteHeader from "../components/home/SiteHeader";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Work from "../components/home/Work";
import Skills from "../components/home/Skills";
import Experience from "../components/home/Experience";
import Contact from "../components/home/Contact";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  const unstuck = useIsUnstuck();
  const reduced = useReducedMotion();

  const active = useActiveSection(mainRef, sections.length);
  usePanelDepth(mainRef, !unstuck && !reduced);

  return (
    <>
      <Loader onDone={() => setLoaded(true)} />
      <SiteHeader
        active={active}
        onHome={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      />
      <main ref={mainRef}>
        <Hero play={loaded} />
        <About />
        <Work active={active === 2} />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
