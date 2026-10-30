import { useLayoutEffect, type ReactElement } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CASE_SECTIONS, isProjectSlug, projectBySlug } from "../data/projects";
import { scrollToTop, startSmoothScroll } from "../lib/motion";
import { useCurrentSection } from "../lib/useCurrentSection";
import { useCaseMotion } from "../lib/useCaseMotion";
import { useLineGrid } from "../lib/useLineGrid";
import Header from "../components/shared/Header";
import TitleCard from "../components/case/TitleCard";
import Rail from "../components/case/Rail";
import Blocks from "../components/case/Blocks";
import NextCard from "../components/case/NextCard";

const IDS = CASE_SECTIONS.map((s) => s.id);
const NAV = CASE_SECTIONS.map((s) => ({ id: s.id, label: s.label, number: s.number ?? "—" }));
const CHAPTERS = CASE_SECTIONS.filter((s) => s.id !== "top");

export default function CaseStudy(): ReactElement {
  const { slug = "" } = useParams();
  const valid = isProjectSlug(slug);
  const current = useCurrentSection(IDS, slug);

  useLayoutEffect(() => {
    const stop = startSmoothScroll();
    scrollToTop();
    return stop;
  }, [slug]);

  useCaseMotion(slug);
  useLineGrid(slug);

  if (!valid) return <Navigate to="/" replace />;
  const project = projectBySlug(slug);

  return (
    <>
      <a className="skip" href="#capture">
        Skip to the case study
      </a>
      <Header items={NAV} current={current} home="route" />
      <main className="case">
        <TitleCard project={project} />
        <Rail current={current} />
        {CHAPTERS.map((s) => (
          <section className="chapter" id={s.id} key={`${slug}-${s.id}`}>
            <div className="read">
              <div className="ch-head">
                <span className="mono">Chapter {s.number}</span>
                <h2>{s.label}.</h2>
              </div>
              <Blocks blocks={project.sections[s.id as Exclude<typeof s.id, "top">]} />
            </div>
          </section>
        ))}
        <NextCard project={project} />
      </main>
    </>
  );
}
