"use client";

import { useState } from "react";
import { projects, type Project } from "@/content/profile";
import { Reveal } from "./reveal";
import { ArrowUpRight } from "./icons";

const featured = projects.filter((p) => p.featured);
const rest = projects.filter((p) => !p.featured);

export function Work() {
  const [expanded, setExpanded] = useState(false);

  return (
    <ul className="-mt-1">
      {featured.map((project, i) => (
        <Reveal as="li" key={project.name} delay={i * 55}>
          <Row project={project} />
        </Reveal>
      ))}

      {expanded &&
        rest.map((project, i) => (
          <Reveal as="li" key={project.name} delay={i * 45}>
            <Row project={project} />
          </Reveal>
        ))}

      {!expanded && rest.length > 0 ? (
        <Reveal as="li" delay={featured.length * 55}>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="group mt-6 inline-flex items-center gap-2 font-mono text-[11.5px] tracking-tight text-fg-3 transition-colors duration-300 hover:text-accent"
          >
            <span className="inline-block h-px w-6 bg-line-2 transition-all duration-400 ease-[var(--ease-out-expo)] group-hover:w-9 group-hover:bg-accent" />
            Show {rest.length} more
          </button>
        </Reveal>
      ) : null}
    </ul>
  );
}

function Row({ project }: { project: Project }) {
  const primary = project.repo ?? project.live;

  return (
    <div className="row group">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="row-title flex min-w-0 items-baseline gap-2 text-[15px]">
          {primary ? (
            <a
              href={primary}
              target="_blank"
              rel="noreferrer"
              className="truncate after:absolute after:inset-0 after:z-[1] after:content-['']"
            >
              {project.name}
            </a>
          ) : (
            <span className="truncate">{project.name}</span>
          )}

          {project.status === "building" ? (
            <span
              className="relative top-[-1px] inline-flex h-1.5 w-1.5 shrink-0"
              title="In progress"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          ) : null}

          <span className="row-arrow shrink-0 text-[13px]">→</span>
        </h3>

        <span className="mono shrink-0 !text-[11px] tabular-nums">{project.year}</span>
      </div>

      <p className="mt-2 max-w-[62ch] text-[13.5px] leading-[1.7] text-fg-3 transition-colors duration-400 group-hover:text-fg-2">
        {project.blurb}
      </p>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {project.stack.map((tech) => (
          <span key={tech} className="chip">
            {tech}
          </span>
        ))}

        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="relative z-[2] ml-1.5 inline-flex items-center gap-1 font-mono text-[10.5px] tracking-tight text-fg-3 transition-colors duration-300 hover:text-accent"
          >
            Live
            <ArrowUpRight className="h-2.5 w-2.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
