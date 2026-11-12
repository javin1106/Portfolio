import { profile } from "@/content/profile";

export type Day = { date: string; level: number; count: number };

export type GitHubStats = {
  total: number;
  /** Column-major: one entry per week, each holding up to 7 days. */
  weeks: Day[][];
  from: string;
  to: string;
  followers: number | null;
  publicRepos: number | null;
  stars: number | null;
};

/** GitHub's own calendar fragment — public, no token, no rate limit. */
const CALENDAR = `https://github.com/users/${profile.github}/contributions`;

const DAY_RE =
  /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-(\d+)-(\d+))"[^>]*data-level="(\d)"/g;
const COUNT_RE =
  /for="(contribution-day-component-\d+-\d+)"[^>]*>\s*(No|[\d,]+)\s+contributions?/g;

const REVALIDATE = 60 * 60 * 6; // six hours

function headers() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchCalendar(): Promise<Pick<GitHubStats, "total" | "weeks" | "from" | "to"> | null> {
  try {
    const res = await fetch(CALENDAR, {
      headers: { "User-Agent": "Mozilla/5.0", "X-Requested-With": "XMLHttpRequest" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // id -> count, read from the screen-reader tooltip that GitHub emits per cell
    const counts = new Map<string, number>();
    for (const m of html.matchAll(COUNT_RE)) {
      counts.set(m[1], m[2] === "No" ? 0 : Number(m[2].replace(/,/g, "")));
    }

    const grid = new Map<number, Day[]>();
    let total = 0;
    let from = "";
    let to = "";

    for (const m of html.matchAll(DAY_RE)) {
      const [, date, id, rowRaw, colRaw, levelRaw] = m;
      const row = Number(rowRaw);
      const col = Number(colRaw);
      const count = counts.get(id) ?? 0;

      total += count;
      if (!from || date < from) from = date;
      if (!to || date > to) to = date;

      const week = grid.get(col) ?? [];
      week[row] = { date, level: Number(levelRaw), count };
      grid.set(col, week);
    }

    if (!grid.size) return null;

    const weeks = [...grid.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, week]) => week.filter(Boolean));

    return { total, weeks, from, to };
  } catch {
    return null;
  }
}

async function fetchProfileCounts() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${profile.github}`, {
        headers: headers(),
        next: { revalidate: REVALIDATE },
      }),
      fetch(
        `https://api.github.com/users/${profile.github}/repos?per_page=100&type=owner`,
        { headers: headers(), next: { revalidate: REVALIDATE } },
      ),
    ]);

    const user = userRes.ok ? await userRes.json() : null;
    const repos = reposRes.ok ? await reposRes.json() : null;

    const stars = Array.isArray(repos)
      ? repos
          .filter((r: { fork: boolean }) => !r.fork)
          .reduce((sum: number, r: { stargazers_count: number }) => sum + r.stargazers_count, 0)
      : null;

    return {
      followers: user?.followers ?? null,
      publicRepos: Array.isArray(repos) ? repos.filter((r: { fork: boolean }) => !r.fork).length : null,
      stars,
    };
  } catch {
    return { followers: null, publicRepos: null, stars: null };
  }
}

export async function getGitHubStats(): Promise<GitHubStats | null> {
  const [calendar, counts] = await Promise.all([fetchCalendar(), fetchProfileCounts()]);
  if (!calendar) return null;
  return { ...calendar, ...counts };
}

export type LatestPush = { repo: string; url: string; at: string };

/**
 * The most recent push to any public repo, from GitHub's public events feed.
 * Cached for 30 minutes — fresh enough to prove the site is alive.
 */
export async function getLatestPush(): Promise<LatestPush | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${profile.github}/events/public?per_page=40`,
      { headers: headers(), next: { revalidate: 1800 } },
    );
    if (!res.ok) return null;

    const events = (await res.json()) as {
      type: string;
      created_at: string;
      repo: { name: string };
    }[];
    const push = events.find((e) => e.type === "PushEvent");
    if (!push) return null;

    return {
      repo: push.repo.name.split("/")[1] ?? push.repo.name,
      url: `https://github.com/${push.repo.name}`,
      at: push.created_at,
    };
  } catch {
    return null;
  }
}
