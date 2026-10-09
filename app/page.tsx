import { Hero } from "@/components/hero/hero";
import { About } from "@/components/about/about";
import { FlightPlan } from "@/components/roadmap/flight-plan";
import { Projects } from "@/components/projects/projects";
import { GitHubSection } from "@/components/github/github-section";
import { Experience } from "@/components/experience/experience";
import { Research } from "@/components/research/research";
import { Skills } from "@/components/skills/skills";
import { Contact } from "@/components/contact/contact";
import { Altimeter } from "@/components/shell/altimeter";

export default function Home() {
  return (
    <>
      <Altimeter />
      <main id="main">
        <Hero />
        <About />
        <FlightPlan />
        <Projects />
        <GitHubSection />
        <Experience />
        <Research />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
