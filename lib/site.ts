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
  "Sairaj Bandre is a master's student at UCD from Mumbai, now in Dublin, learning AI and building LLM agents, text-to-SQL systems and automations with Claude Code.";

export const sections = [
  { id: "top", label: "Home", nav: false },
  { id: "about", label: "About", nav: true },
  { id: "path", label: "Path", nav: false },
  { id: "work", label: "Work", nav: true },
  { id: "github", label: "GitHub", nav: false },
  { id: "background", label: "Background", nav: true },
  { id: "contact", label: "Contact", nav: true },
] as const;

export type SectionId = (typeof sections)[number]["id"];
