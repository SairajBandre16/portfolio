import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Martian_Mono } from "next/font/google";
import { Providers } from "@/components/site/providers";
import { Footer } from "@/components/site/footer";
import { profile, siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  preload: false,
});
const martian = Martian_Mono({ variable: "--font-martian", subsets: ["latin"], preload: false });

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
    { media: "(prefers-color-scheme: dark)", color: "#121210" },
    { media: "(prefers-color-scheme: light)", color: "#f4f2ec" },
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${bricolage.variable} ${instrument.variable} ${martian.variable} antialiased`}
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
            className="bg-fg text-bg fixed top-3 left-3 z-50 -translate-y-20 rounded-full px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
