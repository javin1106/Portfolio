# Javin — Chromatic Portfolio

A colorful, motion-led personal portfolio for Javin Chutani. The site combines
Aceternity UI components with a custom responsive visual system, live GitHub
activity, project stories, an animated experience timeline, an editorial photo
collage, and printable resume highlights.

## Highlights

- light and dark themes with saved preference
- Aceternity Aurora, Flip Words, and scroll-tracing Timeline components
- responsive project bento grid and technology constellation
- live GitHub repositories, followers, contribution count, and heatmap
- LeetCode adapter ready for a confirmed username
- accessible gallery lightbox with keyboard navigation
- reduced-motion and print-friendly resume modes
- generated Open Graph sharing artwork

## Content editing

Personal copy, projects, technology groups, experience entries, gallery images,
and social links live in `content/portfolio.ts`. The visual composition and
interactions live in `app/portfolio.tsx`; design tokens and responsive rules are
in `app/globals.css`.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm run build
npm test
```

The project uses vinext and the Sites Vite integration for Cloudflare-compatible
output.
