import { Hero } from "@/components/hero/hero";
import { About } from "@/components/about/about";
import { LearningPath } from "@/components/path/learning-path";
import { Projects } from "@/components/projects/projects";
import { GitHubSection } from "@/components/github/github-section";
import { Background } from "@/components/background/background";
import { Contact } from "@/components/contact/contact";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <LearningPath />
      <Projects />
      <GitHubSection />
      <Background />
      <Contact />
    </main>
  );
}
