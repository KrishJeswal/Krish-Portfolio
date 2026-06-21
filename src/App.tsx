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
      smooth: 1.1,
      effects: true,
    });
    if (import.meta.env.DEV) (window as unknown as { __smoother: unknown }).__smoother = smoother;
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      smoother.kill();
    };
  }, []);

  // Once the preloader unmounts and layout is final, recompute every trigger's
  // position. Section reveals are created at mount (before ScrollSmoother and
  // before the preloader clears), so without this refresh their start points
  // are stale and reveals can stay stuck hidden.
  useGSAP(
    () => {
      if (!loaded || prefersReducedMotion()) return;
      const id = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(id);
    },
    { dependencies: [loaded] }
  );

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
    </>
  );
}
