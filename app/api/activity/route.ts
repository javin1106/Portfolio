import { getGitHubStats, getLatestPush } from "@/lib/github";
import { getLeetCodeStats } from "@/lib/leetcode";

/** A small summary for the terminal's `github`/`leetcode` commands and the calendar. */
export const revalidate = 1800;

export async function GET() {
  const [github, push, leetcode] = await Promise.all([
    getGitHubStats(),
    getLatestPush(),
    getLeetCodeStats(),
  ]);

  return Response.json({
    github: github
      ? {
          total: github.total,
          repos: github.publicRepos,
          stars: github.stars,
          followers: github.followers,
        }
      : null,
    push,
    // Days with at least one contribution, for the calendar's dots.
    calendar: github
      ? Object.fromEntries(
          github.weeks.flat().filter((d) => d.count > 0).map((d) => [d.date, d.count]),
        )
      : {},
    leetcode: leetcode
      ? { total: leetcode.total, ranking: leetcode.ranking, buckets: leetcode.buckets }
      : null,
  });
}
