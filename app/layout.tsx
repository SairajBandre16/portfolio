import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/shell/providers";
import { SmoothScroll } from "@/components/shell/smooth-scroll";
import { ScrollProgress } from "@/components/shell/scroll-progress";
import { Reticle } from "@/components/shell/reticle";
import { Nav } from "@/components/shell/nav";
import { profile, siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
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
    { media: "(prefers-color-scheme: dark)", color: "#0d0e10" },
    { media: "(prefers-color-scheme: light)", color: "#f3f1ec" },
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
  knowsAbout: ["Artificial intelligence", "Machine learning", "LLM agents", "Text-to-SQL", "RPA", "n8n"],
  sameAs: [profile.links.github, profile.links.linkedin],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <a
            href="#main"
            className="fixed top-3 left-3 z-[80] -translate-y-20 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <Nav />
          <SmoothScroll />
          <Reticle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
