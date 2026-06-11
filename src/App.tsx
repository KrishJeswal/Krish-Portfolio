import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother, ScrollTrigger, prefersReducedMotion } from "./lib/gsap";
import Cursor from "./components/Cursor";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2,
      effects: true,
    });
    if (import.meta.env.DEV) (window as unknown as { __smoother: unknown }).__smoother = smoother;
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => smoother.kill();
  }, []);

  return (
    <>
      <Cursor />
      <Preloader onComplete={() => setLoaded(true)} />
      <Navbar visible={loaded} />
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content">
          <main>
            <Hero play={loaded} />
            <About />
            <Projects />
            <TechStack />
            <Timeline />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
