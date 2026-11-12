"use client";

import { useEffect, useState } from "react";
import { profile, type Project } from "@/content/profile";
import type { WorkItem } from "@/lib/pinned";
import { cn } from "@/lib/utils";
import { Glyph } from "./glyphs";
import { ArrowUpRight, Close, GitHub } from "./icons";
import { Reveal } from "./reveal";

type Any = Project & Partial<Pick<WorkItem, "stars" | "language">>;

export function Work({ selected }: { selected: WorkItem[] }) {
  const [open, setOpen] = useState<Any | null>(null);

  return (
    <>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {selected.map((project, i) => (
          <Reveal key={project.name} delay={i * 55}>
            <Card project={project} index={i} onOpen={() => setOpen(project)} />
          </Reveal>
        ))}
        <Reveal delay={selected.length * 55}>
          <MoreCard />
        </Reveal>
      </div>

      <Details project={open} onClose={() => setOpen(null)} />
    </>
  );
}

/** The last tile: everything else lives on GitHub. */
function MoreCard() {
  return (
    <a
      href={profile.links.github + "?tab=repositories"}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full min-h-[220px] w-full flex-col items-start justify-between rounded-2xl border border-dashed border-line-2 p-4 transition-colors duration-500 hover:border-[color-mix(in_oklab,var(--accent)_55%,var(--line-2))]"
    >
      <GitHub className="h-5 w-5 text-fg-3 transition-colors duration-300 group-hover:text-accent" />
      <span>
        <span className="block text-[15px] font-medium text-fg">More on GitHub</span>
        <span className="mt-1 block text-[13px] leading-[1.6] text-fg-3">
          Smaller projects and experiments.
        </span>
        <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10.5px] text-fg-4 transition-colors duration-300 group-hover:text-accent">
          @{profile.github}
          <ArrowUpRight className="h-2.5 w-2.5" />
        </span>
      </span>
    </a>
  );
}

/** Stars · language (· year, in the details sheet, where there's room). */
function Meta({ project, withYear = false }: { project: Any; withYear?: boolean }) {
  const bits = [
    project.stars ? `★ ${project.stars}` : null,
    project.language ?? project.stack[0] ?? null,
    withYear ? project.year || null : null,
  ].filter(Boolean);
  return <span className="mono min-w-0 truncate !text-[10.5px] tabular-nums">{bits.join(" · ")}</span>;
}

function Card({ project, index, onOpen }: { project: WorkItem; index: number; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line-2 bg-[color-mix(in_oklab,var(--bg-1)_50%,transparent)] text-left transition-[border-color,translate] duration-500 ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_55%,var(--line-2))]"
    >
      <div className="glyph-tile relative h-[5.25rem] w-full border-b border-line-2">
        {project.glyph ? <Glyph kind={project.glyph} label={`Animated sketch of ${project.name}`} /> : null}
        <span className="absolute left-3 top-2.5 font-mono text-[10px] text-[var(--g-dim)]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[15px] font-medium text-fg transition-colors duration-300 group-hover:text-accent">
            {project.name}
          </span>
          {project.status === "building" ? <span className="live-dot !h-[5px] !w-[5px] shrink-0" title="Still building" /> : null}
        </span>
        <Tags tags={project.tags} className="mt-2" />
        <p className="mt-2 text-[13px] leading-[1.6] text-fg-3">{project.summary}</p>
        <span className="mt-auto flex items-center justify-between gap-2 pt-3">
          <Meta project={project} />
          <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10.5px] text-fg-4 transition-colors duration-300 group-hover:text-fg-2">
            details
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        </span>
      </div>
    </button>
  );
}

/** A sheet with the full story, so the grid itself never has to grow. */
function Details({ project, onClose }: { project: Any | null; onClose: () => void }) {
  // Keep the last project rendered while the sheet animates closed.
  const [shown, setShown] = useState<Any | null>(project);
  const [prevProject, setPrevProject] = useState(project);
  if (project !== prevProject) {
    setPrevProject(project);
    if (project) setShown(project);
  }
  const open = project !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={cn("fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6", open ? "visible" : "invisible delay-300")}
      role="dialog"
      aria-modal="true"
      aria-label={shown?.name}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-[color-mix(in_oklab,var(--bg)_60%,transparent)] backdrop-blur-[3px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      {shown ? (
        <div
          className={cn(
            "relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-line-2 bg-bg-1 shadow-2xl transition-[opacity,translate,scale,filter] duration-[420ms] ease-[var(--ease-out-expo)]",
            open ? "translate-y-0 scale-100 opacity-100 blur-0" : "translate-y-6 scale-[0.98] opacity-0 blur-sm",
          )}
        >
          {shown.glyph ? (
            <div className="glyph-tile relative h-40 border-b border-line-2">
              <Glyph key={shown.name} kind={shown.glyph} label={`Animated sketch of ${shown.name}`} />
            </div>
          ) : null}
          <div className="max-h-[60svh] overflow-y-auto p-5 sm:p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="serif text-[1.9rem] leading-none text-fg">{shown.name}</h2>
              <Meta project={shown} withYear />
            </div>
            <Tags tags={shown.tags} className="mt-3" />
            <p className="mt-4 text-[14px] leading-[1.75] text-fg-2">{shown.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {shown.stack.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-5">
              {shown.repo ? <ExtLink href={shown.repo}>Source</ExtLink> : null}
              {shown.live ? <ExtLink href={shown.live}>Live</ExtLink> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[color-mix(in_oklab,var(--bg)_70%,transparent)] text-fg-2 backdrop-blur transition-colors hover:text-fg"
          >
            <Close className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** What kind of work this is: small pills, as many as a project needs. */
function Tags({ tags, className }: { tags?: string[]; className?: string }) {
  if (!tags?.length) return null;
  return (
    <span className={cn("flex flex-wrap gap-1", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-accent-soft px-2 py-[1px] font-mono text-[9.5px] uppercase tracking-[0.06em] text-accent"
        >
          {tag}
        </span>
      ))}
    </span>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-mono text-[11.5px] tracking-tight text-fg-2 transition-colors duration-300 hover:text-accent"
    >
      {children}
      <ArrowUpRight className="h-3 w-3" />
    </a>
  );
}
