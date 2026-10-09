import profile from "@/content/profile.json";

export { profile };

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const siteTitle = `${profile.name} · Aspiring AI Engineer`;
export const siteDescription =
  "Sairaj Bandre is an automation engineer turned aspiring AI engineer in Dublin, building text-to-SQL agents, supply-chain risk models and other AI projects with Claude Code.";

// Sections double as altitude: the page climbs from the ground to cruise.
export const sections = [
  { id: "top", label: "Home", fl: "GND", nav: false },
  { id: "about", label: "About", fl: "FL010", nav: true },
  { id: "flight-plan", label: "Flight plan", fl: "FL020", nav: true },
  { id: "work", label: "Work", fl: "FL030", nav: true },
  { id: "github", label: "GitHub", fl: "FL040", nav: false },
  { id: "experience", label: "Experience", fl: "FL050", nav: true },
  { id: "research", label: "Research", fl: "FL060", nav: false },
  { id: "skills", label: "Skills", fl: "FL070", nav: false },
  { id: "contact", label: "Contact", fl: "FL080", nav: true },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export function section(id: SectionId) {
  return sections.find((s) => s.id === id)!;
}
