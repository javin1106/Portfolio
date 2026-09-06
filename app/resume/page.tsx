import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { Reveal } from "@/components/reveal";
import { PrintButton } from "@/components/print-button";
import { achievements, education, experience, profile, projects, stack } from "@/content/profile";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${profile.name} — ${profile.role}. One page, formatted to print.`,
};

const shortlist = projects.filter((p) => p.featured);

export default function ResumePage() {
  return (
    <>
      <div className="no-print">
        <SiteNav />
      </div>

      <main id="main" className="mx-auto max-w-3xl px-6 pb-8 pt-28 sm:px-8 sm:pt-36 print:pt-0">
        <Reveal>
          <div className="no-print mb-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-tight text-fg-3 transition-colors duration-300 hover:text-accent"
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5">
                ←
              </span>
              Back
            </Link>
            <PrintButton />
          </div>
        </Reveal>

        {/* ---------------------------------------------------------- header */}
        <Reveal delay={50}>
          <header className="print-break border-b border-line pb-6">
            <h1 className="serif text-[clamp(2rem,6.5vw,3rem)] leading-[1.05]">{profile.name}</h1>
            <p className="label mt-2.5">{profile.role}</p>

            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[11px] text-fg-3">
              <li>
                <a href={profile.links.email} className="link-quiet">
                  {profile.email}
                </a>
              </li>
              <li className="text-fg-4">·</li>
              <li>{profile.location}</li>
              <li className="text-fg-4">·</li>
              <li>
                <a href={profile.links.github} target="_blank" rel="noreferrer" className="link-quiet">
                  github.com/{profile.github}
                </a>
              </li>
              <li className="text-fg-4">·</li>
              <li>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="link-quiet">
                  linkedin.com/in/javin-chutani
                </a>
              </li>
              <li className="text-fg-4">·</li>
              <li>
                <a href={profile.links.leetcode} target="_blank" rel="noreferrer" className="link-quiet">
                  leetcode.com/u/{profile.leetcode}
                </a>
              </li>
            </ul>
          </header>
        </Reveal>

        {/* --------------------------------------------------------- summary */}
        <Block index="01" title="Summary" delay={90}>
          <p className="max-w-[70ch] text-[13.5px] leading-[1.75] text-fg-2">
            {profile.tagline} Comfortable across Go and TypeScript, from wire protocols and
            event loops up to the product surface. Most at home debugging the layer other
            people treat as a black box.
          </p>
        </Block>

        {/* ------------------------------------------------------- education */}
        <Block index="02" title="Education" delay={130}>
          {education.map((school) => (
            <div key={school.school} className="print-break">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-[14px] font-medium text-fg">{school.full}</h3>
                <span className="mono !text-[11px] tabular-nums">{school.period}</span>
              </div>
              <p className="mt-1 text-[13px] text-fg-3">{school.degree}</p>
            </div>
          ))}
        </Block>

        {/* ------------------------------------------------------ experience */}
        <Block index="03" title="Experience" delay={170}>
          <div className="space-y-7">
            {experience.map((job) => (
              <div key={job.role + job.period} className="print-break">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[14px] font-medium text-fg">{job.role}</h3>
                  <span className="mono !text-[11px] tabular-nums">{job.period}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-fg-2">
                  {job.org}
                  {job.meta ? <span className="text-fg-4"> · {job.meta}</span> : null}
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {job.points.map((point) => (
                    <li
                      key={point}
                      className="relative max-w-[70ch] pl-4 text-[13px] leading-[1.7] text-fg-3"
                    >
                      <span className="absolute left-0 top-[0.62em] h-px w-2 bg-line-2" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        {/* -------------------------------------------------------- projects */}
        <Block index="04" title="Selected projects" delay={210}>
          <div className="space-y-6">
            {shortlist.map((project) => (
              <div key={project.name} className="print-break">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[14px] font-medium text-fg">
                    {project.repo ? (
                      <a href={project.repo} target="_blank" rel="noreferrer" className="link-quiet !text-fg">
                        {project.name}
                      </a>
                    ) : (
                      project.name
                    )}
                  </h3>
                  <span className="mono !text-[11px]">{project.stack.join(" · ")}</span>
                </div>
                <p className="mt-1.5 max-w-[70ch] text-[13px] leading-[1.7] text-fg-3">
                  {project.blurb}
                </p>
              </div>
            ))}
          </div>
        </Block>

        {/* ---------------------------------------------------- achievements */}
        <Block index="05" title="Achievements" delay={245}>
          <ul className="space-y-2.5">
            {achievements.map((item) => (
              <li
                key={item.title}
                className="relative max-w-[70ch] pl-4 text-[13px] leading-[1.7] print-break"
              >
                <span className="absolute left-0 top-[0.62em] h-px w-2 bg-line-2" />
                <span className="text-fg">{item.title}</span>
                <span className="text-fg-3"> — {item.note}</span>
              </li>
            ))}
          </ul>
        </Block>

        {/* ---------------------------------------------------------- skills */}
        <Block index="06" title="Technical skills" delay={260}>
          <dl className="space-y-3">
            {Object.entries(stack).map(([group, items]) => (
              <div key={group} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <dt className="label w-[108px] shrink-0 !text-[9.5px]">{group}</dt>
                <dd className="flex-1 text-[13px] text-fg-2">{items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <p className="mt-14 border-t border-line pt-5 font-mono text-[10px] text-fg-4">
          Last updated September 2026 · the live version lives at{" "}
          <span className="text-fg-3">javinchutani.vercel.app</span>
        </p>
      </main>
    </>
  );
}

function Block({
  index,
  title,
  delay,
  children,
}: {
  index: string;
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={delay} as="section">
      <div className="mt-10 print-break">
        <div className="mb-4 flex items-center gap-4">
          <h2 className="label shrink-0">
            <span className="text-fg-4">{index}</span>
            <span className="mx-2 text-fg-4">/</span>
            {title}
          </h2>
          <span className="h-px flex-1 bg-line" />
        </div>
        {children}
      </div>
    </Reveal>
  );
}
