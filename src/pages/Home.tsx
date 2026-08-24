import SiteHeader from "../components/home/SiteHeader";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Work from "../components/home/Work";
import Skills from "../components/home/Skills";
import Experience from "../components/home/Experience";
import Contact from "../components/home/Contact";

export default function Home() {
  return (
    <>
      <SiteHeader active={0} />
      <main>
        <Hero />
        <About index={0} />
        <Work index={0} />
        <Skills open={0} />
        <Experience index={0} />
        <Contact />
      </main>
    </>
  );
}
