import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/profile";
import { links } from "@/content/links";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-plex-mono", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description =
  "Ansh Sharma — software developer building full-stack web applications and AI products: React, Node.js, LLMs, RAG and computer vision.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Ansh Sharma — Software Developer", template: "%s · Ansh Sharma" },
  description,
  keywords: ["Ansh Sharma", "software developer", "full-stack", "React", "Node.js", "AI applications", "RAG", "portfolio"],
  authors: [{ name: profile.name, url: links.github }],
  openGraph: {
    type: "website",
    title: "Ansh Sharma — Software Developer",
    description,
    siteName: "Ansh Sharma",
  },
  twitter: { card: "summary_large_image", title: "Ansh Sharma — Software Developer", description },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${links.email}`,
  url: siteUrl,
  sameAs: [links.github, links.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: "O.P. Jindal University" },
  knowsAbout: ["React", "Node.js", "TypeScript", "Python", "Retrieval-augmented generation", "Computer vision"],
};

// Runs before first paint: returning visitors (same session) skip the loader; ?intro=1 forces it.
const preflight = `try{var q=location.search.indexOf('intro=1')>-1;if(q){sessionStorage.removeItem('obsidian-intro-seen')}if(sessionStorage.getItem('obsidian-intro-seen')==='1'){document.documentElement.classList.add('skip-intro')}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preflight }} />
        <noscript>
          <style>{`#preloader{display:none}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Preloader />
        <SmoothScroll />
        <Cursor />
        <Nav />
        {children}
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
