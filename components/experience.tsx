"use client";

import { useState } from "react";
import { education, experience } from "@/content/profile";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Experience() {
  // Everything starts collapsed: the headline facts first, detail on a click.
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <ul>
        {experience.map((job, i) => {
          const isOpen = open === i;
          return (
            <Reveal as="li" key={job.role + job.period} delay={i * 70}>
              <div className="border-b border-dashed border-line-2 py-5">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group block w-full text-left"
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="text-[15.5px] font-medium text-fg transition-colors duration-300 group-hover:text-accent">
                      {job.role}
                    </span>
                    <span className="mono shrink-0 !text-[11px] tabular-nums">{job.period}</span>
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-[13px] text-fg-2">
                    {job.org}
                    <span
                      aria-hidden
                      className={cn(
                        "font-mono text-[11px] text-fg-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:text-accent",
                        isOpen && "rotate-90",
                      )}
                    >
                      ›
                    </span>
                  </span>
                </button>

                <div className="expand" data-open={isOpen}>
                  <div>
                    <div className="pt-3.5">
                      {job.meta ? (
                        <p className="mb-3 font-mono text-[10.5px] text-fg-4">{job.meta}</p>
                      ) : null}
                      <ul className="space-y-2">
                        {job.points.map((point) => (
                          <li
                            key={point}
                            className="relative max-w-[62ch] pl-4 text-[13.5px] leading-[1.7] text-fg-3"
                          >
                            <span className="absolute left-0 top-[0.7em] h-px w-2 bg-accent/70" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>

      {education.map((school) => (
        <Reveal key={school.school} delay={160}>
          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-[14px] text-fg-2">
              <span className="label mr-3 !text-[9.5px] !text-fg-4">Education</span>
              <a href={school.href} target="_blank" rel="noreferrer" className="link-quiet !text-fg-2">
                {school.school}
              </a>
              <span className="text-fg-4"> · </span>
              <span className="text-fg-3">{school.degree}</span>
            </p>
            <span className="mono !text-[11px] tabular-nums">{school.period}</span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
