import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import { Dock, TopBar } from "@/components/dock";
import { Onboarding } from "@/components/onboarding";
import { Terminal } from "@/components/terminal/terminal";
import { PaletteCycler } from "@/components/palette-cycler";
import { getInitialPalette, getSlides } from "@/lib/banner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://javinchutani.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.tagline,
  keywords: [
    profile.name,
    "backend engineer",
    "AI engineer",
    "Go",
    "TypeScript",
    "distributed systems",
    "NIT Jalandhar",
    "portfolio",
  ],
  authors: [{ name: profile.name, url: profile.links.github }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: profile.name,
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0b0a" },
    { media: "(prefers-color-scheme: light)", color: "#f6f2eb" },
  ],
};

/**
 * Runs before first paint, so nothing visibly "jumps":
 *  - theme: dark by default, light if chosen or preferred by the system;
 *  - onboarding: only on the home page, only for a first visit (or ?intro),
 *    never for people who asked the OS to reduce motion.
 */
const BOOT_SCRIPT = `(function(){try{
var d=document.documentElement,ls=localStorage;
var t=ls.getItem("theme");
if(t?t==="light":matchMedia("(prefers-color-scheme: light)").matches)d.classList.add("light");
var forced=/[?&]intro(=|&|$)/.test(location.search);
if(location.pathname==="/"&&(forced||(!ls.getItem("intro-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)))d.classList.add("intro");
}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The first banner photo's colours, baked into the HTML so the very first
  // frame is already in palette — the slideshow takes over from there.
  const [p, slides] = await Promise.all([getInitialPalette(), getSlides()]);
  const palette = `:root{--ah:${p.ah};--as:${p.as}%;--gh:${p.ah};--gs:${p.as}%;--th:${p.th};--ts:${p.ts}%}`;

  return (
    // The font variables must live on <html>: Tailwind's `@theme` resolves
    // --font-sans/serif/mono at :root, so the next/font variables they point at
    // have to be declared there too, not on <body>.
    <html
      lang="en"
      className={`${inter.variable} ${instrument.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: palette }} />
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="grain">
        <Onboarding />
        <Terminal />
        <TopBar />
        <PaletteCycler palettes={slides.map((s) => s.palette)} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-bg-1 focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        {children}
        <Dock />
      </body>
    </html>
  );
}
