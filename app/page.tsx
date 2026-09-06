import { Suspense } from "react";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { SiteNav } from "@/components/site-nav";
import { Section } from "@/components/section";
import { Work } from "@/components/work";
import { Experience, Education } from "@/components/experience";
import { Stats } from "@/components/stats";
import { Now } from "@/components/now";
import { Contact, Footer } from "@/components/contact";
import { Reveal } from "@/components/reveal";
import { now, projects } from "@/content/profile";

/** The panels call out to GitHub and LeetCode; refresh them a few times a day. */
export const revalidate = 21600;

export default function Home() {
  return (
    <>
      <SiteNav />
      <Hero />

      <main id="main" className="mx-auto max-w-3xl px-6 sm:px-8">
        <Section
          id="work"
          index="01"
          title="Selected work"
          aside={
            <span className="mono !text-[10.5px] tabular-nums text-fg-4">
              {projects.length} projects
            </span>
          }
        >
          <Work />
        </Section>

        <Section id="experience" index="02" title="Experience">
          <Experience />
        </Section>

        <Section id="education" index="03" title="Education">
          <Education />
        </Section>

        <Section
          id="stats"
          index="04"
          title="By the numbers"
          aside={
            <span className="mono !text-[10.5px] text-fg-4">live</span>
          }
        >
          <Suspense fallback={<StatsSkeleton />}>
            <Stats />
          </Suspense>
        </Section>

        <Section
          id="now"
          index="05"
          title="Currently"
          aside={
            <span className="mono !text-[10.5px] text-fg-4">{now.updated}</span>
          }
        >
          <Now />
        </Section>

        <Section
          id="gallery-teaser"
          index="06"
          title="Elsewhere"
          className="pb-2"
        >
          <Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              <TeaserCard
                href="/gallery"
                title="Gallery"
                note="Photographs, colour studies, and the places the work happens."
              />
              <TeaserCard
                href="/resume"
                title="Résumé"
                note="The one-page version, formatted to print cleanly."
              />
            </div>
          </Reveal>
        </Section>

        <Section id="contact" index="07" title="Contact">
          <Contact />
        </Section>

        <Footer />
      </main>
    </>
  );
}

function TeaserCard({ href, title, note }: { href: string; title: string; note: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between gap-6 rounded-lg border border-line bg-bg-1/45 p-5 transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-line-2 hover:bg-bg-1"
    >
      <p className="text-[13px] leading-[1.65] text-fg-3 transition-colors duration-400 group-hover:text-fg-2">
        {note}
      </p>
      <span className="flex items-center justify-between gap-2">
        <span className="row-title text-[14px] transition-colors duration-400 group-hover:text-accent">
          {title}
        </span>
        <span className="inline-block text-accent opacity-0 transition-all duration-400 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:opacity-100">
          →
        </span>
      </span>
    </Link>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="h-[186px] animate-pulse rounded-lg border border-line bg-bg-1/45"
        />
      ))}
    </div>
  );
}
