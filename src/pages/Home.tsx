import { useEffect, useLayoutEffect, type ReactElement } from "react";
import { homeSections } from "../data/home";
import { scrollToId, scrollToTop, startSmoothScroll } from "../lib/motion";
import { useCurrentSection } from "../lib/useCurrentSection";
import { useHomeMotion } from "../lib/useHomeMotion";
import Header from "../components/shared/Header";
import CoverCard from "../components/home/CoverCard";
import Preface from "../components/home/Preface";
import Fields from "../components/home/Fields";
import Drawer from "../components/home/Drawer";
import SkillIndex from "../components/home/SkillIndex";
import Shelf from "../components/home/Shelf";
import RequestSlip from "../components/home/RequestSlip";
import Loader from "../components/home/Loader";

const IDS = homeSections.map((s) => s.id);

export default function Home(): ReactElement {
  const current = useCurrentSection(IDS);

  useLayoutEffect(() => {
    const stop = startSmoothScroll();
    scrollToTop();
    return stop;
  }, []);

  useHomeMotion();

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    document.fonts.ready.then(() => requestAnimationFrame(() => scrollToId(id)));
  }, []);

  return (
    <>
      <Loader />
      <a className="skip" href="#preface">
        Skip to content
      </a>
      <Header items={homeSections} current={current} home="top" />
      <main>
        <CoverCard />
        <Preface />
        <Fields />
        <Drawer />
        <SkillIndex />
        <Shelf />
        <RequestSlip />
      </main>
      <footer className="colophon">
        <span className="mono">© 2026 Krish Jeswal</span>
        <span className="mono">Thanks for reading</span>
      </footer>
    </>
  );
}
