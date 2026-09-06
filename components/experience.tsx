import { education, experience } from "@/content/profile";
import { Reveal } from "./reveal";

export function Experience() {
  return (
    <ul className="-mt-1">
      {experience.map((job, i) => (
        <Reveal as="li" key={job.role + job.period} delay={i * 60}>
          <div className="row group cursor-default">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="row-title text-[15px]">{job.role}</h3>
              <span className="mono shrink-0 !text-[11px] tabular-nums">{job.period}</span>
            </div>

            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[13px] text-fg-2">
              {job.orgHref ? (
                <a
                  href={job.orgHref}
                  target="_blank"
                  rel="noreferrer"
                  className="link-quiet !text-fg-2"
                >
                  {job.org}
                </a>
              ) : (
                <span>{job.org}</span>
              )}
              {job.meta ? (
                <>
                  <span className="text-fg-4">·</span>
                  <span className="font-mono text-[11px] text-fg-3">{job.meta}</span>
                </>
              ) : null}
            </p>

            <ul className="mt-3 space-y-1.5">
              {job.points.map((point) => (
                <li
                  key={point}
                  className="relative max-w-[62ch] pl-4 text-[13.5px] leading-[1.7] text-fg-3 transition-colors duration-400 group-hover:text-fg-2"
                >
                  <span className="absolute left-0 top-[0.62em] h-px w-2 bg-line-2" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

export function Education() {
  return (
    <ul>
      {education.map((school, i) => (
        <Reveal as="li" key={school.school} delay={i * 60}>
          <div className="row group">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="row-title flex min-w-0 items-baseline gap-2 text-[15px]">
                <a
                  href={school.href}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate after:absolute after:inset-0 after:content-['']"
                >
                  {school.school}
                </a>
                <span className="row-arrow shrink-0 text-[13px]">→</span>
              </h3>
              <span className="mono shrink-0 !text-[11px] tabular-nums">{school.period}</span>
            </div>
            <p className="mt-1.5 text-[13.5px] text-fg-3">{school.degree}</p>
            <p className="mt-0.5 font-mono text-[10.5px] text-fg-4">{school.full}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
