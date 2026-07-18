const githubUsername = "javin1106";
const leetcodeUsername = "";

type Contribution = {
  date?: string;
  count?: number;
  level?: number;
};

async function safeJson(url: string): Promise<any | null> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "javin-portfolio",
      },
      next: { revalidate: 21_600 },
    });

    if (!response.ok) return null;
    return (await response.json()) as any;
  } catch {
    return null;
  }
}

export async function GET() {
  const [github, contributions, leetcode] = await Promise.all([
    safeJson(`https://api.github.com/users/${githubUsername}`),
    safeJson(
      `https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`,
    ),
    leetcodeUsername
      ? safeJson(`https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`)
      : Promise.resolve(null),
  ]);

  const contributionDays: Contribution[] = Array.isArray(
    contributions?.contributions,
  )
    ? contributions.contributions.slice(-112)
    : [];

  return Response.json(
    {
      github: github
        ? {
            repos: github.public_repos ?? null,
            followers: github.followers ?? null,
            profile: github.html_url ?? `https://github.com/${githubUsername}`,
          }
        : null,
      contributions: {
        total:
          contributions?.total?.lastYear ??
          contributions?.total?.[new Date().getFullYear()] ??
          null,
        days: contributionDays.map((day) => ({
          date: day.date ?? "",
          count: day.count ?? 0,
          level: Math.max(0, Math.min(4, Number(day.level ?? 0))),
        })),
      },
      leetcode:
        leetcode?.status === "success"
          ? {
              total: leetcode.totalSolved ?? null,
              easy: leetcode.easySolved ?? null,
              medium: leetcode.mediumSolved ?? null,
              hard: leetcode.hardSolved ?? null,
              ranking: leetcode.ranking ?? null,
            }
          : null,
      syncedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    },
  );
}
