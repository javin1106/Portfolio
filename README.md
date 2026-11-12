# Javin Chutani — portfolio

"Engineered paper": warm ink, film grain, dotted blueprint rules, and one
palette taken from the home-page banner photos, which cycles site-wide. Next.js 16
(App Router), React 19, Tailwind v4 — no UI or animation libraries.

## What's on it

- **Onboarding** (first visit only) — your name in seven scripts, then a macOS
  terminal types two commands and flies into the nav. `Esc`/click skips it;
  add `?intro` to any home URL to see it again.
- **Terminal** — `⌘K` / `Ctrl+K` or the `>_` button. Try `help`, `projects`,
  `music`, `github`, `sudo hire javin`. Commands live in
  `components/terminal/commands.tsx`.
- **Banner** — photos in `public/banner` cycle on Home; each one sets the site's
  accent and text tint while it shows. Profile photo: `public/profile`.
- **Now playing** — live from Spotify, playable in place via Spotify's embed.
- **Skills** — the `stack` lists in the content file, scrolling under the player.
- **Activity** — GitHub contribution graph, latest push, LeetCode.
- **Off the clock** — hobbies, plus whatever photos are in `public/gallery`.

## Editing content

**Every word on the site lives in [`content/profile.ts`](content/profile.ts)** —
bio, projects (and their tags), experience, skills, hobbies, the name scripts,
the onboarding terminal lines and
the résumé and booking links. Design tokens and all motion live in
[`app/globals.css`](app/globals.css).

## Adding photos

Drop images into `public/gallery/` and push. Size, orientation and the blurred
preview are worked out at build time. Name files like
`2026-10-03 golden hour at the lake.jpg` to get a date (newest first) and a
caption. For anything a filename can't hold, add `public/gallery/captions.json`:

```json
{ "IMG_2041.jpg": { "caption": "Monsoon", "alt": "Rain on a window" } }
```

After adding photos (to `public/gallery`, `public/banner` or `public/profile`),
run `npm run photos:shrink`: it resizes anything huge to 2560px and keeps the
original in the git-ignored `_originals/` folder.

## Connecting Spotify (once)

1. [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) →
   **Create app**. Redirect URI: `http://127.0.0.1:8888/callback`. API: **Web API**.
2. Put the Client ID and Client Secret in `.env.local`:
   ```
   SPOTIFY_CLIENT_ID=...
   SPOTIFY_CLIENT_SECRET=...
   ```
3. `npm run spotify:token` → open the printed link → approve. The refresh
   token is written to `.env.local` for you.
4. Add all three `SPOTIFY_*` variables to Vercel (Project → Settings →
   Environment Variables).

Until then the card simply doesn't render in production.

## Signature

Put an SVG at `public/signature.svg`. Stroke paths (`fill="none"`) draw
themselves like a pen; filled outlines are revealed with a wipe. Without the
file, your first name in italic serif is used.

## Live data

| Panel | Source | Cache |
|---|---|---|
| Contribution graph, repos, stars, followers | GitHub's public calendar fragment + REST API | 6h |
| Latest push | GitHub public events API | 30m |
| Now playing | Spotify Web API (server-side, your refresh token) | 20s at the CDN |
| Problems solved, difficulty split, rank | LeetCode GraphQL | 6h |

Neither needs a token. Both fail soft — if an API is unreachable the panel shows
a quiet fallback rather than breaking the page. Set `GITHUB_TOKEN` if you ever
hit the unauthenticated REST rate limit.

## Development

Requires Node.js 20.9+.

```bash
npm install
npm run dev      # localhost:3000
npm run build
npm run lint
```

## The share card

`public/og.png` is a real screenshot of `/og-preview`, so it uses the actual
fonts and hero photograph rather than an approximation. Regenerate after
changing the hero image or your title:

```bash
npm run dev                                  # in one terminal
OG_URL=http://localhost:3000 npm run og      # in another
```

## Deploying

Push to GitHub and import the repo on Vercel — no configuration needed. Set
`NEXT_PUBLIC_SITE_URL` to the final domain so canonical URLs, `sitemap.xml` and
the Open Graph tags point at the right place.
