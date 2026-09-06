import { profile } from "@/content/profile";

export type LeetCodeStats = {
  total: number;
  ranking: number | null;
  buckets: { difficulty: "Easy" | "Medium" | "Hard"; solved: number; available: number }[];
};

const QUERY = `query stats($username: String!) {
  matchedUser(username: $username) {
    profile { ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }
  allQuestionsCount { difficulty count }
}`;

type Bucket = { difficulty: string; count: number };

export async function getLeetCodeStats(): Promise<LeetCodeStats | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({ query: QUERY, variables: { username: profile.leetcode } }),
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const user = json?.data?.matchedUser;
    if (!user) return null;

    const solved: Bucket[] = user.submitStatsGlobal?.acSubmissionNum ?? [];
    const available: Bucket[] = json?.data?.allQuestionsCount ?? [];

    const pick = (list: Bucket[], difficulty: string) =>
      list.find((b) => b.difficulty === difficulty)?.count ?? 0;

    return {
      total: pick(solved, "All"),
      ranking: user.profile?.ranking ?? null,
      buckets: (["Easy", "Medium", "Hard"] as const).map((difficulty) => ({
        difficulty,
        solved: pick(solved, difficulty),
        available: pick(available, difficulty),
      })),
    };
  } catch {
    return null;
  }
}
