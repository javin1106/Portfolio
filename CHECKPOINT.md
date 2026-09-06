# Checkpoint — portfolio rebuild

**Date:** 6 Sep 2026 · **State:** builds clean, typechecks clean, lints clean.
Everything below is committed to the working tree but **not yet git-committed**
(the last commit is still `6a88c87 Build Javin chromatic portfolio`, the old site).

---

## What was decided

| Question | Your answer |
|---|---|
| Stack | Clean **Next.js 16 App Router + Vercel**. The old Cloudflare/vinext/drizzle/D1 scaffold was deleted. |
| Palette | **Warm paper on ink, dark by default**, one terracotta accent. Light mode included. |
| Hero | Full-bleed background photograph. Current one is an Unsplash night-sky placeholder — **you said you'd pick the real image later**. |
| Extras | GitHub activity graph, LeetCode stats, "Currently / reading". No blog, no separate open-source section. |
| Structure | One scrolling home page, plus **separate `/gallery`** (photo collage + lightbox) and **`/resume`** pages. |

LeetCode profile confirmed as `javinchutani`; GitHub as `javin1106`.

---

## What exists now

```
app/
  layout.tsx          fonts, metadata, pre-paint theme script
  page.tsx            the single scrolling home page (7 numbered sections)
  globals.css         all design tokens + animation primitives
  gallery/page.tsx    masonry collage
  resume/page.tsx     print-optimised one-pager
  og-preview/page.tsx build-time source for the share card (noindex)
  icon.svg            favicon (J monogram)
  sitemap.ts robots.ts
components/
  hero, site-nav, section, work, experience, now, stats,
  contact, gallery-grid, reveal, print-button, icons
content/profile.ts    EVERY word on the site lives here
lib/github.ts         scrapes GitHub's public contribution calendar
lib/leetcode.ts       LeetCode GraphQL
scripts/og.mjs        regenerates public/og.png via headless Chrome
```

**Type system:** Instrument Serif (name, big statements, stat numerals) ·
Inter (body) · JetBrains Mono (labels, dates, chips, nav).

**Live data verified working:** 226 GitHub contributions, 15 repos / 21 stars /
15 followers, 415 LeetCode solved (125E / 233M / 57H), rank ~301,320.
Both fetchers cache for 6h and fail soft — if an API is down the panel shows a
quiet fallback instead of breaking the page.

---

## Two bugs already found and fixed (don't reintroduce)

1. **next/font variables must go on `<html>`, not `<body>`.** Tailwind v4's
   `@theme` resolves `--font-sans/serif/mono` at `:root`; if the next/font
   classes sit on `<body>`, every font silently falls back to sans with no error.
2. **`pkill -f "next start"` does not kill node on Windows.** Use PowerShell:
   `Get-NetTCPConnection -LocalPort 3111 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`.
   Otherwise you screenshot a stale build and chase ghosts.

---

## Pick up here tomorrow

**Needs your input:**

1. **The hero image.** Swap `profile.hero.src` in `content/profile.ts` — drop a
   file in `/public` and point at `/your-file.jpg`. `position` controls the crop.
2. **Gallery photos.** Six Unsplash placeholders. Replace with your own —
   `/public/gallery/*.jpg`, and set each `ratio` to that image's width / height.
3. **Phone number.** Your résumé PDF carries +91 88375-13788; the site does not.
   Deliberate — a public web page is a different exposure from a PDF you hand to
   a recruiter. Add it to `profile` if you want it there.

**Settled:**

- Every word of experience, projects, education and skills now comes from
  `Javin_Chutani_Software_Engg_Resume.pdf`. Keep the two in sync.
- Contact address is `javin.chutani@gmail.com` (hero, contact section, résumé).
- Experience is **Bajaj Housing Finance** (AI/ML Intern, Jun 2026 – Present) and
  **XCEED, NIT Jalandhar** (Research Intern, Mar 2026 – Present). The earlier
  "Open-source contributor" entry was removed as unsupported by merged PRs.
- Featured projects match your résumé's three: OnlyTrades, FlokiDB, GossipKaro.
- **Airport is deliberately not listed.** There's a comment where it would sit in
  the `projects` array; add it back once it has a README.

**Two discrepancies against the PDF, flagged not silently fixed:**

- The résumé calls the Go database **JavinKV**; the GitHub repo is **FlokiDB**.
  The site uses FlokiDB because that's what the link resolves to — rename one.
- The résumé says *350+ LeetCode*; the live API reports **415**. The site's
  achievements line says 400+ so it stays true as the number moves.

**Not yet done:**

- Not deployed. `vercel` / connect the repo, then set `NEXT_PUBLIC_SITE_URL`
  so canonical URLs, sitemap and OG tags point at the real domain.

**Verified by driving a real browser (not just by reading the code):**

- Mobile nav sheet — opens, locks body scroll, hamburger morphs to an X, closes
  and unlocks.
- Gallery lightbox — click to open, ArrowRight/ArrowLeft step and wrap around
  (02 → 01 → 06), Escape closes, body scroll restored.
- Résumé print stylesheet — `Page.printToPDF` gives 2 clean A4 pages: white
  ground, black text, nav and buttons hidden, scroll-reveals forced visible,
  link decoration stripped.

---

## Commands

```bash
npm run dev            # localhost:3000
npm run build          # production build
npm run lint
OG_URL=http://localhost:3000 npm run og   # regenerate public/og.png
```

Screenshot harness used during the rebuild (drives headless Chrome over CDP,
scrolls, waits for the scroll-reveals, captures each viewport) lives in the
session scratchpad at `shoot.mjs` — `scripts/og.mjs` is the trimmed, committed
version of the same idea.
