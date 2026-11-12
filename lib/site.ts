/**
 * The site's public address, used for share cards (og:image), the sitemap and
 * canonical links. These must be absolute URLs on the *live* domain, or
 * X / LinkedIn / WhatsApp can't fetch the preview image.
 *
 * Order of preference:
 *  1. NEXT_PUBLIC_SITE_URL, if you set one (e.g. a custom domain);
 *  2. VERCEL_PROJECT_PRODUCTION_URL, which Vercel sets on every build to your
 *     production domain (e.g. javincodes.vercel.app), so renaming the project
 *     can't silently break the share card again;
 *  3. localhost, for local builds.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");
