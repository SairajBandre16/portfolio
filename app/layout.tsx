import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Doto, Martian_Mono, Syne } from "next/font/google";
import { Providers } from "@/components/shell/providers";
import { SmoothScroll } from "@/components/shell/smooth-scroll";
import { ScrollProgress } from "@/components/shell/scroll-progress";
import { PlaneSpotter } from "@/components/shell/plane-spotter";
import { ParticleField } from "@/components/signal/particle-field";
import { SceneDirector } from "@/components/signal/scene-director";
import { Nav } from "@/components/shell/nav";
import { CommandMenu } from "@/components/shell/command-menu";
import { projects } from "@/content/projects";
import { profile, siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

// Variable, so the hero can pair a regular greeting with an extra-bold name.
const syne = Syne({ variable: "--font-syne", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});
const martian = Martian_Mono({ variable: "--font-martian", subsets: ["latin"], preload: false });
const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["700", "900"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s · ${profile.name}` },
  description: siteDescription,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.links.github }],
  keywords: [
    "Sairaj Bandre",
    "AI engineer",
    "Applied AI",
    "ML engineer",
    "text-to-SQL",
    "LLM agents",
    "automation",
    "Dublin",
    "UCD",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title: siteTitle,
    description: siteDescription,
    locale: "en_IE",
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0f" },
    { media: "(prefers-color-scheme: light)", color: "#f1eee6" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  jobTitle: "Aspiring AI Engineer",
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Dublin", addressCountry: "IE" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "University College Dublin" },
    { "@type": "CollegeOrUniversity", name: "SIES Graduate School of Technology" },
  ],
  knowsAbout: [
    "Artificial intelligence",
    "Machine learning",
    "LLM agents",
    "Text-to-SQL",
    "RPA",
    "n8n",
  ],
  sameAs: [profile.links.github, profile.links.linkedin],
};

const commandProjects = projects.map(({ slug, title, tagline, callsign }) => ({
  slug,
  title,
  tagline,
  callsign,
}));

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      data-scene="core"
      className={`${syne.variable} ${bricolage.variable} ${martian.variable} ${doto.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>
          <a
            href="#main"
            className="bg-accent text-ink fixed top-3 left-3 z-[80] -translate-y-20 rounded-full px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <Nav />
          <SmoothScroll />
          <SceneDirector />
          <ParticleField />
          <PlaneSpotter />
          <CommandMenu projects={commandProjects} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
