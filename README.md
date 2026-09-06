# Javin Chutani — portfolio

A minimal, typography-led personal site. Dark by default, warm paper on ink,
one terracotta accent. Built with Next.js 16 (App Router), React 19 and
Tailwind v4 — three runtime dependencies, no UI or animation libraries.

> Mid-rebuild: see [CHECKPOINT.md](CHECKPOINT.md) for what still needs your
> input before this goes live.

## Structure

- `/` — one scrolling page: work, experience, education, live stats, currently, contact
- `/gallery` — masonry photo collage with a keyboard-navigable lightbox
- `/resume` — a print-optimised one-pager (`Save as PDF` uses the browser's own dialog)

## Editing content

**Every word on the site lives in [`content/profile.ts`](content/profile.ts).**
Bio, projects, experience, education, the "currently" list, gallery images and
nav — all of it. The components read from that file and never hard-code copy.

Design tokens (colour, type scale, animation easing) live at the top of
[`app/globals.css`](app/globals.css). Change the palette in one place and both
themes follow.

## Live data

| Panel | Source | Cache |
|---|---|---|
| Contribution graph, repos, stars, followers | GitHub's public calendar fragment + REST API | 6h |
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
