import "server-only";

/**
 * Spotify "now playing", read with your own account's refresh token.
 *
 * Needs three environment variables (see scripts/spotify-token.mjs):
 *   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 *
 * Everything here runs on the server. The browser only ever sees the track
 * metadata, never a token.
 */

export type Track = {
  title: string;
  artist: string;
  album: string;
  art: string | null;
  url: string;
  durationMs: number;
};

export type NowPlaying = {
  configured: boolean;
  /** True only while audio is actually playing right now. */
  isPlaying: boolean;
  track: Track | null;
  /** Position in the track when this was fetched (playing or paused). */
  progressMs: number | null;
  /** ISO time the track was last played, when we fell back to history. */
  playedAt: string | null;
  fetchedAt: number;
};

const API = "https://api.spotify.com/v1";

let cachedToken: { value: string; expiresAt: number } | null = null;

function credentials() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  return id && secret && refresh ? { id, secret, refresh } : null;
}

async function accessToken(): Promise<string | null> {
  const creds = credentials();
  if (!creds) return null;
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.value;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${creds.id}:${creds.secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: creds.refresh }),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

type SpotifyImage = { url: string; width: number | null };
type SpotifyItem = {
  type: "track" | "episode";
  name: string;
  duration_ms: number;
  external_urls: { spotify: string };
  artists?: { name: string }[];
  album?: { name: string; images: SpotifyImage[] };
  show?: { name: string; publisher: string };
  images?: SpotifyImage[];
};

/** The smallest cover that is still at least 300px wide. */
function pickArt(images: SpotifyImage[] | undefined) {
  if (!images?.length) return null;
  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return (sorted.filter((i) => (i.width ?? 0) >= 300).pop() ?? sorted[0]).url;
}

function toTrack(item: SpotifyItem): Track {
  const isEpisode = item.type === "episode";
  return {
    title: item.name,
    artist: isEpisode
      ? (item.show?.publisher ?? "")
      : (item.artists ?? []).map((a) => a.name).join(", "),
    album: isEpisode ? (item.show?.name ?? "") : (item.album?.name ?? ""),
    art: pickArt(isEpisode ? item.images : item.album?.images),
    url: item.external_urls.spotify,
    durationMs: item.duration_ms,
  };
}

const EMPTY = (configured: boolean): NowPlaying => ({
  configured,
  isPlaying: false,
  track: null,
  progressMs: null,
  playedAt: null,
  fetchedAt: Date.now(),
});

export async function getNowPlaying(): Promise<NowPlaying> {
  const token = await accessToken().catch(() => null);
  if (!token) return EMPTY(Boolean(credentials()));

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const current = await fetch(`${API}/me/player/currently-playing?additional_types=track,episode`, {
      headers,
      cache: "no-store",
    });

    // 204 = nothing in the player at all
    if (current.status === 200) {
      const json = (await current.json()) as {
        is_playing: boolean;
        progress_ms: number | null;
        item: SpotifyItem | null;
      };
      if (json.item) {
        const track = toTrack(json.item);
        return {
          configured: true,
          isPlaying: json.is_playing,
          track,
          progressMs: json.progress_ms,
          playedAt: null,
          fetchedAt: Date.now(),
        };
      }
    }

    const recent = await fetch(`${API}/me/player/recently-played?limit=1`, {
      headers,
      cache: "no-store",
    });
    if (!recent.ok) return EMPTY(true);

    const history = (await recent.json()) as {
      items: { track: SpotifyItem; played_at: string }[];
    };
    const last = history.items[0];
    if (!last) return EMPTY(true);

    const track = toTrack({ ...last.track, type: "track" });
    return {
      configured: true,
      isPlaying: false,
      track,
      progressMs: null,
      playedAt: last.played_at,
      fetchedAt: Date.now(),
    };
  } catch {
    return EMPTY(true);
  }
}
