import "server-only";
import { profile, projects, workExclude, type Project } from "@/content/profile";

/**
 * Selected work = the repos pinned on your GitHub profile (minus `workExclude`),
 * followed by any other project marked `featured` in content/profile.ts.
 *
 * GitHub only exposes pins through GraphQL (which needs a token) or the
 * profile page itself, so this reads the public profile HTML — the same thing
 * a visitor sees — and caches it for six hours. Each pin is matched to the
 * richer entry in content/profile.ts by its repo URL; a pin with no entry
 * still shows, using GitHub's own description. If GitHub can't be reached,
 * it falls back to the projects marked `featured`.
 */

export type WorkItem = Project & { stars: number | null; language: string | null };

type Pin = { slug: string; description: string; language: string | null; stars: number };

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

async function fetchPins(): Promise<Pin[] | null> {
  try {
    const res = await fetch(`https://github.com/${profile.github}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const pins = [...html.matchAll(/<div class="pinned-item-list-item-content">([\s\S]*?)<\/li>/g)].map(
      ([, block]) => {
        const href = block.match(/href="\/[^/"]+\/([^/"]+)"/)?.[1] ?? "";
        const description = decode(block.match(/<p class="pinned-item-desc[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "");
        const language = block.match(/itemprop="programmingLanguage">([^<]+)</)?.[1] ?? null;
        const stars = Number(
          block.match(/\/stargazers"[\s\S]*?<\/svg>\s*([\d,]+)/)?.[1]?.replace(/,/g, "") ?? 0,
        );
        return { slug: href, description, language, stars };
      },
    );
    return pins.filter((p) => p.slug);
  } catch {
    return null;
  }
}

const slugOf = (url?: string) => url?.split("/").pop()?.toLowerCase() ?? "";

export async function getSelectedWork(): Promise<WorkItem[]> {
  const pins = await fetchPins();
  const excluded = new Set(workExclude.map((s) => s.toLowerCase()));

  if (!pins?.length) {
    return projects.filter((p) => p.featured).map((p) => ({ ...p, stars: null, language: null }));
  }

  const pinned: WorkItem[] = pins
    .filter((pin) => !excluded.has(pin.slug.toLowerCase()))
    .map((pin) => {
      const known = projects.find((p) => slugOf(p.repo) === pin.slug.toLowerCase());
      if (known) return { ...known, stars: pin.stars, language: pin.language };
      return {
        name: pin.slug,
        summary: pin.description || "A pinned repository.",
        blurb: pin.description,
        year: "",
        stack: pin.language ? [pin.language] : [],
        status: "shipped" as const,
        repo: `https://github.com/${profile.github}/${pin.slug}`,
        stars: pin.stars,
        language: pin.language,
      };
    });

  const shown = new Set(pinned.map((p) => p.name));
  const extra = projects
    .filter((p) => p.featured && !shown.has(p.name))
    .map((p) => ({ ...p, stars: null, language: null }));

  return [...pinned, ...extra];
}
