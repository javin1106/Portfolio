import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { GalleryGrid } from "@/components/gallery-grid";
import { Reveal } from "@/components/reveal";
import { Footer } from "@/components/contact";
import { gallery } from "@/content/profile";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs, colour studies, and the places the work happens.",
};

export default function GalleryPage() {
  return (
    <>
      <SiteNav />

      <main id="main" className="mx-auto max-w-5xl px-6 pb-8 pt-28 sm:px-8 sm:pt-36">
        <Reveal>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-tight text-fg-3 transition-colors duration-300 hover:text-accent"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5">
              ←
            </span>
            Back
          </Link>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-line pb-7">
            <h1 className="serif text-[clamp(2.25rem,7vw,3.5rem)] leading-[1.05]">Gallery</h1>
            <p className="mono !text-[11px] tabular-nums">
              {gallery.length} frames · click to enlarge
            </p>
          </div>
        </Reveal>

        <Reveal delay={110}>
          <p className="mt-7 max-w-[56ch] text-[14px] leading-[1.75] text-fg-3">
            Things I photograph when I’m not staring at a terminal — light, structure, and
            the occasional reminder to zoom out.
          </p>
        </Reveal>

        <div className="mt-12">
          <GalleryGrid />
        </div>

        <Footer />
      </main>
    </>
  );
}
