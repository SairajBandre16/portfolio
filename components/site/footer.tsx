import { ArrowUpRight } from "lucide-react";
import { footer } from "@/content/home";
import { profile } from "@/lib/site";
import { Skyline } from "./skyline";

const links = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "LinkedIn", href: profile.links.linkedin, external: true },
  { label: "GitHub", href: profile.links.github, external: true },
  { label: "Blog", href: profile.links.blog, external: true },
  { label: "Résumé", href: profile.links.resume, download: true },
];

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden pt-20 sm:pt-28">
      <div className="gutter flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[clamp(2.5rem,1.2rem+4.2vw,5.5rem)] leading-[0.95] font-[600] tracking-[-0.032em] text-balance [font-stretch:90%]">
            <span className="text-fg">{footer.thanks[0]}</span>{" "}
            <span className="text-soft">{footer.thanks[1]}</span>
          </p>
          <p className="text-soft mt-4 text-lg">{footer.madeBy}</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(l.download ? { download: "" } : {})}
                className="group text-soft hover:text-fg inline-flex items-center gap-0.5 transition-colors"
              >
                {l.label}
                <ArrowUpRight
                  size={13}
                  className="opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <Skyline className="mt-10 sm:mt-4" />
    </footer>
  );
}
