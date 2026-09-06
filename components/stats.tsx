import { profile } from "@/content/profile";
import { getGitHubStats, type Day } from "@/lib/github";
import { getLeetCodeStats } from "@/lib/leetcode";
import { Reveal } from "./reveal";
import { ArrowUpRight } from "./icons";

const nf = new Intl.NumberFormat("en-US");

export async function Stats() {
  const [github, leetcode] = await Promise.all([getGitHubStats(), getLeetCodeStats()]);

  return (
    <div className="grid gap-4">
      <Reveal>
        <GitHubPanel stats={github} />
      </Reveal>
      <Reveal delay={80}>
        <LeetCodePanel stats={leetcode} />
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ panel */

function Panel({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="group/panel rounded-lg border border-line bg-bg-1/45 p-5 transition-colors duration-500 hover:border-line-2 sm:p-6">
      <header className="mb-5 flex items-center justify-between gap-4">
        <h3 className="label">{label}</h3>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[10.5px] text-fg-4 transition-colors duration-300 hover:text-accent"
        >
          Profile
          <ArrowUpRight className="h-2.5 w-2.5" />
        </a>
      </header>
      {children}
    </section>
  );
}

function Unavailable({ what }: { what: string }) {
  return (
    <p className="font-mono text-[11.5px] text-fg-4">
      {what} stats are taking a nap — check the profile link.
    </p>
  );
}

/* ------------------------------------------------------------------ github */

function GitHubPanel({ stats }: { stats: Awaited<ReturnType<typeof getGitHubStats>> }) {
  return (
    <Panel label="GitHub" href={profile.links.github}>
      {!stats ? (
        <Unavailable what="GitHub" />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="serif text-[2.1rem] leading-none tabular-nums text-fg">
              {nf.format(stats.total)}
            </span>
            <span className="text-[12.5px] text-fg-3">contributions in the last year</span>
          </div>

          <Heatmap weeks={stats.weeks} />

          <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
            <Stat label="Repos" value={stats.publicRepos} />
            <Stat label="Stars" value={stats.stars} />
            <Stat label="Followers" value={stats.followers} />
          </dl>
        </>
      )}
    </Panel>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  if (value === null) return null;
  return (
    <div className="flex items-baseline gap-1.5">
      <dd className="font-mono text-[13px] tabular-nums text-fg">{nf.format(value)}</dd>
      <dt className="label !text-[9.5px] !text-fg-4">{label}</dt>
    </div>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Heatmap({ weeks }: { weeks: Day[][] }) {
  // A month label sits over the first column that belongs to it. Column 0 is
  // almost always a partial week, so labelling it would push the real first
  // month out of the way — skip it and let the next boundary win.
  const labels: { month: string; column: number }[] = [];
  let previous = -1;
  weeks.forEach((week, column) => {
    const first = week[0];
    if (!first) return;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month !== previous) {
      previous = month;
      if (column === 0) return;
      const last = labels[labels.length - 1];
      if (!last || column - last.column >= 3) {
        labels.push({ month: MONTHS[month], column });
      }
    }
  });

  const columns = { gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` };

  return (
    <div>
      <div className="mb-1.5 grid gap-[2px]" style={columns} aria-hidden>
        {labels.map(({ month, column }) => (
          <span
            key={`${month}-${column}`}
            className="font-mono text-[9px] leading-none text-fg-4"
            style={{ gridColumnStart: column + 1, gridColumnEnd: "span 4" }}
          >
            {month}
          </span>
        ))}
      </div>

      <div
        className="grid gap-[2px]"
        style={columns}
        role="img"
        aria-label={`GitHub contribution graph for the last year`}
      >
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-rows-7 gap-[2px]">
            {week.map((day) => (
              <span
                key={day.date}
                title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                className="aspect-square w-full rounded-[1.5px] transition-transform duration-200 hover:scale-[1.45]"
                style={{ background: `var(--heat-${day.level})` }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-end gap-1.5">
        <span className="font-mono text-[9px] text-fg-4">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className="h-[9px] w-[9px] rounded-[1.5px]"
            style={{ background: `var(--heat-${level})` }}
          />
        ))}
        <span className="font-mono text-[9px] text-fg-4">More</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- leetcode */

function LeetCodePanel({ stats }: { stats: Awaited<ReturnType<typeof getLeetCodeStats>> }) {
  return (
    <Panel label="LeetCode" href={profile.links.leetcode}>
      {!stats ? (
        <Unavailable what="LeetCode" />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="serif text-[2.1rem] leading-none tabular-nums text-fg">
                {nf.format(stats.total)}
              </span>
              <span className="text-[12.5px] text-fg-3">problems solved</span>
            </div>
            {stats.ranking ? (
              <span className="font-mono text-[11px] tabular-nums text-fg-4">
                rank #{nf.format(stats.ranking)}
              </span>
            ) : null}
          </div>

          <dl className="space-y-3">
            {stats.buckets.map((bucket) => {
              const pct = bucket.available ? (bucket.solved / bucket.available) * 100 : 0;
              return (
                <div key={bucket.difficulty} className="flex items-center gap-3">
                  <dt className="label w-[52px] shrink-0 !text-[9.5px]">{bucket.difficulty}</dt>
                  <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--heat-0)]">
                    <div
                      className="h-full rounded-full bg-accent/85"
                      style={{ width: `${Math.max(pct, 1.5)}%` }}
                    />
                  </div>
                  <dd className="w-[74px] shrink-0 text-right font-mono text-[11px] tabular-nums text-fg-3">
                    <span className="text-fg">{bucket.solved}</span>
                    <span className="text-fg-4"> / {nf.format(bucket.available)}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </>
      )}
    </Panel>
  );
}
