import { getNowPlaying } from "@/lib/spotify";

/**
 * Polled by the now-playing card every ~30s. The CDN holds each answer for
 * 20s, so however many people have the page open, Spotify sees at most a
 * few requests a minute.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getNowPlaying();
  return Response.json(data, {
    headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40" },
  });
}
